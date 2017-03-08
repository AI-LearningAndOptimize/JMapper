module TDA
export mapper_graph

import StatsBase, DataFrames, MultivariateStats, RDatasets,
        Clustering, PlotRecipes, Distances


    function apply_lens(df::AbstractDataFrame; alg="pca", dist="euclidean",
                        ndim=2, kwargs...)
        data = convert(Array{Array{Float64, 1}}, df.columns)
        newd = zeros(size(data)[1], size(data[1])[1])
        for i in 1:length(data)
            newd[i,:] = data[i]
        end
        M = fit(PCA, newd; maxoutdim=2)
        return DataFrame(newd'*M.proj)
    end

    function covering_patches(lens_data::AbstractDataFrame; resolution=10,
                              gain=0.5, kwargs...)
        xmin, xmax = minimum(lens_data[1]), maximum(lens_data[1]);
        ymin, ymax = minimum(lens_data[2]), maximum(lens_data[2]);
        patch_dict = Dict()

        perc_step = 100.0 / resolution
        marker_x =  [percentile(lens_data[1], post)
                    for post in perc_step:perc_step:100]

        marker_y =  [percentile(lens_data[2], post)
                    for post in perc_step:perc_step:100]

        lbd_x = vcat([xmin], marker_x)
        lbd_y = vcat([ymin], marker_y)

        ubd_x = vcat(marker_x, [xmax])
        ubd_y = vcat(marker_y, [ymax])

        widths_x = ubd_x - lbd_x
        spill_over_x = gain*widths_x
        lbd_x -= spill_over_x
        ubd_x += spill_over_x

        widths_y = ubd_y - lbd_y
        spill_over_y = gain*widths_y
        lbd_y -= spill_over_y
        ubd_y += spill_over_y

        for i in 1:resolution
            for j in 1:resolution
                patch = find(x->x==true,
                                  (lens_data[1] .> lbd_x[i]) &
                                  (lens_data[1] .> ubd_x[i]) &
                                  (lens_data[2] .> lbd_y[i]) &
                                  (lens_data[2] .> ubd_y[i]))
                key = ((round(lbd_x[i], 2), round(ubd_x[i], 2)),
                       (round(lbd_y[i], 2), round(ubd_y[i], 2)))
                patch_dict[key] = patch
            end
        end
        return patch_dict
    end

    function davies_bouldin(dist_mu, sigma)
        db = 0
        k = length(sigma)
        for i in 1:k
            d_i = 0
            for j in 1:k
                if j == i
                    continue
                end
                r_ij = (sigma[i] + sigma[j]) / dist_mu[i,j]
                if r_ij > d_i
                    println("r_ij = ", r_ij)
                    d_i = r_ij
                end
            end
            db += d_i
        end
        println("db = ", db)
        return db / k
    end

    function optimal_clustering(df::DataFrame, patch::Array{Int64,1};
                                max_K = 5, kwargs...)
        if length(patch) == 1
            return Array(patch)
        end

        if length(patch) <= 5
            K_max = 2
        else
            K_max = Int(min(length(patch) / 2, max_K))
        end

        clustering = Dict()
        db_index = []
        # patch has ID of data points
        X = df[patch, :]
        data = convert(Array{Array{Float64, 1}}, X.columns)
        newd = zeros(size(data)[1], size(data[1])[1])

        for i in 1:length(data)
            newd[i,:] = data[i]
        end
        newd = newd'

        for k in 2:K_max
            kmns = kmeans(newd', k)
            clustering[k] = kmns.assignments
            dist_mu = pairwise(Euclidean(), kmns.centers)
            sigma = []
            for i in 1:k
                pts_in_clusters = find(x->x==i, clustering[k])
                vrnc = sqrt(sum(var(newd[pts_in_clusters, :], 1)))
                append!(sigma, vrnc)
                println(sigma)
            end
            append!(db_index, davies_bouldin(dist_mu, sigma))
            # println(db_index)
        end

        k_opt = findmin(db_index)[2] + 1
        optlist = clustering[k_opt]
        return [patch[find(x->x==i, clustering[k_opt]), :] for i in 1:k_opt]
    end

    function mapper_graph(df; lens_data=nothing, lens="pca", resolution=10,
        gain=0.5, max_K = 5)
        if lens_data == nothing
            lens_data = apply_lens(df, lens = lens)
        end
        patch_clustering = Dict()
        counter = 0
        patches = covering_patches(lens_data, resolution=resolution, gain=gain)

        for patch in patches
            if length(patch[2]) > 0
                patch_clustering[patch[1]] = optimal_clustering(lens_data,
                    patch[2], max_K = max_K)
                counter += 1
            end
        end

        all_clusters = []
        for patch in patch_clustering
            append!(all_clusters, patch_clustering[patch[1]])
        end

        num_nodes = length(all_clusters)
        A = zeros((num_nodes, num_nodes))

        for i in 1:num_nodes
            for j in 1:num_nodes
                overlap = intersect(Set(all_clusters[i]), Set(all_clusters[j]))
                if length(overlap) > 0
                    A[i, j] = 1
                    A[j, i] = 1
                end
            end
        end
        graphplot(A);
    end
end

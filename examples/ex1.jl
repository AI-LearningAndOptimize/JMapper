using prototype, RDatasets, DataFrames

iris = dataset("datasets", "iris");
lens_data = apply_lens(iris[:, 1:end-1]);
mapper_graph(iris[:, 1:end-1])

# mapping a circle
t = collect(linspace(0,2*pi,1000));
x = 3*sin(t)
y = 3*cos(t)

data = zeros(length(t), 2)
data[:, 1] = x
data[:, 2] = y
data = DataFrame(data)
mapper_graph(ndat, resolution=3, gain=0.2)

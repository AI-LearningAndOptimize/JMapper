function showSeven () {

	elNews.slice(index, index+12).show();
	elPress.slice(index, index+12).show();
	// elEvent.slice(index, index+5).show();
	index += 10;
}

function onAfter(curr, next, opts) {
	// Determine which slide is displayed,
	// Send Event Tracking info to Analytics
	var eventLabel = "";
	switch(opts.currSlide){
		case  0:
			eventLabel = "Approach";
			break;
		case  1:
			eventLabel = "Time";
			break;
		case  2:
			eventLabel = "Type of Resources";
			break;
		case  3:
			eventLabel = "Result";
			break;
	}
	// Ensure Google Analytics code has been loaded
	if (_gaq)
	{
		_gaq.push(['_trackEvent', 'New vs. Old Slider', 'Clicks', eventLabel]);
	}
}

function myCustomFn(el){
    var msg="Content inside the element with id '"+el.attr("id")+"' has scrolled "+mcs.topPct+"%";

}



window.init = window.init || {};

init = {
	console: function() {
		// Avoid `console` errors in browsers that lack a console.
	    var method;
	    var noop = function noop() {};
	    var methods = [
	        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
	        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
	        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
	        'timeStamp', 'trace', 'warn'
	    ];
	    var length = methods.length;
	    var console = (window.console = window.console || {});

	    while (length--) {
	        method = methods[length];

	        // Only stub undefined methods.
	        if (!console[method]) {
	            console[method] = noop;
	        }
	    }
	},

	responsiveNavInit: function(){
		//------------------------------------------------------------------------------
		// Main Nav / Responsive Nav
		//------------------------------------------------------------------------------
		function responsiveNav() {
			if (((window.matchMedia) && window.matchMedia("(max-width: 1024px)").matches) || !($('html').hasClass('no-touch')) ) {
				// add the .mobile-nav class when 767px or lower:
				$('body').removeClass('desktop-nav').addClass('mobile-nav');
			} else {
				$('body').removeClass('mobile-nav').addClass('desktop-nav');

				// if not, clear the styles away:
				$('#nav-container').attr('style','');
				$('.cta-wrapper').attr('style','');
				$(siteHeader).find('.cta-wrapper, .plus-minus-toggle').removeClass('active');

				var siteHeaderRight = $(siteHeader).offset().left + $(siteHeader).width();
				// figure out the offset for the menu items so they don't overlap off the screen
				$('.cta-wrapper').each(function() {
					var thisMenuRight =$(this).offset().left + $(this).outerWidth();
					var adjustment =  Math.floor(siteHeaderRight - thisMenuRight);
					if (thisMenuRight > siteHeaderRight) {

						$(this).css('left', adjustment + 'px');
					}
				});
			}
		}

		var siteHeader = $('.site-header');
		responsiveNav();
		$(window).resize(function(){
			responsiveNav();
		});

		// click events possible when .repsonive-nav is there.
		// these are the bindings:
		$('.nav-outer-container').on('click',function(event) {

			if ($('body').hasClass('mobile-nav')) {
				if ($(event.target).is('#nav-toggle, #nav-toggle *')) {
					if ($('#nav-toggle').hasClass('active')) {
						$('#nav-container').slideUp(250);
						$('#nav-toggle').removeClass('active');
					} else {
						$('#nav-container').slideDown(250);
						$('#nav-toggle').addClass('active');
					}
				} else if ($(event.target).is('.inner-nav-toggle') || $(event.target).is('.inner-nav-toggle *')) {

					var selectedCtaWrapper = $(event.target).closest('li').find('.cta-wrapper');
					var plusMinusToggle = $(event.target).closest('li').find('.plus-minus-toggle');
					if ($(selectedCtaWrapper).hasClass('active')) {
						$(selectedCtaWrapper).removeClass('active').slideUp(250);
						$(plusMinusToggle).removeClass('active');
					} else {

						$(selectedCtaWrapper).addClass('active').slideDown(250);
						$(plusMinusToggle).addClass('active');
					}
				}
			}
		});
	},
	// Add Scoll class for nav background opacity
	fixedNav: function(){
		var header = $(".nav-wrap");
	    $(window).scroll(function() {
	        var scroll = $(window).scrollTop();
	        if (scroll >= 200) {
	            header.addClass("scrolling");
	        } else {
	            header.removeClass("scrolling");
	        }
	    });

	},

	svgReplace: function(){
		svgeezy.init(false, 'png');
	},

	resonsiveTear: function(){
		//------------------------------------------------------------------------------
		// Responsive Tear
		//------------------------------------------------------------------------------
		var responsiveTear = $('.responsive-tear');

		// for this to work properly, you must clear:left each of the first '.responsive-tear-item' in the row
		function responsiveTearFixHeights() {
			var item = $(responsiveTear).find('.responsive-tear-item.active');
			if (item.length > 0) {
				var tearHeight = $(item).find('.responsive-tear-bottom').height()
				$(item).css('margin-bottom',tearHeight + 'px').find('.responsive-tear-tear').css('height',tearHeight + 'px');
			}
		}

		function responsiveTearGetOffset() {
			var activeItem = $(responsiveTear).find('.responsive-tear-item.active');
			if (activeItem.length > 0) {
				var thisPosition = Math.ceil($(activeItem).offset().top);
				var marginBottomOffset = $(activeItem).css('margin-bottom').replace('px','');
				var activePosition = thisPosition;
			}

			$(responsiveTear).find('.responsive-tear-item').each(function() {
				var thisPosition = Math.ceil($(this).offset().top);

				if ( ( typeof activePosition != 'undefined' ) && ( thisPosition > activePosition ) ) {
					thisPosition = thisPosition - marginBottomOffset;
				}
				$(this).attr('data-hash-position',thisPosition);
			});
		}

		$(responsiveTear).on('click',function(el) {
			if ($(el.target).is('.responsive-tear-item *')) {
				var responsiveTearItem = $(el.target).closest('.responsive-tear-item');
			}
			if ( !($(responsiveTearItem).hasClass('no-teaser-bottom')) ) {
				if (   $(el.target).is('.responsive-tear-top')
					|| $(el.target).is('.responsive-tear-top *')
					|| $(el.target).is('.responsive-tear-close')
					|| $(el.target).is('.responsive-tear-close *') ) {
					if ($(responsiveTearItem).hasClass('active')) {
						// close the tear:
						$(responsiveTearItem).removeClass('active');
						$(responsiveTear).find('.responsive-tear-item').each(function() {
							$(this).attr('style','').find('.responsive-tear-tear').attr('style','');
						});
					} else {
						// open the tear:
						$(responsiveTear).find('.responsive-tear-item').each(function() {
							$(this).removeClass('active').attr('style','').find('.responsive-tear-tear').attr('style','');
						});
						$(responsiveTearItem).addClass('active');

						responsiveTearFixHeights();

						$(function() {
							function animate_hash() {
								if (window.matchMedia) { // basically cancels out IE8
									var hashPosition = $(responsiveTearItem).attr('data-hash-position');
									// Scroll to top + height of nav
									hashPosition = hashPosition - $('.nav-wrap').height() - 10;
									if ($('body').hasClass('admin-menu')) {
										hashPosition = hashPosition - $('#admin-menu').height();
									};
									$('body, html').animate({
										scrollTop: hashPosition
									}, 400);
								}
							}
							window.setTimeout( animate_hash, 400 ); // .4 seconds
						});

					}
				}
			}
		});
		responsiveTearFixHeights();
		responsiveTearGetOffset();
		$(window).resize(function(){
			responsiveTearFixHeights();
			responsiveTearGetOffset();
		});
	},

	noJS: function() {
		$('html').removeClass("no-js");
	},
	slideshow: function() {
		// Set variables for each slideshow
		var valpropSlideshow       = $('.valprop .slideshow-group');
		var homepageCustomers      = $('.home #customers-rotate');
		var promoSlideshow         = $('.promo .slideshow-group');
		var industrySlideshow      = $('.industry .slideshow-group');
		var productSlideshow       = $('.page-product .slideshow');
		var bioSlideshow           = $('.page-bio .slideshow');
		var comparisonSlideshow    = $('.comparison .slideshow');
		var twitterSlideshow       = $('.twitter-feed .slideshow');
		var enterpriseSlideshow    = $('.page-enterprise .slideshow-group');
		var customerQuoteSlideshow = $('.page-customers .slideshow, .page-partners .slideshow');
		var recapSlideshow = $('.page-recap .videos .slideshow-group');
		var recapTourSlideshow = $('.page-recap .tour .slideshow');
		var recapPhotosOpeningAndKeynoteSlideshow = $('.page-recap .photosOpeningAndKeynote .slideshow');
		var recapPhotosVenuesAndGuestsSlideshow = $('.page-recap .photosVenuesAndGuests .slideshow');
		var recapPhotosPanelSlideshow = $('.page-recap .photosPanel .slideshow');
		var careersEmployeeQuoteSlideshow = $('.page-careers #quote-slider');

		if (careersEmployeeQuoteSlideshow.length > 0 ){
			$('#quote-slider').bxSlider ({
				slideSelector: $('article'),
				auto: true,
				speed: 400,
				pause: 8000,
				pager: false,
				controls: false,
				mode:'fade'
			});
		}

		// Homepage Slideshows
		if ($('.homepage-old').length > 0) {
			valpropSlideshow.cycle({
			    fx:     'fade',
					//startingSlide: 1, // Start on 2nd slide per Ariane 2014.07.10
					startingSlide: 0,
			    timeout: 5000,
		        pager:  '.popup-slides-nav > ul',
		        pagerAnchorBuilder: function(idx, slide) {
		            // return sel string for existing anchor
		            return '.popup-slides-nav > ul > li:eq(' + (idx) + ') > a';
		        }
			});
			valpropSlideshow.cycle('pause');
			promoSlideshow.cycle({
			    fx:     'fade',
			    timeout: 4000,
				pager:  '.promo-slideshow-nav',
				pause: true,
				pauseOnPagerHover: true
			});
			industrySlideshow.cycle({
			    fx:     'fade',
			    timeout: 0,
		        pager:  '.industry-slideshow-nav > ul',
		        pagerAnchorBuilder: function(idx, slide) {
		            // return sel string for existing anchor
		            return '.industry-slideshow-nav > ul > li:eq(' + (idx) + ') > a';
		        }
			});
		}

		// Brilliant Enterprise Slideshow
		if (enterpriseSlideshow.length > 0) {
			enterpriseSlideshow.cycle({
			    fx:     'fade',
			    timeout: 4000,
		        prev:    '.prev',
		        next:    '.next',
		        pager:  '.popup-slides-nav > ul',
		        pagerAnchorBuilder: function(idx, slide) {
		            // return sel string for existing anchor
		            return '.popup-slides-nav > ul > li:eq(' + (idx) + ') > a';
		        }
			});
			enterpriseSlideshow.cycle('pause');
		}

		// Product Slideshow
		if (productSlideshow.length > 0) {
			productSlideshow.cycle({
			    fx:     'fade',
			    timeout: 0,
		        pager:  '.slides-nav > ul',
		        pagerAnchorBuilder: function(idx, slide) {
		            // return sel string for existing anchor
		            return '.slides-nav > ul > li:eq(' + (idx) + ') > a';
		        }
			});
		}

		// Bio Slideshow
		if (bioSlideshow.length > 0)  {
			// Team Slideshow
			var teamIndex = 0;
			function resetHeight(curr, next, opts, fwd){
		        //get the height of the current slide
		        var $ht = $(this).height();
		        //set the container's height to that of the current slide
		        $(this).parent().css("height", $ht+50);
			}
			// Get the name of the anchor minus the hash symbol
			anchor = window.location.hash.substring(1);
			switch(anchor){
				case "gunnar":
					teamIndex = 0;
					break;
				case "gary":
					teamIndex = 1;
					break;
				case "pek":
					teamIndex = 2;
					break;
				case "shane":
					teamIndex = 3;
					break;
				case "patrick":
					teamIndex = 4;
					break;
				case "harlan":
					teamIndex = 5;
					break;
				case "gurjeet":
					teamIndex = 6;
					break;
				case "lawrence":
					teamIndex = 7;
					break;
				case "james":
					teamIndex = 8;
					break;
				default:
					teamIndex = 0;
			}
			bioSlideshow.cycle({
			    fx:     'fade',
			    speed: 100,
			    timeout: 0,
		        prev:    '.prev',
		        next:    '.next',
		        after: resetHeight,
		        startingSlide: teamIndex
			});
		}

		// Old vs. New Slideshow
		if (comparisonSlideshow.length > 0)  {

			comparisonSlideshow.cycle({
			    fx:     'fade',
			    timeout: 0,
		        prev:    '.prev',
		        next:    '.next',
		        after: onAfter,
			    pager:  '.pager',
		        pagerAnchorBuilder: function(idx, slide) {
			        return 'ul.pager li:eq(' + (idx) + ') a';
			    }
			});
		}

		// Twitter Slideshow
		if (twitterSlideshow.length > 0) {
			// Don't show arrows if there's only 1 tweet
		    var slideCount = $('.twitter-feed .slideshow .slide').length;
				if (slideCount < 2)
				{
					$('.twitter-feed .slides-nav').addClass('invisible');
				}
			twitterSlideshow.cycle({
			    fx:     'scrollHorz',
			    timeout: 0,
		        prev:    '.prev',
		        next:    '.next',
		        pagerAnchorBuilder: pagerFactory

			});
			function pagerFactory(idx, slide) {
		        var s = idx > 2 ? ' style="display:none"' : '';
		        return '<li'+s+'><a href="#">'+(idx+1)+'</a></li>';
		    }
		}

		// Customer Quotes Slideshow
		if (customerQuoteSlideshow.length > 0) {
			customerQuoteSlideshow.cycle({
			    fx:     'fade',
			    timeout: 12000,
			    prev:    '.prev',
			    next:    '.next',
			});
			// customerQuoteSlideshow.cycle('pause');
		}

		// homepage customers
		if (homepageCustomers.length > 0) {
			$('#customers-rotate').bxSlider ({
				slideSelector: $('.responsive-grid-container'),
				auto: true,
				speed: 400,
				pause: 8000,
				autoHover: true,
				pager: true,
				controls: false,
				mode: 'fade',
				// ticker: true

			});
			$('.healthcare-slider').bxSlider ({
				slideSelector: $('section'),
				auto: true,
				speed: 400,
				pause: 8000,
				pager: true,
				controls: false,
				mode:'fade'
			});
		}

		// Photos for Opening and Keynote
		if (recapPhotosOpeningAndKeynoteSlideshow.length > 0) {

			recapPhotosOpeningAndKeynoteSlideshow.cycle({
			    fx:     'fade',
			    timeout: 9000,
			    prev:    '.p_prev',
			    next:    '.p_next'
			});
			recapPhotosOpeningAndKeynoteSlideshow.cycle('pause');
		}

		// Photos for Venues and Guests
		if (recapPhotosVenuesAndGuestsSlideshow.length > 0) {
			recapPhotosVenuesAndGuestsSlideshow.cycle({
			    fx:     'fade',
			    timeout: 9000,
			    prev:    '.p_prev',
			    next:    '.p_next'
			});
			recapPhotosVenuesAndGuestsSlideshow.cycle('pause');
		}

		// Photos for Panel
		if (recapPhotosPanelSlideshow.length > 0) {
			recapPhotosPanelSlideshow.cycle({
			    fx:     'fade',
			    timeout: 9000,
			    prev:    '.p_prev',
			    next:    '.p_next'
			});
			recapPhotosPanelSlideshow.cycle('pause');
		}






		if (recapTourSlideshow.length > 0)  {

			recapTourSlideshow.cycle({
			    fx:     'fade',
			    timeout: 0,
		        prev:    '.tourprev',
		        next:    '.tournext',
			    pager:  '.tpager',
				/*onPagerEvent: function(){recapPhotosSlideshow.cycle('pause')},*/
		        pagerAnchorBuilder: function(idx, slide) {
			        return 'ul.tpager li:eq(' + (idx) + ') a';
			    }
			});
			recapSlideshow.cycle('pause');
		}


	    // Data Incite 2013 Recap Slideshow
		if (recapSlideshow.length > 0) {
			recapSlideshow.cycle({
			    fx:     'fade',
			    timeout: 4000,
		        prev:    '.v_prev',
		        next:    '.v_next',
				startingSlide:1,
		        pager:  '.popup-slides-nav > ul',
		        pagerAnchorBuilder: function(idx, slide) {
		            // return sel string for existing anchor
		            return '.popup-slides-nav > ul > li:eq(' + (idx) + ') > a';
		        }
			});
			recapSlideshow.cycle('pause');
		}




	},
	foucFix: function() {
		$('.fouc-fix').removeClass("fouc-fix");
	},
	target: function () {
		$(".target").css("cursor", "pointer").click(function() {
			window.open($(".target-link",this).attr("href"),'_blank');
			return false;
		});
		$(".target-self").css("cursor", "pointer").click(function() {
			window.open($(".target-link-self",this).attr("href"),'_self');
			return false;
		});
	},
	superfish: function() {
		$('.main-nav-outer .main-nav').superfish({
			speed: 100,
			delay: 300,
			autoArrows:  false,
			dropShadows:  false
		});
	},
	colorbox: function() {
		$("a.colorbox").colorbox({			
			scalePhotos: true,
			maxWidth:'95%', 
			maxHeight:'95%',
			onOpen:function(){
				// Make sure this doesn't inherit the .theme classes
				if ($('#cboxWrapper').hasClass('theme1')) {
					$('#cboxWrapper').removeClass('theme1');
				}
				if ($('#cboxWrapper').hasClass('theme2')) {
					$('#cboxWrapper').removeClass('theme2');
				}
			}
		});		
		$("a.lightbox-video").magnificPopup({
			type: "iframe",
			removalDelay: 300,
			mainClass: 'mfp-fade',
			callbacks: {
				// for the fixed header to not move to the side with mfp:
				open: function() {
					// Will fire when this exact popup is opened
					// this - is Magnific Popup object
					$('.mfp-fix-right').css('right', $('html').css('margin-right'));
				},
				close: function() {
					$('.mfp-fix-right').css('right', 0);
					// Will fire when popup is closed
				}
			}
		});
		$("a.lightbox-content").colorbox({
			inline:true,
			width: '60%',
			scrolling: false,
			transition: 'none',
			onOpen:function(){
				if ($('#cboxWrapper').hasClass('theme1')) {
					$('#cboxWrapper').removeClass('theme1');
				}
				$('#cboxWrapper').addClass('theme2');
			}
		});

	},
	popovers: function() {
		// Prevent jumping to top
		$('.nolink').click(function(event) {
			event.preventDefault();
			}
		);

		// Show/hide popover box
		$('.popup').hover(
			// Only for Desktop-nav

				function(){
					if($("body").hasClass('desktop-nav')){
						if ($(this).hasClass("sticky"))
						{
							$(".basic-box").removeClass('selected');
							$(this).children(".basic-box").addClass('selected');
						}
						else
						{
							$(this).find(".basic-box").show();
							// If right edge of box exceeds right edge of site, flip box position
							$(this).find(".basic-box").checkPosition();
						}
					}
				},
				function(){
					if($("body").hasClass('desktop-nav')){
						if ($(this).hasClass("sticky"))
						{
							// Specific behavior for nested box
							if ($(this).hasClass("nested")) {
								$(this).children(".basic-box").removeClass('selected');
								$(this).parents(".popup").children(".basic-box").addClass('selected');
							}
						}
						else
						{
							$(this).find(".basic-box").hide();
						}
					}
				}

		);
	},
	openwide: function() {
		$('.industry-group .thumb').on('click', function() {

			// if this thumb is already active:
			if ($(this).hasClass('active')) {
				$(this).removeClass('active');
				$(this).closest('.industry-wrapper').find('.full-description-placeholder').slideUp('', function(){
					$('.full-description-placeholder').removeClass('inactive').find('.container').find('.description').remove();
				});
			} else {
				// first check if any other full-description-placeholder are open (and close them if open)
				var otherPlaceholder = $(this).closest('.industry-wrapper').siblings('.industry-wrapper').find('.full-description-placeholder');
				if ($(otherPlaceholder).is(':visible')) {
					$(otherPlaceholder).slideUp('', function(){
						$(otherPlaceholder).find('.container').find('.description').remove();
					});
				}

				$('.full-description-placeholder').find('.container').find('.description').remove();
				$('.industry-group .thumb').removeClass('active');
				$(this).addClass ('active');
				var description = $(this).next('.description').clone();
				var title = $(this).find('.title-group').clone();
				$(this).closest('.industry-wrapper').find('.full-description-placeholder .container').append(description).find('.description .module-copy').prepend(title);
				$(this).closest('.industry-wrapper').find('.full-description-placeholder').slideDown();
			}
		});

	},
	closeOpenwide: function() {
		$('.full-description-placeholder .close').on('click', function() {
			$('.industry-group .thumb').removeClass('active');
			$(this).closest('.industry-wrapper').find('.full-description-placeholder').slideUp('', function() {
				$('.full-description-placeholder').removeClass('inactive').find('.container').find('.description').remove();
			});
		});
	},
	tabs: function() {
		$('#how-it-works-tabs').tabs();
		$('.product-tabs').tabs();
		$('.solution-tabs').tabs();
		$('.tabs-vertical').tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
		$( ".tabs-vertical li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );

		$('.use-case-link').click(function() { // bind click event to link
			value = $(this).attr("data-link-value");

		    $('.tabs-vertical').tabs('select', value); // switch to fourth tab
		    $('html,body').animate({scrollTop:$(this.hash).offset().top-175}, 500);
		    event.preventDefault();

		});
	},

	howItWorks: function(){
		$('.how-it-works-applications').hover(
			function() {
	    		$( this ).addClass( "hover" );	    		
	    		$("#how-it-works-tabs").tabs({ selected: 0 });
	    		$(".highlight-selector").removeClass("platform sources").addClass("applications");
	    		$(".highlight-connector").removeClass("platform sources").addClass("applications");
	    		// console.log("App Tab");	
  			}, 
  			function() {
    			$( this ).removeClass( "hover" );
  			}
  		)
  		$('.how-it-works-platform').hover(
			function() {
	    		$( this ).addClass( "hover" );	    		
	    		$("#how-it-works-tabs").tabs({ selected: 1 });
	    		$(".highlight-selector").removeClass("applications sources").addClass("platform");
	    		$(".highlight-connector").removeClass("applications sources").addClass("platform");
	    		// console.log("Platform Tab");	
  			}, 
  			function() {
    			$( this ).removeClass( "hover" );
    			// $(".highlight-selector").removeClass("platform");
  			}
  		)
  		$('.how-it-works-sources').hover(
			function() {
	    		$( this ).addClass( "hover" );	    		
	    		$("#how-it-works-tabs").tabs({ selected: 2 });
	    		$(".highlight-selector").removeClass("applications platform").addClass("sources");
	    		$(".highlight-connector").removeClass("applications platform").addClass("sources");
	    		// console.log("Sources Tab");	
  			}, 
  			function() {
    			$( this ).removeClass( "hover" );
    			// $(".highlight-selector").removeClass("sources");
  			}
  		)
  		$("#how-it-works-tabs .apps a").click(function(){  			
  			$(".highlight-selector").removeClass("platform sources").addClass("applications");
	    	$(".highlight-connector").removeClass("platform sources").addClass("applications");
	    		
  		});
  		$("#how-it-works-tabs .platform a").click(function(){  			
  			$(".highlight-selector").removeClass("applications sources").addClass("platform");
    		$(".highlight-connector").removeClass("applications sources").addClass("platform");
	    			
  		});
  		$("#how-it-works-tabs .source a").click(function(){  			
  			$(".highlight-selector").removeClass("applications platform").addClass("sources");
    		$(".highlight-connector").removeClass("applications platform").addClass("sources");
  		});
	},

	responsiveImagemap: function(){
		$('img[usemap]').rwdImageMaps();
	},
	tables: function() {
		if ($('table.deployment').length > 0) {
			$('table.deployment th:last-of-type, table.deployment td:last-of-type').addClass('highlighted');
			$('table.deployment td:eq(1)').css('width','140px').addClass('align-middle');
			$('table.deployment td:eq(2)').css('width','250px');
			$('table.deployment td:eq(3)').css('width','266px');
			$('table.deployment tbody tr').on('mouseenter mouseleave',function(event){
				$(this).toggleClass('striped');
			});
		}
	},
	random: function() {
		var n = $('.random img').length;
		var numRand = Math.floor(Math.random()*n)
		$('.random img').eq(numRand).show();
	},

	loadMore: function(){
		// news page show more.
		elNews = $(".page-media #news .feed-item");
		elPress = $(".page-media #press .feed-item");

		// elEvent = $(".section-news #events .news-items .feed-item");
		index = 0;

		elNews.hide();
		elPress.hide();
		// elBlog.hide();
		// elEvent.hide();
		showSeven();
	    //end news page show more.
	},
	equalheight: function() {
		var max_height = 0;
		function equalHeights(elements) {
			elements.each(function(){
		         if($(this).height() > max_height){
		            max_height = $(this).height();
		        }
		    });
		    elements.height(max_height);
		};
		equalHeights($('.equalheight'));
		// use alternate plugin
		$('.industry-container').matchHeight();
	},
	valign: function() {
		$('.button-play').vAlign();
	},
	inFieldLabels: function() {
		$(".infield-label label").inFieldLabels();
	},
	toggle: function() {
		$('.js-toggle-trigger').click(function(){
			$(this).toggleClass('js-toggle-open');
			$(this).parents('.row').children('.js-toggle-target').slideToggle();
			if ($(this).hasClass('js-toggle-open')) {
				$('a', this).html('Less Articles');
			}
			else {
				$('a', this).html('More Articles');
			}
			return false;
		});
	},

	// Accordian
	accordian: function(){
		$('.accordian li').click(function(){
			// event.preventDefault();
			$(".status").text('+');
			$(".accordian li").removeClass('selected');
			$(this).toggleClass('selected');
			if($(this).hasClass('selected')){
				$('.selected .status').text('');
			}
		});
	},

	// Add Selected to nav child
	selectedNav: function(){
		$('.pointer .selected').parent().parent().parent().addClass('selected');
		if($("body").hasClass('section-blog')){
			$(".main-nav li:last-of-type").addClass("selected");
		}
	},
	customScroll: function(){
		if ($('body').hasClass('homepage')) {
	        $(".video-scroll-wrapper").mCustomScrollbar({
				axis:"x",
				theme: "inset-dark"
			});
			$(".scroll-left").click(function(event){
				event.preventDefault();
				$(".video-scroll-wrapper").mCustomScrollbar("scrollTo", '+=296');
			});
			$(".scroll-right").click(function(event){
				event.preventDefault();

				$(".video-scroll-wrapper").mCustomScrollbar("scrollTo", '-=296');
			});
	    }
	},

	/* Animated Scrolling */
	scroll: function() {
		$(".scroll").click(function(event){
			event.preventDefault();
			$('html,body').animate({scrollTop:$(this.hash).offset().top-175}, 500);
		});
		if($('body').hasClass('page-customers')){
			if(location.hash == "#collaborators"){

				$('body, html').animate({ scrollTop: $('#collaborators').offset().top-140 }, 500);
			}
		}
	},

	validate: function() {
		$(".contact-form").validate({
			rules: {
				firstName: {
					required: true
				},
				lastName: {
					required: true
				},
				email: {
					required: true,
					email: true
				},
				company: {
					required: true
				},
				state: {
					required: true
				}
			},
			messages: {
				firstName: {
					required: 'First Name is a required field.'
				},
				lastName: {
					required: 'Last Name is a required field.'
				},
				email: {
					required: 'Email is a required field.',
					email: 'Please enter a valid email address.'
				},
				company: {
					required: 'Company is a required field.'
				},
				state: {
					required: 'State is a required field.'
				}
			},
			errorPlacement: function(error, element) {
				error.insertBefore(element);
				error.wrap('<div class="error-wrap" /><div class="arrow-left"></div>'); // Insert span in order to display pointer image
			}
		});
	},
	placeholder: function() {
		$('input, textarea').placeholder();
	},
	jobPosting: function() {
		$('#job--selector .button--job').on('click',function(){
			if(!$(this).hasClass('active')){
				$('.button--job').removeClass('active');
				$(this).addClass('active');
				if(this.id =='all-jobs') {
					$('.job-listings .job').show();
				} else {
					$('.job-listings .job:not(.'+this.id+')').hide();
					$('.job-listings .job.'+this.id).show();
				}
			}
		});
	},
	loadVideo: function() {
		// 2. This code loads the IFrame Player API code asynchronously.
		var tag = document.createElement('script');

		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		// 3. This function creates an <iframe> (and YouTube player)
		//    after the API code downloads.
		var player;
		window.onYouTubeIframeAPIReady = function() {
			player = new YT.Player('yt-player', {
				height: '390',
				width: '640',
				videoId: 'OLTOt1y_X8U',
				playerVars: {
					'autoplay': 1,
					'controls': 0,
					'loop':1,
					'start':2,
					'end':11,
					'rel':0,
					'modestbranding': 0,
					'showinfo':0
				},
				events: {
					'onReady': onPlayerReady,
					'onStateChange': onPlayerStateChange
				}
			});
		}

		// 4. The API will call this function when the video player is ready.
		function onPlayerReady(event) {
			event.target.mute();
			event.target.playVideo();
		}

		// 5. The API calls this function when the player's state changes.
		//    The function indicates that when playing a video (state=1),
		//    the player should play for six seconds and then stop.
		var done = false;
		function onPlayerStateChange(event) {
			if (event.data === 0 && !done) {
				event.target.mute();
				event.target.playVideo().seekTo(2);
			}
		}
		function stopVideo() {
			done = true;
			player.stopVideo();
		}

		window.playVideo = function(){
			//player.playVideo();
		}
	}
}

$(document).ready(function() {
  $.each(init,
    function(i,item) {
      item();
    }
  );

});


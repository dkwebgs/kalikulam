
(function($) {
    var $background_slide = $("<img />").addClass("vegas-background_slide"), $overlay = $("<div />").addClass("vegas-overlay"), $loading = $("<div />").addClass("vegas-loading"), $current = $(), paused = null, background_slides = [], step = 0, delay_slide = 5e3, walk = function() {}, timer_slide, methods = {
       
       init: function(settings) {	    
            var options = {
                src: getbackground_slide(cont_gallery_slide),
                align: "left",
                valign: "top",                
                fade: 4000,
                dx_scroll:200,
                loading: true,                
                load: function() {},
                complete: function() {}
            };
            $.extend(options, $.vegas_slide.defaults.background_slide, settings);
            if (options.loading) {               
                loading();
            }
	    if (init_step>0){step=init_step; init_step=0; }
            var $new = $background_slide.clone();         
            
            $new.css({                
                position: position_gallery
            }).bind("load", function() {
                if ($new == $current) {
                    return;
                }
		   $(window).bind("load resize.vegas", function(e) {
                    resize($new, options);
                });
		   

                if ($current.is("img")) {
                    $current.stop();
                    $new.hide().insertAfter($current).fadeIn(options.fade, function() {
                        $(".vegas-background_slide").not(this).remove();
                        cont_gallery_slide.trigger("vegascomplete", [ this, step - 1 ]);
			//$("#thumbnails").mCustomScrollbar("scrollTo","#tb"+( step - 1));
                        options.complete.apply($new, [ step - 1 ]);
			
			
                    });
                } else {
                    $new.hide().prependTo(cont_gallery_slide).fadeIn(options.fade, function() {
                        cont_gallery_slide.trigger("vegascomplete", [ this, step - 1 ]);
                        options.complete.apply(this, [ step - 1 ]);
                    });
                }
                $current = $new;
                resize($current,options,step-1);
                if (options.loading) {
                    loaded();
                }
               cont_gallery_slide.trigger("vegasload", [ $current.get(0), step - 1 ]);
                options.load.apply($current.get(0), [ step - 1 ]);
                if (step) {
                   cont_gallery_slide.trigger("vegaswalk", [ $current.get(0), step - 1 ]);
                    options.walk.apply($current.get(0), [ step - 1 ]);
                }
                if (Object.keys(background_slides).length>1){                
                        //var ps=thumbnails.cont_thumbnails.find(".mCSB_container").position()
                        //var lf;


                }        
            }).attr({"src":options.src,"id":"vegas_img_"+(step-1)});

            return $.vegas_slide;
        },
        destroy_slide: function(elem,what) {
            $.each(elem, function( index, value ) {
               $(value).html("");
                })
            //$("#thumbnails,#galley,#thumb_numbers").html("");
            
            
            if (!what || what == "background_slide") {
                $(".vegas-background_slide, .vegas-loading").remove();
                
                $(window).unbind("*.vegas");
                $current = $();
            }
            if (!what || what == "overlay") {
                $(".vegas-overlay").remove();
            }
            clearInterval(timer_slide);
            return $.vegas_slide;
        },
        slideshow_slide: function(settings, keepPause) {
	    
            var options = {
                step: step,
                delay_slide: delay_slide,
		init_step: 0,
                preload: false,
                loading: true,
                background_slides: background_slides,
                walk: walk
            };
            $.extend(options, $.vegas_slide.defaults.slideshow_slide, settings);
            if (options.background_slides != background_slides) {
                if (!settings.step) {
                    options.step = 0;
                }
                if (!settings.walk) {
                    options.walk = function() {};
                }
                if (options.preload) {
                    $.vegas_slide("preload", options.background_slides);
                }
            } /////
           background_slides = options.background_slides;
           delay_slide = options.delay_slide;
	 
	    scroll_tb=true;
	    on_next_prev=false;
	    init_step=options.init_step;
	     cont_gallery_slide=options.cont_gallery_slide;
	     position_gallery=options.position_gallery;

            
            step = options.step;
            walk = options.walk;
            clearInterval(timer_slide);
            if (!background_slides.length) {
                return $.vegas_slide;
            }
            var doslideshow_slide = function() {
                if (step < 0) {
                    step = background_slides.length - 1;
                }
                if (step >= background_slides.length || !background_slides[step - 1]) {
                    step = 0;
                }
                var settings = background_slides[step++];
                settings.walk = options.walk;
                settings.loading = options.loading;
                if (typeof settings.fade == "undefined") {
                    settings.fade = options.fade;
                }
                if (settings.fade > options.delay_slide) {
                    settings.fade = options.delay_slide;
                }
                $.vegas_slide(settings);
            };
            doslideshow_slide();
            if (!keepPause) {
                paused = false;
               cont_gallery_slide.trigger("vegasstart", [ $current.get(0), step - 1 ]);
            }
            if (!paused) {
                timer_slide = setInterval(doslideshow_slide, options.delay_slide);
            }
           return $.vegas_slide;
        },
        next: function() {
	    return $.vegas_slide;
        },
        previous: function() {
	    return $.vegas_slide;
        },
        jump: function(s) {
	     return $.vegas_slide;
        },
        stop: function() {
            var from = step;
            step = 0;
            paused = null;
            clearInterval(timer_slide);
            cont_gallery_slide.trigger("vegasstop", [ $current.get(0), from - 1 ]);
            return $.vegas_slide;
        },
        pause: function() {
            paused = true;
            clearInterval(timer_slide);
           cont_gallery_slide.trigger("vegaspause", [ $current.get(0), step - 1 ]);
            return $.vegas_slide;
        },
        get: function(what) {
            if (what === null || what == "background_slide") {
                return $current.get(0);
            }
            if (what == "overlay") {
                return $overlay.get(0);
            }
            if (what == "step") {
                return step - 1;
            }
            if (what == "paused") {
                return paused;
            }
        },
        preload: function(background_slides) {
            return $.vegas_slide;
        },
	descr_html:function(settings){

	    return $.vegas_slide;
        },
	vegas_resize:function() {
	     resize($("#vegas_img_"+((step-1<0?(0):(step-1)))),background_slides[step-1],(step-1));
             return $.vegas_slide;
	},

    };
    function resize($img, settings, id) {

        var options = {
            align: "left",
            valign: "top",
            scale:true
        };
     
        $.extend(options, settings);
	//console.log(options)
        if (typeof (settings)!="undefined") {
            $.extend(options, settings.property_image);
        }
        
        if ($img.height() === 0) {
            $img.load(function() {
                resize($(this), settings,id);
            });
            return;
        }

       if (typeof (cont_gallery_slide)!="undefined") {
        var vp = getViewportSize(cont_gallery_slide),
                ww = vp.width,
                wh = vp.height,
                iw = $img.width(),
                ih = $img.height(),
                rw = wh / ww,
                ri = ih / iw,
                newWidth,
                newHeight,
                newLeft,
                newTop,
                properties;
        if (options.scale){
            if (rw > ri) {
                newWidth = wh / ri;
                newHeight = wh;
            } else {
                newWidth = ww;
                newHeight = ww * ri;
            }
        } else {            
            newWidth = wh / ri;
            newHeight = wh;  //vericale
            if (rw > ri) {  
                newWidth = ww;
                newHeight = ww * ri; //orizzolntale
            } else {                
                newWidth = wh / ri;
                newHeight = wh;  //vericale
            }
        }    
        properties = {
            width: newWidth + "px",
            height: newHeight + "px",
            top: "auto",
            bottom: "auto",
            left: "auto",
            right: "auto"
        };
        
        
	  
        
        if (!isNaN(parseInt(options.valign, 10))) {
            properties.top = 0 - (newHeight - wh) / 100 * parseInt(options.valign, 10) + "px";
        } else if (options.valign == "top") {
            properties.top = 0;
        } else if (options.valign == "bottom") {
            properties.bottom = 0;
        } else {
            properties.top = (wh - newHeight) / 2;
        }
        if (position_gallery=="fixed"){ properties.top+=cont_gallery_slide.position().top;}
        
        if (!isNaN(parseInt(options.align, 10))) {
            properties.left = 0 - (newWidth - ww) / 100 * parseInt(options.align, 10) + "px";
        } else if (options.align == "left") {
            properties.left = 0;
        } else if (options.align == "right") {
            properties.right = 0;
        } else {
            properties.left = (ww - newWidth) / 2;
        }
        if (position_gallery=="fixed"){ properties.left+=cont_gallery_slide.position().left;}
        $img.css(properties);
        
       }
        
    }
    function loading() {
        
        //$loading.css({position: position_gallery})
        //$loading.prependTo(cont_gallery_slide).fadeIn();
    }
    function loaded() {
        //$loading.fadeOut("fast", function() {
         //   $(this).remove();
        //});
    }
    function getbackground_slide(cont_gallery_slide) {        
        if (cont_gallery_slide.css("background_slideImage")) {
            return cont_gallery_slide.css("background_slideImage").replace(/url\("?(.*?)"?\)/i, "$1");
        }
    }
   
    function getViewportSize(cont_gallery_slide) {
        var elmt = window, prop = "inner"; var sz;
        if (!("innerWidth" in window)) {           
            elmt = document.documentElement || ((cont_gallery_slide.is( "body" ))?(document.body):(cont_gallery_slide));
            prop = "client";
        }
       
        if (cont_gallery_slide.is( "body" )){            
         sz={width: elmt[prop + "Width"],  height: elmt[prop + "Height"]};
        } else {
            sz={width: cont_gallery_slide.width(),  height:cont_gallery_slide.height()};
        }
        return sz;
    }
   
    $.vegas_slide = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === "object" || !method) {
            return methods.init.apply(this, arguments);
	    
        } else {
            $.error("Method " + method + " does not exist");
        }
    };
    $.vegas_slide.defaults = {
        background_slide: {}
     
    };
    

    
})(jQuery);
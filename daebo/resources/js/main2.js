if (typeof console === "undefined" || console === null) {
    console = {
      log: function() {}
    };
  }

var APP = APP || {};

APP.register = function(ns_name){
    var parts = ns_name.split('.'),
    parent = APP;    
    for(var i = 0; i < parts.length; i += 1){
        if(typeof parent[parts[i]] === "undefined"){
               parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};

(function(ns, $,undefined){    
    ns.register('main');        
    ns.main = function(){
        var  visualWrap, visualCon, aboutUtil, imgWid = 1920, imgHei = 1080, slideimg, mainSet, resize, swiperAbout, swiperOrigin, swiperIntro, interleaveOffset  = 1;
        var _init = function(){
            mainSet();
            slideimg();


            $(".gnb li a").on('mouseenter mouseleave', function(e) {               
                switch ( e.type ) {
                case 'mouseenter':                                                                                          
                    TweenLite.to($(this), 0.3, {css:{className:'+=on'}});
                    break;
                case 'mouseleave':                        
                    TweenLite.to($(this), 0.3, {css:{className:'-=on'}});
                    break;    
                }
            });

            $(".story_con").on('mouseenter mouseleave', function(e) {
                var $hvimg = $(this).find(".con_img > img");
                switch ( e.type ) {
                case 'mouseenter':                                                                                          
                    TweenLite.to($hvimg, .5, {css:{scale:1.2}, ease:Cubic.easeOut});   
                    break;
                case 'mouseleave':                        
                    TweenLite.to($hvimg, .5, {css:{scale:1}, ease:Cubic.easeOut});
                    break;    
                }
            });


            $(".btngo a").on('mouseenter mouseleave', function(e) {                
                switch ( e.type ) {
                case 'mouseenter': 
                    TweenLite.to($(this), .3, {css:{"backgroundColor":"#063c6d", "color":"#ffffff"}, ease:Cubic.easeOut});                                                                                                               
                    break;
                case 'mouseleave':                        
                    TweenLite.to($(this), .3, {css:{"backgroundColor":"transparent", "color":"#063c6d"}, ease:Cubic.easeOut});
                    break;    
                }
            });

            $(".direct_go a").on('mouseenter mouseleave click', function(e) {                
                switch ( e.type ) {
                case 'mouseenter': 
                    TweenLite.to($(this), .3, {css:{"y":20}, ease:Cubic.easeOut});                                                                                                               
                    break;
                case 'mouseleave':                        
                    TweenLite.to($(this), .3, {css:{"y":0}, ease:Cubic.easeOut});
                    break; 
                 case 'click':                        
                    $(".f_layer").fadeIn();
                    TweenLite.to($(this), .3, {css:{"opacity":0}, ease:Cubic.easeOut});
                    break;        
                }
            });

            $(".closelayer").on("click", function(){
                $(".f_layer").fadeOut();
                TweenLite.to($(".direct_go a"), .3, {css:{"opacity":1}, ease:Cubic.easeOut});
            });
        };

        var slideimg = function(){   
            var originPager = ['대보그룹', '사업분야', '대보스토리']
            var $header = $("header");
            var $footer = $(".footer");
            var $first_m0 = $(".intro_slide").find(".visual_img"),
                $first_m1 = $(".intro_slide").find(".txt_1"),
                $first_m2 = $(".intro_slide").find(".txt_2"),
                $first_m3 = $(".intro_slide").find(".btngo");

                TweenLite.set($first_m1, {opacity:0, x:-150});
                TweenLite.set($first_m2, {opacity:0, y:-50});
                TweenLite.set($first_m3, {opacity:0, y:-50});

            var swiperOrigin = new Swiper('.swiper-origin', {
                pagination: {
                    el: '.pagination-origin',
                    clickable: true,
                    renderBullet: function (index, className) {
                    var Num = index;   
                    return '<li class="'+ className +'">' + '<a href="#" class="menu_'+ Num +'">' 
                            + '<span class="txt">' + (originPager[index]) +'</span>'
                            + '<span class="dot">' + '</span>' + '</a>' + '</li>';
                    }
                },
                direction: 'vertical',
                spaceBetween: 0,
                mousewheel :true, 
                mousewheelControl: true,
                speed: 1000,
                on: {                   
                    init: function () {
                        var swiper = this;
                        t1 = new TimelineMax({});
                        t1.to($first_m1, 1, {x:0, autoAlpha:1, ease:Cubic.easeOut, delay:0.5})
                          .to($first_m2, 0.6, { y:0, autoAlpha:1, ease:Cubic.easeOut}, "-=0.2")
                          .to($first_m3, 0.6, { y:0, autoAlpha:1, ease:Cubic.easeOut}, "-=0.2")
                        t1.restart();                     
                    },                    
                    transitionStart: function () {                        
                        var swiper = this;
                        var $boxList_1 = $(".func_con").find('.list_1'),
                            $boxList_2 = $(".func_con").find('.list_2'),
                            $boxList_3 = $(".func_con").find('.list_3'),
                            $boxList_4 = $(".func_con").find('.list_4'),
                            $boxList_5 = $(".func_con").find('.list_5');

                        TweenLite.to($header, .3, {css:{"y":"-80", autoAlpha:0}, ease:Cubic.easeOut});                                                  
                        TweenLite.to($footer, .5, {css:{"bottom":"-150", autoAlpha:0}, ease:Cubic.easeOut});
                        if (swiper.activeIndex == 1) {
                            TweenLite.set( $(".about_ele").find('.tit'), {opacity:0});                            
                            TweenLite.set( $(".about_ele").find('.txt'), {opacity:0, y:-100});
                            TweenLite.set( $(".about_ele").find('.btngo'), {opacity:0, y:-50});                            
                            TweenLite.set($boxList_1, {opacity:0, x:-50});
                            TweenLite.set($boxList_2, {opacity:0, x:-50});
                            TweenLite.set($boxList_3, {opacity:0, y:-50});
                            TweenLite.set($boxList_4, {opacity:0, x:-100});
                            TweenLite.set($boxList_5, {opacity:0, y:-100});
                        }
                    },
                    transitionEnd: function () {                        
                        var swiper = this;                       
                        var $boxList_1 = $(".func_con").find('.list_1'),
                            $boxList_2 = $(".func_con").find('.list_2'),
                            $boxList_3 = $(".func_con").find('.list_3'),
                            $boxList_4 = $(".func_con").find('.list_4'),
                            $boxList_5 = $(".func_con").find('.list_5');                        
                        
                        if (swiper.activeIndex == 0) {
                            t1 = new TimelineMax({});
                            t1.to($first_m1, 1, {x:0, autoAlpha:1, ease:Cubic.easeOut, delay:0.5})
                              .to($first_m2, 0.6, { y:0, autoAlpha:1, ease:Cubic.easeOut}, "-=0.2")
                              .to($first_m3, 0.6, { y:0, autoAlpha:1, ease:Cubic.easeOut}, "-=0.2")
                            t1.restart();
                        } else {
                            TweenLite.set($first_m1, {opacity:0, x:-150});
                            TweenLite.set($first_m2, {opacity:0, y:-50});
                            TweenLite.set($first_m3, {opacity:0, y:-50});
                        }

                        if (swiper.activeIndex == 1) {
                            //TweenLite.to($header, .3, {css:{"y":"-80", autoAlpha:0}, ease:Cubic.easeOut});
                            TweenLite.to($header, .3, {css:{"y":"0", autoAlpha:1}, ease:Cubic.easeOut});
                            t21 = new TimelineMax({});
                            t21.to($(".about_ele").find('.tit'), .7, {autoAlpha:1, ease:Cubic.easeOut, delay:.2})
                              .to($(".about_ele").find('.txt'), 1, {y:0, autoAlpha:1, ease:Cubic.easeOut}, "-=0.2")
                              .to($(".about_ele").find('.btngo'), 0.5, { y:0, autoAlpha:1, ease:Cubic.easeOut}, "-=0.6")
                            t21.restart();
                            t22 = new TimelineMax({});
                            t22.to($boxList_1, .5, {x:0, autoAlpha:1, ease:Cubic.easeOut})
                              .to($boxList_2, .5, {x:0, autoAlpha:1, ease:Cubic.easeOut}, "-=0.2")
                              .to($boxList_3, .7, { y:0, autoAlpha:1, ease:Cubic.easeOut}, "-=0.3")
                              .to($boxList_4, .7, { x:0, autoAlpha:1, ease:Cubic.easeOut}, "-=0.3")
                              .to($boxList_5, .7, { y:0, autoAlpha:1, ease:Cubic.easeOut}, "-=0.3")
                            t22.restart();
                        } else {
                            TweenLite.to($header, .3, {css:{"y":"0", autoAlpha:1}, ease:Cubic.easeOut});
                        }

                        if (swiper.activeIndex == 2) {
                            TweenLite.to($footer, .5, {css:{"bottom":"0", autoAlpha:1}, ease:Cubic.easeOut});
                            t3 = new TimelineMax({});
                            t3.to($(".story_1"), .5, {y:0, autoAlpha:1, ease:Cubic.easeOut, delay:.1})
                              .to($(".story_2"), .5, {y:0, autoAlpha:1, ease:Cubic.easeOut}, "-=0.2")
                              .to($(".story_3"), .7, { y:0, autoAlpha:1, ease:Cubic.easeOut}, "-=0.4")
                              .to($(".story_4"), 1, { x:0, autoAlpha:1, ease:Cubic.easeOut}, "-=0.4");                              
                            t3.restart();
                        } else {
                            TweenLite.set( $(".story_1"), {y:-30, opacity:0});                            
                            TweenLite.set( $(".story_2"), {y:-50, opacity:0});
                            TweenLite.set( $(".story_3"), {y:-50, opacity:0});
                            TweenLite.set( $(".story_4"), {x:-150, opacity:0});
                            TweenLite.to($footer, .5, {css:{"bottom":"-150", autoAlpha:0}, ease:Cubic.easeOut});
                        }
                    }
                }
            });

            

            //intro
            var swiperIntro = new Swiper('.swiper-intro', {
                loop: false,
                speed: 1000,
                direction: 'vertical', 
                pagination: {
                     el: '.pagination-intro',
                     clickable: false,
                        renderBullet: function (index, className) {
                          return '<span class="' + className + '">' + (index + 1) + '</span>';
                     }
                },   
                watchSlidesProgress: false,
                /*mousewheel :true,
                mousewheelControl: true,*/
                keyboardControl: false,
                navigation: {
                  nextEl: ".slider-next",
                  prevEl: ".slider-prev"
                },                               
                on: {
                    init: function () {
                        var swiper = this;
                        for (var i = 0; i < swiper.slides.length; i++) {
                            TweenLite.set($(swiper.slides[i]).find(".visual_img"), {opacity:1, scale:1});                             
                        }                        
                    },
                    resize: function () {                        
                        var swiper = this;
                        for (var i = 0; i < swiper.slides.length; i++) {
                            TweenLite.set($(swiper.slides[i]).find(".visual_img"), {opacity:1, scale:1}); 
                        }
                    },
                    progress: function() {
                      var swiper = this;
                      for (var i = 0; i < swiper.slides.length; i++) {
                        var slideProgress = swiper.slides[i].progress;
                        var innerOffset = swiper.height * interleaveOffset;
                        var innerTranslate = slideProgress * innerOffset;
                        $(swiper.slides[i]).css({"transform": "translate3d(0, "+ innerOffset +", 0)"});                        
                        TweenLite.set($(swiper.slides[i]).find(".visual_img"), {opacity:.7, scale:0.9});                        
                      }
                    },
                    setTransition: function(speed) {
                      var swiper = this;
                      for (var i = 0; i < swiper.slides.length; i++) {
                        TweenLite.to( $(swiper.slides[i]).find(".visual_img"), .3, {css:{opacity:1, scale:1}, ease:Cubic.easeOut , delay:.5});                        
                        $(swiper.slides[i]).find(".visual_img").css({"transition": speed-200 + "ms", "transition-timing-function":"cubic-bezier(0.645, 0.045, 0.355, 1)"});
                      }
                    }
                  },
                nested :true            
            });

            //about
            var aboutCate = ['Construction', 'INDUSTRIAL', 'Technology']
            var aboutName = ['건설', '실업', '정보통신']
            var swiperAbout = new Swiper('.swiper-about', {
                pagination: {
                    el: '.about_pagination',
                    clickable: true,
                    renderBullet: function (index, className) {
                    var cNum = index+1                      
                    return '<li class="list_'+ cNum +'  '+ className +'">' 
                            + '<a href="#" class="box_con box_num_'+ cNum +'">' 
                            + '<p class="cate_tit fw100">' + (aboutCate[index]) + '</p>' 
                            + '<p class="cate_txt fw300">' + '대보' + '<br />' + (aboutName[index]) + '</p>' 
                            + '</a>' + '</li>';
                    }
                },
                loop: false,
                speed: 1000,
                grabCursor: false,                               
                watchSlidesProgress: true,                
                keyboardControl: false,              
                on: {
                    init: function () {
                        var swiper = this;
                        for (var i = 0; i < swiper.slides.length; i++) {                                                             
                        }                        
                    },
                    resize: function () {                        
                        var swiper = this;
                        for (var i = 0; i < swiper.slides.length; i++) {                           
                        }
                    },
                    slideChange: function () {                        
                        var swiper = this;
                        for (var i = 0; i < swiper.slides.length; i++) {     
                            tl2 = new TimelineMax({});
                            tl2.from($(swiper.slides[i]).find('.tit'), .7, {autoAlpha:0, ease:Cubic.easeOut, delay:.5})
                              .from($(swiper.slides[i]).find('.txt'), 1, {y:-100, autoAlpha:0, ease:Cubic.easeOut}, "-=0.2")
                              .from($(swiper.slides[i]).find('.btngo'), 0.5, { y:-50, autoAlpha:0, ease:Cubic.easeOut}, "-=0.6")
                            tl2.restart();                      
                        }
                    },                   
                    progress: function() {
                      var swiper = this;                     
                      for (var i = 0; i < swiper.slides.length; i++) {
                        var vis_ele = $(swiper.slides[i]).find(".about_img");
                        var txt_ele = $(swiper.slides[i]).find(".about_ele");
                        var slideProgress = swiper.slides[i].progress;
                        var innerOffset = swiper.width * interleaveOffset;
                        var innerTranslate = slideProgress * innerOffset;                                      
                        vis_ele.css({"transform":"translate3d(" + innerTranslate + "px, 0, 0)"});   
                        //txt_ele.css({"opacity":"1", "transform":"translate3d(" + innerTranslate + "px, 0, 0)"});                    
                      }
                    },
                    setTransition: function(speed) {
                      var swiper = this;                      
                      for (var i = 0; i < swiper.slides.length; i++) {
                        var ele = $(swiper.slides[i]);
                        var vis_ele = ele.find(".about_img");
                        var txt_ele = ele.find(".about_ele");                        
                        ele.css({"transition": speed + "ms"});
                        vis_ele.css({"transition": speed + "ms"});
                        //txt_ele.css({"transition": "all 1.5s cubic-bezier(0.645, 0.045, 0.355, 1)"});
                      }
                    }
                  },
                nested :true              
            });
        }; 


        var mainSet = function(){
            visualWrap = $('.index_wrap');
            visualCon = visualWrap.find('.visual_cell');
            aboutUtil = visualWrap.find('.about-func');   
            storyCon = visualWrap.find('.story_cell');   
                     
            $(window).resize(function(){
                resize();                 
            });
            resize();   
            setTimeout(resize, 100);
            setTimeout(resize, 200);
            setTimeout(resize, 300);   
        };
        var resize = function(){
            var width, height;
            width = $(window).width();                
            height = window.innerHeight;
            u_height = height/2;
            $(visualWrap).css({height:height}); 
            $(visualCon).css({height:height-68}); 
            $(aboutUtil).css({top:u_height-330});
            $(storyCon).css({top:u_height-390});            
        };
        return{
            init:_init            
        };
    }();  

}(APP || {}, jQuery));
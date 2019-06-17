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
         var leady = true, tNum = 0, totalNum = 4, menuCon, menuBg, tl, contents, overTimer;
        var  visualWrap, visualCon, visualImg, visualTopWrap, visualBottomWrap, visualTopCon, visualBottomCon, imgWid = 1920, imgHei = 1080, controllBt, reSetTimer, slideimg;
        var _init = function(){
            var index0;
            loadImg();           
            totalNum = 4;
            menuCon = $('.menu_con .menu').find('li>a');
            menuCon.on('mouseenter focusin mouseleave focusout click', menuHandler);
            menuBg = $('.menu_con .menu_bg ul').find('li');
            contents = $('.section');
            visualImg = $('.section .visual_img');
            

            index0= $('.index0');   
            $('.index0').css({"opacity":"1", "display":"block"});
            tl = new TimelineMax({});
            tl.from(index0.find('.visual_img'), .7, { scale:1.1, autoAlpha:0, ease:Cubic.easeOut})
              .from(index0.find('.txt_1'), 1, {x:-150, autoAlpha:0, ease:Cubic.easeOut, delay:0.5})
              .from(index0.find('.txt_2'), 0.6, { y:50, autoAlpha:0, ease:Cubic.easeOut}, "-=0.2")
              .from(index0.find('.btngo'), 0.6, { y:50, autoAlpha:0, ease:Cubic.easeOut}, "-=0.2")
            tl.restart();
        };
        var menuHandler = function(e){

            e.preventDefault();
            var num = $(e.currentTarget).parent().index();

            switch ( e.type ) {
                case 'mouseenter':                        
                case 'focusin':
                     clearTimeout( overTimer );
                    menuOver(num);
                    break;
                case 'focusout':
                case 'mouseleave':  

                    overTimer = setTimeout(function(){menuOver(tNum);}) ;
                    
                    break; 
                case 'click':  
                    menuSelect(num);
                    break;  
            }
        };

        var slideimg = function(){   

            /*var mySwiper = new Swiper('.swiper-container', {
                speed: 400,
                spaceBetween: 100
            });*/

            var $slider = $(".slick_sec"),
                $paging = $slider.parent().find(".dots");
            $slider.slick({                                  
                    slidesToShow: 1,
                    slidesToScroll: 1, 
                    speed: 500,
                    fade:true, 
                    autoplay: true, 
                    autoplaySpeed: 7000, 
                    arrows: false, 
                    zIndex:100,
                    appendDots: $paging,
                    customPaging : function(slider, i) {              
                        return '<button type="button" data-role="none" role="button" aria-required="false" tabindex="0">' + (i + 1) + '</button>';
                    },
                    dots:true
                });           
                    
        };


        var menuSelect = function(num){
            if(!leady)return;
            if(tNum == num)return;
            movePage(num, "down");
            menuOver(num);
            changeMenuBg(num);
        };
        var changeMenuBg = function(num){
            for(var i=0; i < 4; i++){
                if(num == i){
                   
                   TweenMax.to($(menuBg[num]), 0.3, {opacity:1, ease:Cubic.easeOut});
                   
                }else{
                    
                   TweenMax.to($(menuBg[i]), 0.3, {opacity:0, ease:Cubic.easeIn});
                }
            };
        };
        var menuOver = function(num){
            for(var i=0; i < 4; i++){
                if(num == i){
                    $(menuCon[num]).addClass('on')
                }else{
                     $(menuCon[i]).removeClass('on')
                }
            };
        };
        var loadImg = function(){
                mainSet();
                slideimg();   
        }


        var mainSet = function(){
            /*
            visualWrap = $('.event_bg');
            visualCon = $('.event_bg>.inner');

            visualTopWrap = $('.event_cover_top');
            visualBottomWrap= $('.event_cover_bottom');
            visualTopCon = $('.event_cover_top>.inner');
            visualBottomCon= $('.event_cover_bottom>.inner');*/
            
            
            $(window).resize(function(){
                resize();                 
            });
            resize();    
            setTimeout(resize, 100);
            setTimeout(resize, 200);
            setTimeout(resize, 300);

             $.fn.hasHorizontalScrollBar = function() {
                 return this.get(0) ? this.get(0).scrollWidth > this.innerWidth() : false;
            }
            $.fn.hasVerticalScrollBar = function() {
                return this.get(0) ? this.get(0).scrollHeight > this.innerHeight() : false;
            }

            $(document).mousewheel(function(event, delta) {                
                whellEvent(event, delta);
            });
        }
        var whellEvent = function(e, delta){
            e.preventDefault()
            if(!leady)return;
            var num = tNum; 
            if(delta > 0){                  
                if(num <= 0){
                    return;
                }                    
                num--;
                movePage(num, 'up');              
            } else if (delta < 0) {
                if(num >= totalNum-1){
                    return;
                }                    
                num++;
                movePage(num, 'down');
            }            
        };        
        var movePage = function(num, arrow){
            if(!leady) return;
            if(num == tNum)return;
            var yPow = 20;
            if(arrow == "down")yPow *= -1;
            leady = false;
          
            TweenLite.to($(visualImg[tNum]), 0.5, {css:{scale:.95}, ease:Cubic.easeOut}); //
            TweenLite.to( $(contents[tNum]), 0.5, {opacity:0, yPercent:yPow, delay:.5, onComplete:function(){                
                                                
                $(contents[tNum]).css('display', 'none');
                $(contents[num]).css('display', 'block');                
                TweenLite.set( $(contents[num]), {opacity:0, yPercent:-yPow});              
                TweenLite.set( $(visualImg[num]), {scale:.95});                         
                TweenLite.to( $(contents[num]), 0.5, {opacity:1, yPercent:0, onComplete:function(){
                    TweenLite.to( $(visualImg[num]), 0.5, {css:{scale:1}, ease:Cubic.easeOut}); //        
                    leady = true;
                    tNum = num; 
                    menuOver(tNum);
                }}); 
                $("html, body").animate({ scrollTop: 0 }, 0);
                if(num == 0){
                    tl.restart();
                }
                
            }});     
            menuOver(num);
            changeMenuBg(num);
             
            
        };
       
        var resize = function(){
            var width, height;
            width = $(window).width();                
            height = window.innerHeight;
           
            visualWrap = $('.index_wrap');
            visualCon = visualWrap.find('.visual_cell');           
            $(visualCon).css({height:height});            
        };
        return{
            init:_init            
        };
    }();  

}(APP || {}, jQuery));

function GoTop() {
     $( ".menu_0" ).trigger("click" );
}
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
    ns.event = function(){
         var leady = true, tNum = 0, totalNum = 6, menuCon, menuBg, tl, contents, overTimer;
        var  visualWrap, visualCon, visualImg, visualTopWrap, visualBottomWrap, visualTopCon, visualBottomCon, imgWid = 1920, imgHei = 1080, controllBt, reSetTimer;
        var _init = function(){
            var event0;
            loadImg();
            totalNum = 6;
            menuCon = $('.menu_con .menu').find('li>a');
            menuCon.on('mouseenter focusin mouseleave focusout click', menuHandler);
            menuBg = $('.menu_con .menu_bg ul').find('li');
            contents = $('.event_wrap>div');
            

            event0= $('.event0');
            $('.event0').css('opacity', 1)
            tl = new TimelineMax({});
            tl.from($('.event0').find('.obj_1'), 0.8, {x:500, scale:0.1, autoAlpha:0, ease:Back.easeOut, delay:0.3})
              .from($('.event0').find('.obj_2'), 0.8, {x:-10, y:-50, scale:0.1,autoAlpha:0, ease:Back.easeOut}, "-=0.4")
              .from($('.event0').find('.txt_1'), 0.5, {autoAlpha:0, ease:Cubic.easeOut}, "-=0.4")
              .from($('.event0').find('.txt_1'), 0.7, { y:-100,ease:Bounce.easeOut}, "-=0.5")
              .from($('.event0').find('.txt_2'), 0.5, { y:50, autoAlpha:0, ease:Cubic.easeOut}, "-=0.2")
              .from($('.event0').find('.txt_3'), 0.5, { y:50, autoAlpha:0, ease:Cubic.easeOut}, "-=0.2")
              .from($('.event0').find('.scroll_btn'), 0.5, {y:50,autoAlpha:0, ease:Cubic.easeOut}, "-=0.4")                 
              .from($('.event0').find('.obj_3'), 0.5, {x:-50, y:-20, scale:0.5,autoAlpha:0, ease:Cubic.easeOut}, "-=0.4")
              .from($('.event0').find('.obj_4'), 0.5, {x:-50, y:20, scale:0.5,autoAlpha:0, ease:Cubic.easeOut}, "-=0.4")
              .from($('.event0').find('.obj_5'), 0.5, {y:-30, scale:0.5,autoAlpha:0, ease:Cubic.easeOut}, "-=0.4")
              .from($('.event0').find('.obj_6'), 0.5, {y:60, scale:0.5,autoAlpha:0, ease:Cubic.easeOut}, "-=0.4")
              .from($('.event0').find('.obj_7'), 0.5, {x:100, scale:0.5,autoAlpha:0, ease:Cubic.easeOut}, "-=0.4")
              .from($('.event0').find('.obj_8'), 0.5, {x:-30, y:30, scale:0.5,autoAlpha:0, ease:Cubic.easeOut}, "-=0.4")
              .from($('.event0').find('.obj_9'), 0.5, {scale:0.5,autoAlpha:0, ease:Cubic.easeOut}, "-=0.4")
              .to($('.event0').find('.arrow'), 0.8, {top:45, repeat:-1, yoyo:true, ease:Cubic.easeOut, delay:.5})
           
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

                    overTimer = setTimeout(function(){menuOver(tNum);}, 600) ;
                    
                    break; 
                case 'click':  
                    menuSelect(num);
                    break;  
            }
        };

        var menuSelect = function(num){
            if(!leady)return;
            if(tNum == num)return;
            movePage(num, "down");
            menuOver(num);
            changeMenuBg(num);
        };
        var changeMenuBg = function(num){
            for(var i=0; i < 6; i++){
                if(num == i){
                   
                   TweenMax.to($(menuBg[num]), 0.3, {opacity:1, ease:Cubic.easeOut});
                   
                }else{
                    
                   TweenMax.to($(menuBg[i]), 0.3, {opacity:0, ease:Cubic.easeIn});
                }
            };
        };
        var menuOver = function(num){
            for(var i=0; i < 6; i++){
                if(num == i){
                    $(menuCon[num]).addClass('on')
                }else{
                     $(menuCon[i]).removeClass('on')
                }
            };
        };
        var loadImg = function(){
                mainSet()   
        }
        var mainSet = function(){
            visualWrap = $('.event_bg');
            visualCon = $('.event_bg>.inner');

            visualTopWrap = $('.event_cover_top');
            visualBottomWrap= $('.event_cover_bottom');
            visualTopCon = $('.event_cover_top>.inner');
            visualBottomCon= $('.event_cover_bottom>.inner');
            
            
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
                var isScroll = 0 ;
                if($('html').hasHorizontalScrollBar()) isScroll = 17;
                if ($(window).scrollTop() ==$(document).height() - window.innerHeight+ isScroll) {
                    
                    whellEventDown(event, delta);
                }
               
                if($(window).scrollTop() <=0 ){
                    whellEventUp(event, delta);
                }
            });
        }
        var whellEventUp = function(e, delta){
            if(!leady)return;
            var num = tNum; 
            if(delta > 0){                  
                if(num <= 0){
                    return;
                }                    
                num--;
                movePage(num, 'up');
              
            }
            
        }; 
        var whellEventDown = function(e, delta){
            if(!leady)return;
            var num = tNum; 
            if(delta < 0){                  
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
            var yPow = 300;
            if(arrow == "down")yPow *= -1;
            leady = false;
          
            
            TweenLite.to( $(contents[tNum]), 0.5, {opacity:0, y:yPow, onComplete:function(){
                $(contents[tNum]).css('display', 'none');
                $(contents[num]).css('display', 'block');
                TweenLite.set( $(contents[num]), {opacity:0, y:-yPow});              
                TweenLite.to( $(contents[num]), 0.5, {opacity:1, y:0, onComplete:function(){
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
            var width, height, tarW, tarH, tarX, screenR, visualR, fixedType, bX;
            width = $(window).width();                
            height = window.innerHeight;
           
            screenR = width/height;
            visualR = imgWid/imgHei;
            fixedType = (screenR>=visualR) ? "W" : "H";
            if(width > 1920){
                 
                if (fixedType=="W") {
                tarW = width;
                
                tarX = 0;
                } else {
                    tarW = Math.ceil(imgWid*height/imgHei);
                    tarH = height;
                    tarX = Math.floor((tarW-width)/2*-1);
                    tarY = 0;
                }
              
            }
            else if(width > 1200 && width <= 1920){
                if (fixedType=="W") {
                    tarW = 1920;
                  
                    tarX = Math.floor((tarW-width)/2*-1);

                } else {
                    if(height > 1080){
                        tarW = Math.ceil(imgWid*height/imgHei);
                       
                        tarX = Math.floor((tarW-width)/2*-1);
                    }else{
                        tarW = 1920;
                       
                        tarX = Math.floor((tarW-width)/2*-1);
                    }
                   
                }
               
            }else{
                if (fixedType=="W") {
                    tarW = 1920;                    
                    tarX = -360;
                } else {
                    if($(window).height()<1080){
                        tarW = 1920;
                    tarX = -360;   
                    }else{
                        tarW = Math.ceil(imgWid*height/imgHei);
                        tarX =  Math.floor((tarW-1200)/2*-1);                       
                    }
                }
            } 
            if(height>1080){
                tarH = height;
            }else{
                tarH = 1080;
            }
           
            $(visualWrap).css({height:tarH});
            $(visualCon).css({left:tarX, width:tarW, height:tarH});   

            $(visualTopWrap).css({height:tarH/10});
            $(visualTopCon).css({left:tarX, width:tarW}); 

            $(visualBottomWrap).css({height:tarH*0.18, top:tarH-$(visualBottomWrap).height()});
            $(visualBottomCon).css({left:tarX, width:tarW});     
            
        };
        return{
            init:_init            
        };
    }();  

}(APP || {}, jQuery));

function GoTop() {
     $( ".menu_0" ).trigger("click" );
}
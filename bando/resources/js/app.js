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
        }else {
            throw new Error( ( parts[ i - 1 ] || "MYAPP" ) + " 부모객체에 이미 " + parts[ i ] + " 객체가 존재합니다." );
        }

        parent = parent[parts[i]];
    }
    return parent;
};


APP.isAlphaTween = true;

var browser = navigator.userAgent;
if(browser.toLowerCase().indexOf("msie 8")>0 || browser.toLowerCase().indexOf("msie 7")>0 ){
    APP.isAlphaTween = false;
}

(function(ns, $,undefined){

    // 스크린체크
    ns.register('chkScreen');
    ns.chkScreen = function(){
        var _init = function() {
            chkScreen();
        };
        var chkScreen = function(){
            var winW = $(window).width();
            if(winW > 1600){
                $("body").removeClass("smallscreen").addClass("widescreen");
            }else{
                $("body").removeClass("widescreen").addClass("smallscreen");
            }
        };

        $(window).resize(chkScreen);

        return {
            init: _init
        }
    }();

    // GNB
    ns.register('gnb');
    ns.gnb = function(){
        var element, depth2Bg, depth2ConArr, depth1TotalNum, viewDepth2 = false, depth1Arr, depth2Arr=[], depth2ConArr=[], reSetTimer;

        var _init = function(){
            var i, max;
            var pathName = location.pathname;
            var activeOk = false;
            var folderDir;

            element = $('.gnb_depth_1');
            depth2Bg = $('#navbg');
            depth1Arr = element.find('> li > a');
            depth1TotalNum = depth1Arr.length;
            depth2ConArr = $('.gnb_depth_2');
            depth2Arr = depth2ConArr.find('>li>a');           
            depth1Arr.each(function(index, item){
                $(item).attr('name', 'depth1_'+index);
            });

            depth1Arr.on('mouseenter focusin mouseleave focusout', depth1Handler);
            for(i = 0, max = depth2ConArr.length; i<max; i++){
                depth2Arr[i] =  $(depth2ConArr[i]).find('a');
                depth2Arr[i].on('mouseenter focusin mouseleave focusout', depth2Handler);
            }

            depth2ConArr.on('mouseenter mouseleave', depth2Handler);
            depth2Bg.on('mouseenter mouseleave', function(e) {
                switch ( e.type ) {
                    case 'mouseenter':
                       stopTimer();
                        break;
                    case 'mouseleave':
                       startTimer();
                        break;
                    }
            });
        };

        var depth1Handler = function(e){
            var num = e.currentTarget.getAttribute('name').substr(7,1);
            switch ( e.type ) {
                case 'mouseenter':
                case 'focusin':
                    stopTimer();
                    depth1Over(num);
                    TweenLite.to($("#header"), 0.3, {css:{className:'+=open'}});
                    break;
                case 'focusout':
                case 'mouseleave':
                    startTimer();
                    break;
            }
        };
        var depth1Over = function(num){
            for(var i = 0; i < depth1TotalNum; i++){
                if(num == i){
                    $(depth1Arr[num]).addClass('on');

                }else{
                    $(depth1Arr[i]).removeClass('on');
                }
            }

            if(!viewDepth2){
                TweenLite.to($("#wrap"), 0.3, {css:{className:'+=bkon'}});
                TweenLite.to(depth2Bg, 0.3, {css:{className:'+=on'}});
                // 2depth 있을경우 : TweenLite.to(depth2Bg, 0.5, {css:{height:170}, ease:Cubic.easeOut});
                depth2ConArr.fadeIn();
            }
            viewDepth2 = true;
        };
        var depth2Handler = function(e){
            var name = e.currentTarget.getAttribute('name');
            if(name != null){
                var num = name.substr(7,1);
            }

            switch ( e.type ) {
                case 'mouseenter':
                case 'focusin':
                    TweenLite.to($(e.currentTarget), 0.2, {css:{className:'+=on'}});
                    stopTimer();
                    depth1Over(num);
                    break;
                case 'focusout':
                case 'mouseleave':
                    TweenLite.to($(e.currentTarget), 0.2, {css:{className:'-=on'}});
                    startTimer();
                    break;
            }
        };
        var startTimer = function(){
            clearTimeout( reSetTimer );
            reSetTimer = setTimeout (reSetMenu, 500 );
        };
        var stopTimer = function(){
            clearTimeout( reSetTimer );
        };
        var reSetMenu = function(){
            depth1Over(null);
            TweenLite.to($("#wrap"), 0.3, {css:{className:'-=bkon'}});
            TweenLite.to(depth2Bg, 0.3, {css:{className:'-=on'}});
            TweenLite.to(depth2Bg, 0.5, {css:{height:0}, ease:Cubic.easeOut});
            TweenLite.to($("#header"), 0.3, {css:{className:'-=open'}});
            depth2ConArr.fadeOut();
            viewDepth2 = false;
        };
         return {
            init: _init
        }
    }();







    // Numbering
    ns.register("Numbering");
    ns.Numbering = function(){
        var $gnb;       
        var localNum1, localNum2, pathName, titleName;

        var _init = function () {
            $gnb = $("#gnb");
            pathName = location.pathname + location.search;

            $gnb.find(".gnb_depth_1>li").each(function (i) {
                var href = $(this).find(">a").attr("href");
                

                if (location.href.match(href)) {
                    localNum1 = i;
                }

                //메인만 예외
                if(pathName === "/" || pathName === "/bando/index.html"){
                    $("body").addClass("main");
                    $("header").addClass("main");                   
                } else{
                    $("body").attr("data-page", "sub");
                }

                $(this).find('.gnb_depth_2>li').each(function (j) {
                    var href = $(this).find('>a').attr('href');

                    if (location.href.match(href)) {
                        localNum1 = i;
                        localNum2 = j;
                        titleName = $(this).find("a").text();
                    } else {
                        /*if($(this).find('>a').data("url") != undefined){
                            if(pathName.match($(this).find('>a').data("url"))){
                                localNum1 = i;
                                localNum2 = j;
                            }
                        }*/

                        var url = $(this).find('>a').data("url"),
                            urlArr = [];
                            
                        if (url != undefined) {
                            if (url.indexOf(",") > -1) {
                                for (var k = 0; k < url.split(",").length; k++) {
                                    urlArr[k] = url.split(",")[k];
                                }
                            } else {
                                urlArr[0] = url;
                            }

                            for (var m = 0; m < urlArr.length; m++) {
                                if (pathName == urlArr[m]) {
                                    localNum1 = i;
                                    localNum2 = j;
                                }
                            }
                        }
                        if (pathName == "/regist/regist_event.php") {
                           localNum1 = 4;
                           localNum2 = 0;
                           return false;
                        }
                        

                    }

                });
            });

            localNum1 = localNum1;
            localNum2 = localNum2;


            /*if ($("body").data("page") === "sub") {
                console.log("sub");
            } else {
            } */
            _settingEle(localNum1, localNum2);
            console.log(localNum1, localNum2);
        };

        var _settingEle = function (localNum1, localNum2) {
            var num1 = localNum1,
                num2 = localNum2;
            var $depth1Target = $gnb.find(".gnb_depth_1>li").eq(num1),
                $depth2Target = $depth1Target.find(".gnb_depth_2>li").eq(num2);
            var $titleH2 = $("#title");

            titleName = $depth2Target.find(">a").text();

            if (num1 != undefined) {
                $depth1Target.addClass("on");   
                $depth2Target.addClass("on");   
                $(".layout_top").find(">.top_visual").attr("id", "subvis-"+num1);  

                _makeLocation(num1, num2)

                if (titleName != undefined ) $titleH2.text(titleName);
                if (num2 == undefined ) $titleH2.text($depth1Target.find(">a").text());
            }

            //title 세팅
            var $title = $("title"); 
            var $siteName = $title.text();
            var remoteH2 = $("#container").find("#title").text();            
            nowTit1 = $depth1Target.find(">a").text();
            nowTit2 = $depth2Target.find(">a").text();
          

            if (nowTit2.length > 0 && nowTit1.length > 0) {
                $("title").text($siteName +" | " + nowTit1 + " | " + nowTit2);
                if (nowTit2 != remoteH2) {
                    $("title").text($siteName +" | " + nowTit1 + " | " + nowTit2 + " | " + remoteH2);
                }
            } else if (nowTit2.length == 0 && nowTit1.length > 0) {
                $("title").text($siteName +" | " + nowTit1);
            } else {
                $("title").text($siteName);
            }
        }

        var _makeLocation = function (num1, num2) {
            
            var $location = $(".location_nav");
            var $locDepth1 = $location.find(".path_depth_1"),
                $locDepth2 = $location.find(".path_depth_2");
            var html = "", html2;

            $gnb.find(".gnb_depth_1>li").each(function () {
                html += "<li>";
                html += $(this).find(">a")[0].outerHTML;
                html += "</li>";
            });
            html2 = $gnb.find(".gnb_depth_1>li").eq(num1).find(".gnb_depth_2>li").clone();
            $locDepth1.find("ul").html(html);
            $locDepth2.find("ul").html(html2);
            $locDepth1.find("ul>li").eq(num1).addClass("on");
            $locDepth2.find("ul>li").eq(num2).addClass("on");

            $location.find(".path_depth_1 span").text($locDepth1.find("ul>li").eq(num1).find("a").text());
            $location.find(".path_depth_2 span").text($locDepth2.find("ul>li").eq(num2).find("a").text());

            if (num2 == undefined ) $(".path_depth_2").remove();
            

           $(".path_depth_1>dd>ul>li").each(function () {
                var remoteData = $(this).find(".toggle"); 
                var remoteUrl = remoteData.attr("data-url");
                remoteData.attr("href", remoteUrl);
            });  

            $(document).on('click', '.path-item .btn-open', function() {
                var pathItem = $(this).closest('.path-item');
                $(pathItem).addClass('active').children('dd').fadeIn();
                $(pathItem).siblings().removeClass('active').children('dd').fadeOut();
                }).on('click', '.path-item .btn-close', function() {
                var pathItem = $(this).closest('.path-item');
                $(pathItem).removeClass('active').children('dd').fadeOut();
                $('.btn-open', pathItem).focus();
                }).on('mouseup', function(e) {
                var pathList = $('.path-item.active');
                if(pathList.length){
                    var objPos = $(pathList).offset();
                    objPos.right = (objPos.left + $(pathList).width());
                    objPos.bottom = (objPos.top + $(pathList).height());
                    if( e.pageX < objPos.left || e.pageX > objPos.right || e.pageY < objPos.top || e.pageY > objPos.bottom ) {
                    $(pathList).removeClass('active').children('dd').fadeOut();
                    $('.btn-open', pathList).focus();
                    }
                }
            });                   

        };

        var _linkLocation = function (num1, num2) {            
            var num1 = localNum1,
                num2 = localNum2;           
            var $title = $(".sub_title");
            var $h2 = $title.find("h2");
            var $depth0Li = $gnb.find(".gnb_depth_1>li");

            var txtD1 = $depth0Li.eq(num1).find("> a").text(); //1depth text
            var txtD2 = $depth0Li.eq(num1).find("li").eq( num2 ).find("> a").text(); //2depth text

            var $pagePrev = $title.find(".page_prev");
            var $pageNext = $title.find(".page_next");
            var $submenuLi = $depth0Li.eq( num1 ).find('.gnb_depth_2>li');

            // 2depth있을때
            //var $prevDepth0Li = $submenuLi.eq( num2 - 1 );
            //var $nextDepth0Li = $submenuLi.eq( num2 + 1 );

            // 1depth만있을때
            var $prevDepth0Li = $depth0Li.eq( num1 - 1 );
            var $nextDepth0Li = $depth0Li.eq( num1 + 1 );

            if( $nextDepth0Li.length == 0 ) $nextDepth0Li = $submenuLi.eq( 0 );
            
            var prevTxt = $prevDepth0Li.find("> a").text();
            var nextTxt = $nextDepth0Li.find("> a").text();
            var prevUrl = $prevDepth0Li.find("> a").prop("href");
            var nextUrl = $nextDepth0Li.find("> a").prop("href");
            
            if(num1 != -1){              
                // if(num2 != -1){
                // }else{                    
                    $pagePrev.text(prevTxt);
                    $pageNext.text(nextTxt);
                    $pagePrev.prop("href", prevUrl);
                    $pageNext.prop("href", nextUrl);
                    if(num1 == ($depth0Li.length - 1)){
                        $pageNext.text($depth0Li.eq(0).find("> a").text());
                        $pageNext.prop("href", $depth0Li.eq(0).find("> a").prop("href"));
                    }
                // }
            }

        };

       return {
            init: _init
        }
    }();

    ns.register('gnb_hor');        
    ns.gnb_hor = function(){
        var  element, headerCon, gnbg, depth1Arr, depth2ConArr, depth1TotalNum, depth2Arr=[], reSetTimer, setDepth1 = null, setDepth2 = null;               
        var _init = function(){  
            var i, max;
            element = $('nav>ul');
            headerCon = $('header');
            gnbg = $('#navbg')
            depth1Arr = element.find('> li > a');       
            depth1TotalNum = depth1Arr.length;    
            depth2ConArr = element.find('>li> ul');

            depth1Arr.each(function(index, item){
                $(item).attr('name', 'depth1_'+index);
                $(item).parent().find("ul>li>a").each(function(index){
                    $(this).attr('name', 'depth2_'+index);
                });
            });            

            depth1Arr.on('mouseenter focusin mouseleave focusout', depth1Handler);      
            for(i = 0, max = depth2ConArr.length; i<max; i++){        
                depth2Arr[i] =  $(depth2ConArr[i]).find('> li > a');                
                depth2Arr[i].on('mouseenter focusin mouseleave focusout', depth2Handler);                              
            }  

            //setDepth1 = $('.gnb_depth_1>li.on').find(">a").attr('name').substr(7,1);
            //setDepth2 = $('.gnb_depth_2>li.on').find(">a").attr('name').substr(7,1);            

            reSetMenu();   
        };
          
        var depth1Handler = function(e){           
            var num = e.currentTarget.getAttribute('name').substr(7,1);
            switch ( e.type ) {
                case 'mouseenter':                        
                case 'focusin':
                    stopTimer();
                    depth1Over(num); 
                    break;
                case 'focusout':
                case 'mouseleave':
                    startTimer();                    
                    break;    
            }
        };        
        
        var depth1Over = function(num){ 

            for(var i = 0; i < depth1TotalNum; i++){
                if(num == i){
                    $(depth1Arr[num]).addClass('on');
                }else{
                    $(depth1Arr[i]).removeClass('on');
                }
            }
            //if($(depth1Arr).hasClass('on'))return;
            viewDepth2(num);
        };  
        var viewDepth2 = function(num){            
            $(depth2ConArr).css({'display':'none'}); 
            if(num){
                if($(depth1Arr[num]).next("ul").length > 0){
                    TweenLite.to($(gnbg), 0.3, {css:{height:51}}); 
                    $(depth2ConArr).css({'display':'none', 'opacity':0}); 
                    $(depth1Arr[num]).parent().find('>ul').css({'display':'block', 'opacity':1}); 
                             
                }else{
                     TweenLite.to($(gnbg), 0.3, {css:{height:0}}); 
                }
            }else{
                TweenLite.to($(gnbg), 0.3, {css:{height:0}}); 
            } 
        }

        var depth2Handler = function(e){            
            var num = $(e.currentTarget).parent().parent().parent().find(">a").attr('name').substr(7,1);
            switch ( e.type ) {
                case 'mouseenter':
                case 'focusin':  
                    TweenLite.to($(e.currentTarget), 0.2, {className:'+=on'});               
                    stopTimer();       
                    depth1Over(num);                                           
                break;                    
                case 'focusout':
                case 'mouseleave':
                    TweenLite.to($(e.currentTarget), 0.2, {className:'-=on'}); 
                    startTimer();
                break;
            }
        };
          
        var startTimer = function(){
            clearTimeout( reSetTimer );
            reSetTimer = setTimeout (reSetMenu, 1000);
        };        
        
        var stopTimer = function(){
            clearTimeout( reSetTimer );
        };      
        
        var reSetMenu = function(){                    
           $(depth2ConArr).css({'display':'none'});                        
           TweenLite.to(depth1Arr, 0.3, {className:'-=on'}); 
           TweenLite.to($(depth1Arr).find("a[name=depth1_"+setDepth1+"]"), 0.3, {className:'+=on'});
           if(setDepth2){
                //2depth 항상 오픈
                viewDepth2(setDepth1)       
                var $current = $("a[name=depth1_"+setDepth1+"]").parent().find(">ul>li>a[name=depth2_"+setDepth2+"]");               
                $current.trigger('mouseenter');                               
            }else{
                TweenLite.to($(gnbg), 0.3, {css:{height:0}});    
            }            
                   
        };       
        
        return{
          init:_init
          
        };
    }();




    // HTML 인클루드
    ns.register('includeHTML');
    ns.includeHTML = function(){
        var _init = function() {
           var includeArea = $("[data-include]");
           var self, url;
           $.each(includeArea,function(){
                self = $(this);
                url = self.data("include");
                self.load(url, function(){
                    self.removeAttr("data-include");
                });
           });
        };
        return {
            init: _init
        }
    }();


    // 아코디언FAQ
    ns.register('faqAcMenu');
    ns.faqAcMenu = function(ele){

        var element, btn, isOpen=false, listArr;
        var i, max;

        element=ele;
        listArr = $(element).find('>li>dl');

        btn = $(listArr).find('>dt>a');
        btn.on('click', openList);

        function listHandler(e) {
            switch ( e.type ) {
                case 'mouseenter':
                case 'focusin':
                    break;
                case 'focusout':
                case 'mouseleave':
                    break;
            }
        }

       function openList(e){
            var parent = $(e.currentTarget).parent().parent()
            var viewCon = parent.find('>dd')
            if(parent.hasClass('on')){
                parent.removeClass('on');
                viewCon.css('display', 'none')
            }else{
                //listArr.removeClass('on');
                $(listArr).removeClass('on')
                $(listArr).find('>dd').css('display', 'none');
                parent.addClass('on');
                viewCon.css('display', 'block');
                TweenLite.from(viewCon, 0.3, {css:{opacity:0}});
            }

        }
    };

    // 패밀리사이트
    ns.register('familybox');
    ns.familybox = function(){
        var _init = function() {
            var $btn = $(".family_wrap").find(">a");
                $con = $(".family_wrap").find(".list_con");
            $btn.click(function(e){
                e.preventDefault();
                if($(this).hasClass("on")){
                    $(this).removeClass("on");
                    $con.fadeOut();
                    $con.focus();
                }else{
                    $(this).addClass("on");
                    $con.fadeIn();
                }
            });
        };
        return {
            init: _init
        }
    }();

    // 퀵링크효과
    ns.register('navHover');
    ns.navHover = function(){
        var _init = function() {
           var $btn = $(".quick_info li a");
           $btn.on('mouseenter focusin mouseleave focusout', function(e) {
            switch ( e.type ) {
                case 'mouseenter':
                case 'focusin':
                    TweenLite.to($(this), 0.5, {width:"180px", backgroundColor:"#2253b8", ease:Cubic.easeOut});
                    TweenLite.to($(this).find("span"), 0.7, {left:30, opacity:1, ease:Cubic.easeOut});
                    break;
                case 'mouseleave':
                case 'focusout':
                    TweenLite.to($(this).find("span"), 0.3, {left:0, opacity:0, ease:Cubic.easeOut});
                    TweenLite.to($(this), 0.5, {width:"60px", backgroundColor:"#343434", ease:Cubic.easeOut});
                    break;
                }
            });
        };
        return {
            init: _init
        }
    }();

    ns.register('subTopMotion');
    ns.subTopMotion = function(){
        var $bg, $title;
        var _init = function() {          
            $bg = $(".sub_top");
            $title = $(".sub_title").find("h2");            
            $subway = $bg.find(".summary");
            tl = new TimelineLite();
            //tl.from($bg, .9, {autoAlpha:.5, "backgroundPositionY":70, ease:Power2.easeOut}, 0.2)
            tl.from($title, .6, {autoAlpha:0, y:50, ease:Power2.easeOut})
              .from($subway, .6, {autoAlpha:0, y:50, ease:Power2.easeOut},"-=0.5");              
            tl.play();
        };

        

        return {
            init: _init
        }
    }();

    // Slick 슬라이드
    ns.register('mainvis');
    ns.mainvis = function(){
        var _init = function(){
            _mainVisual();
        };

        var _mainVisual = function(){
            var $visualcon, $copy1, $copy2, $copy3;
            var $mainVisual = $(".visual_slide");
            var wHeight = $(window).height();
            var wWidth = $(window).width();

            /*$(window).on("load resize", function(){
                $mainVisual.find(".img").css("height", wHeight + "px");
            });

            $mainVisual.on("init reInit afterChange", function (event, slick, currentSlide, nextSlide) {
                var $paging = $('.visual .page_info');
                var i = (currentSlide ? currentSlide : 0) + 1;
                $paging.html('<strong>'+i+'</strong>' + '/' + slick.slideCount);
            });
            */

            $mainVisual.on("init", function(slick){
                _bgMotion(0);
            });


            $mainVisual.slick({
                fade:true,
                slidesToShow:1,
                slidesToScroll:1,
                arrows:false,
                dots:false,
                infinite: true,
                autoplay:false,
                autoplaySpeed:6000,
                draggable:false,
                speed:1000,
                zIndex:10,
                pauseOnHover:false
            });

            $mainVisual.on("beforeChange", function(event, slick, currentSlide, nextSlide){
                _bgMotion(nextSlide);
            });


            function _bgMotion(num){
                var $nextLi = $mainVisual.find(".slick-slide").eq(num);
                //TweenMax.set($nextLi.find(".img"), {autoAlpha:.5, scale:1.3, skewX:0.001});
                TweenMax.set($nextLi.find(".img"), {autoAlpha:0});
                TweenMax.set($nextLi.find(".mobj_1"), {autoAlpha:0, x:50});
                TweenMax.set($nextLi.find(".mobj_2"), {autoAlpha:0, y:50});
                //TweenMax.to($nextLi.find(".img"), 7, {scale:1.01, autoAlpha:1, ease:Linear.easeNone});
                TweenMax.to($nextLi.find(".img"), 1, {autoAlpha:1, ease:Linear.easeNone});
                TweenMax.to($nextLi.find(".mobj_1"), 1.2, {delay:.7, autoAlpha:1, x:0, ease:Cubic.easeOut});
                TweenMax.to($nextLi.find(".mobj_2"), 1, {delay:1, autoAlpha:1, y:0, ease:Cubic.easeOut});
            };

            $('#SlidePrev').on('click', function(){
                $mainVisual.slick('slickPrev');
            });

            $('#SlideNext').on('click', function(){
                $mainVisual.slick('slickNext');
            });


        };

        return {
            init: _init
        }
    }();

    // Slick 갤러리스타일
    ns.register('popGallery');
    ns.popGallery = function(){
        var _init = function(selector) {
            var $ele = $(selector);
            $ele.slick({
                slidesToShow: 4,
                slidesToScroll: 1,
                dots: false,
                arrows: false,
                centerMode: false,
                focusOnSelect: true
            });

            $('#slidePrev').on('click', function(){
                $ele.slick('slickPrev');
            });

            $('#slideNext').on('click', function(){
                $ele.slick('slickNext');
            });
        };
        return {
            init: _init
        }
    }();

    // 도서관 갤러리
    ns.register('libraryGal');
    ns.libraryGal = function(){
        var _init = function() {  

            $('#slider-for').slick({
              slidesToShow: 1,
              slidesToScroll: 1,
              arrows: true,
              fade: false,
              asNavFor: '#slider-nav'
            });    

            $('#slider-nav').slick({
              slidesToShow: 5,
              slidesToScroll: 1,
              asNavFor: '#slider-for',
              dots: false,
              arrows: false,
              centerMode: true,
              focusOnSelect: true
            });    
           
        };
        return {
            init: _init
        }
    }();  

    ns.register('mainscroll');
    ns.mainscroll = function(){

        var isIntro=true;
        var introcon, vbox, maincon;
        var $wrap, $visual, $quick;
        var wWidth, wHeight;
        var tl, tl2;
        var $visualcon, $mainVisual, $pager, $footer; 
        var _init = function() {
            var winH =  $(window).height();
            var visH = $(window).height() - $("#header").outerHeight();
            if (winH > 780) {
                $(".main_visual").css("height", visH);  
            } else {
                $(".main_visual").css("height", "920px");  
            }      
            text_motion();           
            scrollClip();
        };


        var text_motion = function() {
            var tl = new TimelineLite;
            var obj_m1 = $(".main_visual .obj_1"),
                obj_m2 = $(".main_visual .obj_2"),
                obj_m3 = $(".main_visual .obj_3"),
                obj_m4 = $(".main_visual .obj_4"),
                obj_m5 = $(".main_visual .obj_5");
            var bg = $(".main_visual .vimg");
            tl.clear();
            tl.fromTo(bg,1.5,{opacity: 0, scale:1.4},{opacity: 1, scale:1, ease:Cubic.easeOut})
            .fromTo(obj_m1,.9,{opacity: 0, x: -120},{opacity: 1, x: 0, ease:Cubic.easeOut},"-=0.4")
            .fromTo(obj_m2,.9,{opacity: 0, x: 120},{opacity: 1, x: 0, ease:Cubic.easeOut}, "-=0.4")
            .fromTo(obj_m3,1,{opacity: 0, y: 100},{opacity: 1, y: 0, ease:Cubic.easeOut}, "-=0.5") 
            .fromTo(obj_m4,1,{opacity: 0, y:-100, transformOrigin:"center"},{opacity: 1, y:0, transformOrigin:"center", ease:Cubic.easeOut}, "-=1") 
            .fromTo(obj_m5,1,{opacity: 0, y: 100},{opacity: 1, y: 0, ease:Cubic.easeOut}, "-=0.8"); 
        }

        var scrollClip = function(){
            var sTop = 0;
            var m_group = [$('.mcon_1'),
               $('.mcon_2')                
           ];           
           var t1, t2;
           var mog;

            TweenMax.set($(m_group[0]).find('li'), {autoAlpha:0, y:100});
            TweenMax.set($(m_group[1]).find('li'), {autoAlpha:0, y:100});

            t1 = new TimelineLite();
            t1.from($(m_group[0]).find('.tit'), .7, {y:100, autoAlpha: 0, ease:Cubic.easeOut}) 
              .staggerTo($(m_group[0]).find('li'), .9, {autoAlpha:1, y:0, ease:Power2.easeOut}, 0.2);             
            t1.pause();

            t2 = new TimelineLite();            
            t2.from($(m_group[1]).find('.mcon_left'), .7, {x:-80, autoAlpha: 0, ease:Cubic.easeOut})
            t2.from($(m_group[1]).find('.mcon_right'), .7, {x:80, autoAlpha: 0, ease:Cubic.easeOut},"-=0.7");
            t2.pause();
            mog = [t1, t2];

            function scroll(){
                sTop = $(window).scrollTop() + ($(window).height()/2)+150;
                  for(var i = 0; i < m_group.length; i++){
                    if($(m_group[i]).offset().top < sTop){
                      mog[i].play();
                      m_group.splice(i, 1);
                      mog.splice(i, 1);
                    }
                  }                       
            };

            $(window).scroll(function(e) {
                scroll();
            });
           scroll();
        }    



        var start_intro = function(){ 
            $(".wrap_main").removeClass("mainbg");
            var introcon = $(".intro_con");
            tl = new TimelineMax({onComplete:intro_end});           
            tl.from(introcon,1.2,{scale:1.6, autoAlpha:0, ease:Power2.easeOut})
              .from(introcon.find(".top_box"),1,{x:150, autoAlpha:0, ease:Power2.easeOut})
              .from(introcon.find('.btm_box'),1, {x:-150, autoAlpha:0, ease:Power2.easeOut},"-=0.9")
              .from(introcon.find('.obj_1'),.8, {x:-80, autoAlpha:0, ease:Power2.easeOut})
              .from(introcon.find('.obj_2'),.8, {x:80, autoAlpha:0, ease:Power2.easeOut}, "-=0.5")
              .from(introcon.find('.obj_3'),.8, {y:80, autoAlpha:0, ease:Power2.easeOut}, "-=0.3")
              .from(introcon.find('.obj_4'),.8, {y:100, autoAlpha:0, ease:Power2.easeOut}, "-=0.5");
            tl.play();
        }

        var intro_end = function(){
            $(".wrap_main").addClass("mainbg");
            TweenMax.delayedCall(1, intro_end_motion);                                               
        }

        var intro_end_motion = function(){  
            var introcon = $(".intro_con");          
            var tl2 = new TimelineMax({onComplete:mainSet});   
            tl2.to(introcon.find(".top_box"),1,{"autoAlpha":0, "y":-100, ease:Cubic.easeOut})
               .to(introcon.find('.btm_box'),1,{"autoAlpha":0, "y":100, ease:Cubic.easeOut}, "-=.9")
               .to(introcon.find('.txt_con'),.7,{"autoAlpha":0, "x":100, ease:Cubic.easeOut}, "-=.9")            
               .to(introcon,1,{"autoAlpha":0, "x":-200, ease:Cubic.easeOut}, "-=.7")            
            tl2.play();
        }

        var mainSet = function(){
            $(".main_con").css("opacity", 1);           
            $(".pager>ul>li:first").find(".over").css("opacity", 1);  
            $("#footer").show();          
            TweenMax.delayedCall(.5, mainVisual);
        }

        var mainVisual = function(){            
            $visualcon = $(".main_con");
            $mainVisual = $(".slide_con");
            wHeight = $(window).height();
            $pager = $(".pager>ul>li");
            $footer = $("#footer"); 
           

            $mainVisual.on("init", function(slick){
              $(".vtxt_con").fadeIn();
              $(".pager_con").fadeIn();   
              $(".wrap_main").removeClass("mainbg");         
            });


            var vtl = new TimelineMax({});   
            vtl.from($visualcon.find(".obj_1"),.7,{"autoAlpha":0, "y":80, ease:Cubic.easeOut})
               .from($visualcon.find('.obj_2'),.8,{"autoAlpha":0, "y":80, ease:Cubic.easeOut}, "-=.5")
               .from($visualcon.find('.obj_3'),.8,{"autoAlpha":0, "y":80, ease:Cubic.easeOut}, "-=.3")            
               .from($visualcon.find('.obj_4'),.8,{"autoAlpha":0, "y":80, ease:Cubic.easeOut}, "-=.5")            
               .to($footer,.3,{"autoAlpha":1, ease:Cubic.easeOut}, "-=.8")
            vtl.play(); 

            function resize(){
                $visualcon.css("height", wHeight + "px");
                $mainVisual.find(".v_slide").css("height", wHeight + "px");
            }
            $(window).on("resize", function(){ 
                resize()              
            });
            resize();


            $mainVisual.on("afterChange", function (event, slick, currentSlide, nextSlide) {               
                var $current = $pager.eq(currentSlide);                               
                TweenMax.set($pager.find(".over"), {autoAlpha:0});
                TweenMax.to($current.find(".over"), .5, {autoAlpha:1, ease:Power2.easeOut});                                              
            });

            $mainVisual.slick({
                fade:true,
                slidesToShow:1,
                slidesToScroll:1,
                arrows:false,
                dots:false,
                infinite: true,
                autoplay:true,
                autoplaySpeed:3000,
                draggable:false,
                speed:1000,
                zIndex:10,
                pauseOnHover:false
            });
            
            $pager.find(">a").on("click",function(e){ 
                e.preventDefault();               
                var slideno = $(this).data('slide');
                $mainVisual.slick('slickGoTo', slideno);
            });


            $mainVisual.on("beforeChange", function(event, slick, currentSlide, nextSlide){
                _bgMotion(nextSlide);                
            });

            function _bgMotion(num){
                var $nextLi = $mainVisual.find(".slick-slide").eq(num);
                /*TweenMax.set($nextLi.find(".img"), {autoAlpha:.5, scale:1.3, skewX:0.001});
                TweenMax.set($nextLi.find(".txt span"), {autoAlpha:0, y:40});
                TweenMax.set($nextLi.find(".txt .copy"), {autoAlpha:0, y:40});
                TweenMax.set($nextLi.find(".txt .copys"), {autoAlpha:0, y:40});

                TweenMax.to($nextLi.find(".img"), 2, {autoAlpha:1, ease:Cubic.easeOut});
                TweenMax.to($nextLi.find(".img"), 7, {scale:1.01, ease:Linear.easeNone});
                TweenMax.to($nextLi.find(".txt span"), 2, {delay:.8, autoAlpha:1, y:0, ease:Power2.easeOut});
                TweenMax.to($nextLi.find(".txt .copy"), 2, {delay:1.4, autoAlpha:1, y:0, ease:Power2.easeOut});
                TweenMax.to($nextLi.find(".txt .copys"), 2, {delay:2.2, autoAlpha:1, y:0, ease:Power2.easeOut});**/
            };

        };




        return {
            init: _init
        }
    }();

    
    /* 메인 팝업 모듈 */
    ns.register('popup');
    ns.popup = function(){
        var $popup, $popupList;

        var _init = function(){
            var $popup = $(".main_popup");
            var $popupList = $("#popList");
            var $nmpop = $(".nmpop");
            var $nmpopleft = $(".nmpop").data("pos");
            //$nmpop.css({marginLeft : Math.floor(978-$nmpopleft)}); 

            $popup.css("display", "block");
            $popup.each(function(i){
                if(getCookie("pop"+i) != "checked"){
                    $("#pop"+i).css("display", "block");
					LayerPopups.showScreen();
                }else{
                    $("#pop"+i).css("display", "none");
					LayerPopups.hideScreen();
                }
                
            });

            $popup.find(".today a").on("click", function(e){
                e.preventDefault();
                var layerId = $(this).parent().parent().attr("id");
                closeCookie(layerId);   
                $(this).parent().parent().removeClass("open");
                LayerPopups.hideScreen();             
            });

            $popup.find(".popclose").on("click", function(e){
                e.preventDefault();                
                $(this).parent().hide();                
            });

            popSlide();
        };

        var popSlide = function(){
            var $popup_slide = $(".popup_slide");

            $popup_slide.slick({
                fade: false,
                infinite: false,
                autoplay: false,
                arrows: false,
                draggable: true,
                autoplaySpeed: 4000,
                speed: 1500,
                dots:true,
                    customPaging: function(slider, i) {
                        var inum = i+1;
                        return '<a href="javascript:;">' +'0'+ inum + '</a>';
                    },
                pauseOnHover: false,
                pauseOnFocus: false,
                focusOnSelect: false
            });
        }


        var getCookie = function(name){
            var nameOfCookie = name + "=";
            var x = 0;
            while ( x <= document.cookie.length )
            {
                var y = (x+nameOfCookie.length);
                if ( document.cookie.substring( x, y ) == nameOfCookie ) {
                    if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
                        endOfCookie = document.cookie.length;
                    return unescape( document.cookie.substring( y, endOfCookie ) );
                }
                x = document.cookie.indexOf( " ", x ) + 1;
                if ( x == 0 )
                    break;
            }
            return "";
        };

        var setCookie = function(name, value, expiredays){
            var todayDate = new Date();
            todayDate.setDate( todayDate.getDate() + expiredays );
            document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"
        };

        var closeCookie = function(layerId){
            var i = layerId.split("pop")[1];

            if ( document.getElementById("chkPop"+i).checked ) {
                setCookie( layerId, "checked" ,1 );
                console.log(layerId);
            }
            $("#"+layerId).css("display", "none");
        };
        return {
            init:_init
        }
    }();

    /* 풀스크린 */
    ns.register('fullScreen');
    ns.fullScreen = function(){
    
        var winW, winH, imgW, imgH, picH, picW; 
        var ele = $("#bgimg");

        var _init = function(ele){             
            winW = $(window).width();
            winH = $(window).height();
            imgW = $(ele).width();
            imgH = $(ele).height();
            picH = winH / winW;
            picW = winW / winH; 
            fullBg(ele);         
        };
        
        function fullBg(ele) {
            var item = ele;
            if ((winH / winW) < picH) {
                $(item).css("width",winW);
                $(item).css("height",picH*winW);
            } else {
                $(item).css("height",winH);
                $(item).css("width",picW*winH);
            };
            $(item).css("margin-left",winW / 2 - $(item).width() / 2);
            $(item).css("margin-top",winH / 2 - $(item).height() / 2);
        }

        

        return {
            init:_init
        }
    }();
    
    /* Tab UI 타겟 href 타입 */
    ns.register('tab');
    ns.tab = function(){
        var _init = function(ele){
            var $this = ele;
            var prev;

            $this.find("a").click(function(e){
                e.preventDefault();
                var $this = $(this);
                if(prev){
                    prev.parent().removeClass("on");
                    TweenMax.set($(prev.attr("href")), {"opacity":0, "display":"none"});

                }
                $(this).parent().addClass("on");
                TweenMax.set($($this.attr("href")), {"display":"block"});
                TweenMax.to($($this.attr("href")), 0.8, {"opacity":1});

                prev = $this;
            });

            $this.find("li:nth-child(1) a").trigger("click");
        };

        return {
            init: _init
        }
    }();

    /* Tab UI 배열타입 */
    ns.register('ui.tabMenu');
    ns.ui.tabMenu = function(ele, targetEle){
        var element, targetElement, tNum=0, tabContainer, tabBtn, tabBtnCon, contentsArr, totalTabNum;
        element = ele;
        targetElement = targetEle;
        tabBtn = element.find(">li:not(.deactive)");
        tabBtnCon = element.find(">li");
        totalTabNum = tabBtn.length;
        contentsArr= targetElement.find(">li");
        tabBtn.each(function(index, item){
            $(item).attr('name', 'tab_'+index);

        });
        tabBtn.on('mouseenter focusin mouseleave focusout click', tabHandler);

        function tabHandler(e){
            var num = e.currentTarget.getAttribute('name').substr(4,1);
            if(tNum == num)return;

            switch ( e.type ) {
                case 'mouseenter':
                case 'focusin':
                   // tabOver(num);
                    break;
                case 'focusout':
                case 'mouseleave':
                  //  tabOver(tNum);
                    break;
               case 'click':
                    tabSelect(num);
                    break;
            }
        };

        function tabOver(num){
            for(var i = 0; i<totalTabNum; i++){
                if(i== num){
                    TweenLite.to($(tabBtn[num]), 0, {className:'+=on'});
                    TweenLite.to($(tabBtnCon[num]), 0, {className:'+=on'});
                }else{
                    TweenLite.to($(tabBtn[i]), 0, {className:'-=on'});
                    TweenLite.to($(tabBtnCon[i]), 0, {className:'-=on'});
                }
            }

        };

        function tabSelect(num){
            tabOver(num)
            tNum = num;
            $(contentsArr[num]).siblings().removeClass('current');
            $(contentsArr[num]).addClass('current')
        }
        tabOver(tNum);
        tabSelect(tNum)
    };

     /* ajaxTab */
    ns.register('ajaxTab');
    ns.ajaxTab = function(){
        var _init = function(ele){
            var $this = ele;
            var prev;

            $this.find("a").click(function(e){
                e.preventDefault();
                var $this = $(this);
                var loadURL = $(this).attr("data-load-url");

                if(prev){
                    prev.parent().removeClass("on");
                }

                $(this).parent().addClass("on");
                _loadData(loadURL);

                prev = $this;

            });

            $this.find("li:nth-child(1) a").trigger("click");

        };

        var _loadData = function(loadURL){
            var $viewCon = $(".type_tab_con");

             TweenMax.set($viewCon, {"display":"block"});

            $.ajax({
                url:loadURL+".asp",
                method: 'GET',
                cache: false,
                success:function(data){
                    $viewCon.empty().append(data);
                },
                error:function(xhr, status, error){
                }
            });
        };

        return {
            init: _init
        }
    }();

    /* paramTab */
    ns.register('paramTab');
    ns.paramTab = function(){

        var _init = function(ele){
            var $this = ele;

            function getUrlParameter(sParam) {
                var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                    sURLVariables = sPageURL.split('&'),
                    sParameterName,
                    i;

                for (i = 0; i < sURLVariables.length; i++) {
                    sParameterName = sURLVariables[i].split('=');

                    if (sParameterName[0] === sParam) {
                        return sParameterName[1] === undefined ? true : sParameterName[1];
                    }
                }
            };
            var sParam = getUrlParameter('tab');
            $(".type_tab_con").not('#'+sParam).css("display", "none");
            $("#"+sParam).fadeIn();
            $this.find("."+sParam).addClass('on');
        };
        return {
            init: _init
        }
    }();

    /* selecttype */
    ns.register('selectbox');
    ns.selectbox = function(){
        var _init = function(ele) {
            var $ele = $(ele);
            var $btn = $ele.find('>a');
            var $list = $ele.find('>div');
            $btn.click(function(e){
                e.preventDefault();
                if($(this).hasClass("open")){
                    $(this).removeClass("open");
                    $list.hide();
                }else{
                    $(this).addClass("open");
                    $list.show();
                }
            });
        };
        return {
            init: _init
        }
    }();

    /* placeholder */
    ns.register('placeholder');
    ns.placeholder = function(){
        var _init = function() {
          var $placeholder = $("body").find('.placeholder'),
            $inTxt = $placeholder.find('input, textarea');
            $inTxt.each(function () {
                if ($(this).val() != '') {
                    $(this).addClass('focus');
                };
            });

            $inTxt.on('focusin', function () {
                $(this).addClass('focus');
            });

            $inTxt.on('focusout', function () {
                if ($(this).val() === '') {
                    $(this).removeClass('focus');
                } else {
                    $(this).addClass('focus');
                }
            });

            $placeholder.on('click', function () {
                $(this).find('input').focus();
            });
        };
        return {
            init: _init
        }
    }();

    /* 셀렉트박스 ie만 예외 처리 */
    ns.register('selectie');
    ns.selectie = function(){
        var _init = function() {
            if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) {
                $("body").find(".select-wrapper").addClass("iestyle");
                $("body").find("input:radio").addClass("iestyle");
                $("body").find("input:checkbox").addClass("iestyle");
            }
        };
        return {
            init: _init
        }
    }();

    /* datePicker */
    ns.register('datePicker');
    ns.datePicker = function(){
        var _init = function(inputId) {
            $(inputId).datepicker({
                showOn: "both", // focus / button / both
                dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
                monthNames:[ "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월" ],
                monthNamesShort: ["1월","2월","3월","4월","5월","6월", "7월","8월","9월","10월","11월","12월"],
                buttonText: "<i class='fa fa-calendar'></i>",
                dateFormat: "yy-mm-dd",
                changeMonth: true,
                changeYear: true,
                yearRange: "1960:+nn",
                isRTL: false,
                yearSuffix: '',
                firstDay: 0

                //yearRange: '0+50'
            });
        };
        return {
            init: _init
        }
    }();

    /* fileStyle */
    ns.register('fileStyle');
    ns.fileStyle = function(){
        var _init = function() {
            var fileTarget = $('.filebox .upload-hidden');
                fileTarget.on('change', function () { // 값이 변경되면
                    if (window.FileReader) { // modern browser
                        var filename = $(this)[0].files[0].name;
                    } else { // old IE var
                        filename = $(this).val().split('/').pop().split('\\').pop(); // 파일명만 추출
                    }
                    // 추출한 파일명 삽입
                    $(this).siblings('.upload-name').val(filename);
                });
        };
        return {
            init: _init
        }
    }();

    /* 공통 링크효과 */
    ns.register('linkHover');
    ns.linkHover = function(){
        var _init = function(ele) {
           var $ele = $(ele);
           $ele.on('mouseenter focusin mouseleave focusout', function(e) {
            switch ( e.type ) {
                case 'mouseenter':
                case 'focusin':
                    $(this).addClass("hover");
                    break;
                case 'focusout':
                case 'mouseleave':
                    $(this).removeClass("hover");
                    break;
                }
            });
        };
        return {
            init: _init
        }
    }();

    /* selectUpBox 스타일 모듈 */
    ns.register('selectUpBox');
    ns.selectUpBox = function(ele){
        var element, btn, isOpen=false, listCon, listHeight, closeTimer, listWrap;
        var i, max;
        element=ele;
        listWrap = $(element).find('div');
        listCon = listWrap.find('ul');
        btn = $(element).find('>a');
        $(element).find('>a').on('mouseenter focusin mouseleave focusout', listHandler);
        $(element).find('>a').on('click', openList);
        listHeight = $(listCon).outerHeight(true)
        listWrap.css('height', 0)
        listCon.find('li>a').on('mouseenter focusin mouseleave focusout', listHandler);
        listCon.css('display', 'none');
        listCon.css('top', listHeight);
        function listHandler(e) {
            switch ( e.type ) {
                //case 'mouseenter':
                case 'focusin':
                    stopTimer();
                    break;
                case 'focusout':
                //case 'mouseleave':
                    startTimer();
                    break;
            }
        }
        function startTimer(){
            clearTimeout( closeTimer );
            closeTimer = setTimeout (close, 700 );
        };
        function stopTimer(){
            clearTimeout( closeTimer );
        };
        function close(){
            isOpen=true;
            openList()
        };

        function openList(){
            listHeight = $(listCon).outerHeight(true);
            if(isOpen){
                isOpen = false;
                listWrap.css('height', 0);
                listCon.css('display', 'none');
                $(btn).removeClass('on');
                TweenLite.to(listCon, 0, {css:{top:listHeight}});
            }else{
                isOpen = true;
                listWrap.css('height', listHeight);
                listCon.css('display', 'block');
                $(btn).addClass('on');
                TweenLite.to(listCon, 0.3, {css:{top:0}});
            }
        }
    };
   

}(APP || {}, jQuery));

/* 맨위로 */
function GoTop() {
    TweenMax.to($('body, html'), 0.5, {scrollTop:0, ease:"Cubic.easeOut"});
}

/* 레이어팝업 */
var LayerPopups = {
    find: function (id) {
        if (typeof (id) === 'string')
            return $((id.match(/^#/)) ? id : '#' + id);
        else
            return $(id).parents('.layerPopup');
    },
    open: function (id, closeOthers) {
        var $id = this.find(id);
        if ($id.length == 0)
            return;
        //$("html, body").stop().animate({scrollTop:(thisPos.top)-600}, 400);

        //if (id == "danziPop") {
        //    GoTop();
        //}

        this.showScreen();
        if (closeOthers) {
            $('.layerPopup').each(function () {
                if (this.id == $id[0].id)
                    $(this).show();
                else
                    $(this).hide();
            });
        }
        else {
            $id.show();
        }
    },
    close: function (id) {
        this.find(id).hide();
        this.hideScreen();
    },
    closeAll: function () {
        $('.layerPopup').hide();
        this.hideScreen();
    },
    opened: function () {
        var opened = false;
        $('.layerPopup').each(function () {
            if ($(this).css('display') != 'none')
                opened = true;
        });
        return opened;
    },
    showScreen: function () {
        $('#layerScreen').show();
    },
    hideScreen: function () {
        if (!this.opened())
            $('#layerScreen').hide();
    },
    closeId: function (id) {
        var $id = this.find(id);
        $id.hide();
        this.hideScreen();
        return;
    },
    openAlert: function (id, closeOthers, target, txt) {
        var $id = this.find(id);
        if ($id.length == 0)
            return;

        //GoTop(); //맨위로
        this.showScreen();
        if (closeOthers) {
            $('.layerPopup').each(function () {
                if (this.id == $id[0].id){
                    $(this).attr("data-target", target);
                    $(this).find(".layer_txt").html(txt);
                    $(this).show();
                }else{
                    $(this).hide();
                }
            });
        }
        else {
            $id.show();
        }
    },
    closeAlert: function (id) {
        var $id = this.find(id);
        $id.hide();
        this.hideScreen();
        if($id.attr("data-target") != "") {
            $($id.attr("data-target")).focus();
        }
        return;
    }
};

if( typeof String.prototype.startsWith !== 'function' )
{
    /**
     * 문자열이 해당 suffix 로 시작하는지 체크
     *
     * @param suffix
     * @returns {boolean}
     */
    String.prototype.startsWith = function (suffix) {

        return this.indexOf(suffix) == 0;
    };
}

/* 숫자만입력 */
function onlyNumber(obj) {
    $(obj).keyup(function () {
        $(this).val($(this).val().replace(/[^0-9]/g, ""));
    });
}

function emailLayer() {
    LayerPopups.open('emailReject', true);
}

function emodel() {
    var win = window.open('/vr/index.html','emodel', 'width=980, height=724 left=0, top=0, scrollbars=no');
    win.focus();
}

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

//글자수제한
Array.prototype.valueIndex=function(pval)
{
     var idx = -1;
     if(this==null || this==undefined || pval==null || pval==undefined){
     }else{
      for(var i=0;i<this.length;i++){
       if(this[i]==pval){
        idx = i;
        break;
       }
      }
     }
     return idx
};


APP.isAlphaTween = true;

var browser = navigator.userAgent;
if(browser.toLowerCase().indexOf("msie 8")>0 || browser.toLowerCase().indexOf("msie 7")>0 ){
    APP.isAlphaTween = false;
}

(function(ns, $,undefined){

  ns.register('chkScreen');
  ns.chkScreen = function(){
      var _init = function() {
          chkScreen();
      };
      var chkScreen = function(){
            var winW = $(window).width();  
            var targetW = winW-($(".left_sec").width())-($(".right_sec").width())
            var slideCon = $(".slide_con");
            slideCon.css('width',targetW);
      };
      $(window).resize(chkScreen);

      return {
          init: _init
      }
  }();

  ns.register('DataLoadUI');
  ns.DataLoadUI = function(){
      var thisFloor;
      var _init = function(ele) {                    
          thisFloor = ele;
          $(".data-floor").each(function(){                                                           
              $(this).find("em").text(thisFloor);                    
          });
          dataLoad();  
      };     

      var dataLoad = function(){
        $.ajax({
          url:"/daewoo/online/json/floordata.json",
          method:"GET",
          dataType:"jsonp",
          jsonpCallback:"callback",
            success:function(result){
              var $leftUl = $('ul.data-left-sec');
              var $rightUl = $('ul.data-right-sec');  
              var resCData = result.floorlist.centerData; 

              $(resCData).each(function(v){
                  var $centerUl = $('ul.c_slide');           
                      $centerLi = $("<li data-time='"+ resCData[v].time +"'>").html("<img src='/daewoo/online/img/center/"+resCData[v].url+".jpg'>");
                  $centerUl.append($centerLi);
              });

              var $slide = $('.c_slide');                 
                $slide.slick({                                  
                  infinite: true,
                  autoplay: true,
                  fade: true,                
                  arrows:false,
                  draggable :true,
                  autoplaySpeed: 5000,
                  speed: 600,
                  dots: false,
                  focusOnSelect: false,
                  responsive:false               
              }).on("afterChange", function(e, slick) {
              slideTime = $('div[data-slick-index="'+ slick.currentSlide + '"]').find("li").data("time");             
              $slide.slick("setOption", "autoplaySpeed", slideTime);
            });


            var listLength;
            var dataList;

            dataList = result.floorlist.lists;
            listLength = dataList.length;           

            for(var i = 0; i < listLength; i++) { 
              var _idx = dataList[i].idx;             

              if (_idx  == thisFloor ){
                $(dataList[i].leftData).each(function(j){                                             
                    $leftLi = $("<li>").html(this.dept);
                    $leftUl.append($leftLi);                    
                  });

                  $(dataList[i].rightData).each(function(j){                                              
                    $rightLi = $("<li>").html(this.dept);
                    $rightUl.append($rightLi); 
                  });                   
                  return;
              }                             
            }                     
          },
          error:function(xhr, status, error){
            console.log(xhr);
          }
        });   
      }
      return {
          init: _init
      }
  }();

}(APP || {}, jQuery));
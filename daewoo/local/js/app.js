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
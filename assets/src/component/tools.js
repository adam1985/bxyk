define(['jquery'], function ($) {



    return {
         /**
         * 动态加载javascript文件
         * @param url 加载地址
         * @param callback 回调函数
         */
        loadScript : function (url, callback, isCache) {
            var script = document.createElement("script");
            if ( script.readyState ){  //IE
                script.onreadystatechange = function(){
                    if (script.readyState == "loaded" || script.readyState == "complete"){
                        script.onreadystatechange = null;
                        callback && callback();
                    }
                };
            } else {  //Others
                script.onload = function(){
                    callback && callback();
                };
            }
            if( !isCache ) {
                url += (-new Date()/36e5);
            }
            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
        }
    };

});

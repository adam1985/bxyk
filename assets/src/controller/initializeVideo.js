define(['jquery', 'component/jquery.base64'], function($){
	return function(){
	    var urlencode = function(uri){
	        uri = uri.replace(/^(http:\/\/[^\/]*(?:youku|tudou|ku6|yinyuetai|letv|sohu|youtube|iqiyi|facebook|vimeo|cutv|cctv|pptv))xia.com\//,'$1.com/');
	        uri = uri.replace(/^(http:\/\/[^\/]*(?:bilibili|acfun|pps))xia\.tv\//,'$1.tv/');
	        uri = uri.replace(/^(https?:)\/\//,'$1##');
	        uri = $.base64.btoa(uri);
	        return uri;
	    };
		var videoListItems = $('.video-list-item');
			videoListItems.click(function () {
				var $this = $(this), video = $this.find('video'), 
				url = video.attr('data-src'),
				src = video.attr('src');
				if( /\.mp4/.test( url ) ) {
					video.attr('src', url);
				} else {
					if( !src ) {

					
						$.ajax({
		                    url : 'http://api.flvxz.com/',
		                    dataType : 'jsonp',
		                    jsonpCallback : 'videolists',
		                    data : {
		                        url : urlencode( url ),
		                        jsonp : 'videolists',
		                        //hd : 2,
		                        ftype : 'mp4'
		                    },
		                    success : function( data ){
		                        var videoContent;
		                        if( data.length >>> 0 ) {
		                             videoContent = data[0];  
		                        }

		                        if( videoContent && videoContent.files.length ){
		                            var videoUrl = videoContent.files[0].furl;
		                            video.attr('src', videoUrl);
		                        }
		                        
		                    }
	                	});
					}
				}

			});

	};
	
});

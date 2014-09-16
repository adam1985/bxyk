(function($){

    var urlencode = function(uri){
        uri = uri.replace(/^(http:\/\/[^\/]*(?:youku|tudou|ku6|yinyuetai|letv|sohu|youtube|iqiyi|facebook|vimeo|cutv|cctv|pptv))xia.com\//,'$1.com/');
        uri = uri.replace(/^(http:\/\/[^\/]*(?:bilibili|acfun|pps))xia\.tv\//,'$1.tv/');
        uri = uri.replace(/^(https?:)\/\//,'$1##');
        uri = $.base64.btoa(uri);
        return uri;
    };

    //这一段是腾讯视频给的把url转成vid
    function getVidFromUrl(url) {
        url = url || window.location.toString();
        //先从url中分析出vid参数，例如×××××.html?vid=××××××
        var vid = getUrlParam("vid", url),
            r;
        if (!vid) { // 使用新规则生成的专辑单视频页面
            if (r = url.match(/\/\w{15}\/(\w+)\.html/)) {
                vid = r[1];
            }
        }
        // 单视频播放页
        if (!vid) {
            if (r = url.match(/\/page\/\w{1}\/\w{1}\/\w{1}\/(\w+)\.html/)) {
                vid = r[1];
            } else if (r = url.match(/\/(page|play)\/+(\w{11})\.html/)) {
                vid = r[2];
            }
        }
        // 播客专辑播放页
        if (!vid) {
            if (r = url.match(/\/boke\/gplay\/\w+_\w+_(\w+)\.html/)) {
                vid = r[1];
            }
        }
        return encodeURIComponent(vid);
    }

    function getUrlParam(p, u) {
        var u = u || document.location.toString();
        var pa = p + "=";
        var f = u.indexOf(pa);
        if (f != -1) {
            var f2 = u.indexOf("&", f);
            var f2p = u.indexOf("?", f);
            if (f2p != -1 && (f2 == -1 || f2 > f2p))
                f2 = f2p;
            f2p = u.indexOf("#", f);
            if (f2p != -1 && (f2 == -1 || f2 > f2p))
                f2 = f2p;
            if (f2 == -1)
                return u.substring(f + pa.length);
            else
                return u.substring(f + pa.length, f2);
        }
        return "";
    }

    //关于腾讯视频 有问题请找popotang
    function getUrlVid( link, callback){
        var vid = "", r, flashvars = "", return_url;
        //with vid in url query str
        if( r = link.match( new RegExp("(^|&|\\\\?)vid=([^&]*)(&|$|#)") )) {
            vid = encodeURIComponent(r[2]);
            callback( vid );
        }
        //with cid in url
        //如果有连续剧的视频。需要jsonp去腾讯视频后台用cid换取一段json，然后取连续剧的第一集开始播放
        else if( r = link.match( new RegExp("(http://)?v\\.qq\\.com/cover[^/]*/\\w+/([^/]*)\\.html") ) )
        {
            var cid = encodeURIComponent(r[2]),
                path = 'http://sns.video.qq.com/fcgi-bin/dlib/dataout_ex?auto_id=137&cid=' + cid + '&otype=json';

            $.getScript(path, function(){
                vid = QZOutputJson['videos'][0]['vid'];
                callback( vid );
            });
        }
        //with vid in url
        //这里用腾讯视频给的逻辑来做
        else{
            vid = getVidFromUrl(link);
            callback( vid );

        }
    }

    var vid;

    $(document).on('click', '.get-video-btn', function(){
        var $this = $(this), 
            input = $this.closest('.video-item').find('input'),
            insertBtn = $this.closest('.video-item').find('.insert-video-btn'),
            videoUrl = insertBtn.attr('data-video-url'),
            url = input.val();
        if( url ){
            if(videoUrl) {
                alert("该视频已转换过，请不要重复执行!");
            } else {
                $('.loading-box').show(0);
                var vqq = /v\.qq\.com/,
                    isQq = vqq.test( url ),
                    title,
                    poster;
                if( isQq ) {
                    getUrlVid(url, function($vid){
                        vid = $vid;
                        $.ajax({
                            url : 'http://vv.video.qq.com/getinfo?vids='+ vid + '&otype=json',
                            dataType : 'jsonp',
                            success : function( data ){
                                title = data.vl.vi[0].ti;
                                poster = 'http://shp.qpic.cn/qqvideo_ori/0/' + vid + '_496_280/0';
                                url = 'http://v.qq.com/iframe/player.html?vid=' + vid;
                                insertBtn.attr('data-video-url' , url);
                                insertBtn.attr('data-video-poster' , poster);
                                $('#title').val( title );
                            }
                        });
                    });
                } else {
                    insertBtn.attr('data-video-url' , url);
                    var videoUrlParser = $.ajax({
                        url : 'http://baoxiaoyike.sinaapp.com/VideoUrlParser/server.php',
                        dataType : 'jsonp',
                        data : {
                            url : url
                        },
                        success : function(res){
                            if( res.status ) {
                                var poster = res.data.img;
                                var title = res.data.title;
                                var rex = /(\w+)\/\//g;
                                poster = poster.replace(rex, '$1/');
                                if( poster ) {
                                    insertBtn.attr('data-video-poster' , poster);
                                }
                                if( title ) {
                                    $('#title').val( title );
                                }
                                alert("转换成功");
                            } else {
                                alert('转换失败,请重新试一下!');
                            }
                        },
                        complete : function(){
                            $('.loading-box').hide(0);
                        },
                        error : function() {
                            alert('转换失败,请重新试一下!');
                        }
                    });
                }

            }
            
        } else {
            alert('请输入视频页面地址!');
        }

        
    });

    $(document).on('click', '.insert-video-btn', function(){
        var $this = $(this), 
            videoUrl = $this.attr('data-video-url'),
            poster = $this.attr('data-video-poster'),
            input = $this.closest('.video-item').find('input'),
            url = input.val();


            if( videoUrl ) {
                if( typeof tinyMCE != 'undefined' ) {
                    //var mceContent = tinyMCE.getContent();
                    //tinyMCE.setContent(mceContent +'[[videoBase64=' + $.base64.btoa( videoUrl + '||' + poster  ) + ']]');
                    tinyMCE.execCommand("mceInsertContent", false, '[[videoBase64=' + $.base64.btoa( videoUrl + '||' + poster  ) + ']]');
                } else {
                    var content = $('#content')[0];
                    content.innerHTML += ( '[[videoBase64=' + $.base64.btoa( videoUrl + '||' + poster  ) + ']]' );
                }
                var videoListInput = $('#video-lists-str'),  
                    val = videoListInput.val(),
                    lists = [];
                    if( val ){
                        lists.push( val , '|' + videoUrl);
                        videoListInput.val( lists.join(''));
                    } else {
                        videoListInput.val( videoUrl );
                    }
                    
            } else {
                alert("先转换得到视频地址，再执行插入!");
            }
            var postFormatVideo = $('#post-format-video');
            if( postFormatVideo.length ) {
                postFormatVideo[0].checked = true;
            }
            
    });

    $(document).on('click', '.insert-source-video-btn', function(){
        var sourceVideoInput = $('#source-video-input'),
        val = sourceVideoInput.val();
        if( val ){
            if( typeof tinyMCE != 'undefined' ) {
                //var mceContent = tinyMCE.getContent();
                //tinyMCE.setContent(mceContent + '[[videoBase64=' + $.base64.btoa( val) + ']]');
                tinyMCE.execCommand("mceInsertContent", false, '[[videoBase64=' + $.base64.btoa( val) + ']]');
            } else {
                var content = $('#content')[0];
                content.innerHTML += ( '[[videoBase64=' + $.base64.btoa( val ) + ']]' );
            }
        } else {
            alert('请输入视频源地址与缩略图!');
        }

        var postFormatVideo = $('#post-format-video');
        if( postFormatVideo.length ) {
            postFormatVideo[0].checked = true;
        }

    });
	
	// 微信视频插入
	$(document).on('click', '.insert-weixin-video-btn', function(){
		var weixinVideoUrl = $('#weixin-video-input').val();
		if( weixinVideoUrl ){
			
			$.ajax({
				url : 'http://baoxiaoyike.sinaapp.com/weixin/getVideoInfo.php',
				data : {
					url : weixinVideoUrl
				},
				dataType : 'jsonp',
				success : function( data ){
					if( data.success ){
						var pageUrl = data.pageUrl,
							title = data.title,
							imgSrc = data.thumb;
							
						$('#title').val(title);	
						
						var videoContent = pageUrl + '||' + imgSrc;
						if( typeof tinyMCE != 'undefined' ) {
                            //var mceContent = tinyMCE.getContent();
                            //tinyMCE.setContent(mceContent + '[[videoBase64=' + $.base64.btoa( videoContent) + ']]');
							tinyMCE.execCommand("mceInsertContent", false,  '[[videoBase64=' + $.base64.btoa( videoContent) + ']]');
						} else {
							var content = $('#content')[0];
							content.innerHTML += ( '[[videoBase64=' + $.base64.btoa( videoContent ) + ']]' );
						}
						
						/*$.ajax({
							url : 'http://api.flvxz.com/',
							jsonp : 'jsonp',
							data : {
								url : pageUrl,
								ftype : 'mp4'
							},
							dataType : 'jsonp',
							success : function(res){
								if( res.length && res[0].files.length ){
									var videoContent = res[0].files[0].furl + '||' + imgSrc;
									if( typeof tinyMCE != 'undefined' ) {
										tinyMCE.execCommand("mceInsertContent", false, '[[videoBase64=' + $.base64.btoa( videoContent) + ']]');
									} else {
										var content = $('#content')[0];
										content.innerHTML += ( '[[videoBase64=' + $.base64.btoa( videoContent ) + ']]' );
									}
								} else {
									alert('没有找到该视频，请重新试一下!');
								}
							}
						});*/
					}
				}
			});
		} else {
			alert("请输入微信视频页面地址!");
		}
		
		var postFormatVideo = $('#post-format-video');
        if( postFormatVideo.length ) {
            postFormatVideo[0].checked = true;
        }
	});

  

}(jQuery));
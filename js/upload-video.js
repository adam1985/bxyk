(function($){

    var urlencode = function(uri){
        uri = uri.replace(/^(http:\/\/[^\/]*(?:youku|tudou|ku6|yinyuetai|letv|sohu|youtube|iqiyi|facebook|vimeo|cutv|cctv|pptv))xia.com\//,'$1.com/');
        uri = uri.replace(/^(http:\/\/[^\/]*(?:bilibili|acfun|pps))xia\.tv\//,'$1.tv/');
        uri = uri.replace(/^(https?:)\/\//,'$1##');
        uri = $.base64.btoa(uri);
        return uri;
    };

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

  

}(jQuery));
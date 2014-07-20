(function($){
    var addVideoBtn = $('#add-video-btn'),
        videoItem = $('#video-list-box').find('.video-item').eq(0);
    $(document).on('click', '#add-video-btn', function(){
        $('#upload-tips-box').html('');
        $('#video-list-box').append(videoItem.clone(true));
    });

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
            url = input.val();
        if( url ){
            if(/\.mp4/.test(url)) {
                alert("该视频地址已经获取，请不要重复执行!");
            } else {
                $('.loading-box').show(0);
                var flvxz = $.ajax({
                    url : 'http://api.flvxz.com/',
                    dataType : 'jsonp',
                    jsonpCallback : 'videolists',
                    data : {
                        url : urlencode( url ),
                        jsonp : 'videolists',
                        hd : 2,
                        ftype : 'mp4'
                    },
                    success : function( data ){
                        var videoContent = data[0] || [];
                        $('.loading-box').hide(0);
                        if( videoContent.files.length ){
                            var videoUrl = videoContent.files[0].furl;
                            input.val( videoUrl );
                            insertBtn.attr('data-video-url' , videoUrl );
                            
                            //$('#upload-tips-box').html( JSON.stringify(data));
                            //prompt("转换成功，已抓取视频地址!", videoContent.files[0].furl);
                        } else {
                            alert('转换失败，重新试一下!');
                        }
                        
                    }
                });

                var videoUrlParser = $.ajax({
                    url : 'http://baoxiaoyike.sinaapp.com/VideoUrlParser/server.php',
                    dataType : 'jsonp',
                    data : {
                        url : url
                    },
                    success : function(res){
                        if( res.status ) {
                            var poster = res.data.img;
                            var rex = /(\w+)\/\//g;
                            poster = poster.replace(rex, '$1/');
                            if( poster ) insertBtn.attr('data-video-poster' , poster);
                        }
                    }
                });

                $.when(flvxz, videoUrlParser).done(function(){
                    prompt("转换成功，已抓取视频地址!", input.val());
                }).fail(function(){
                    alert('转换失败,抓取视频地址或是缩略图失败,请重新试一下!');
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
                if( typeof tinyMCE == 'undefined' ) {
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
  

}(jQuery));
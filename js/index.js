(function($){

    Date.prototype.format = function(format){
        var o = {
            "M+" : this.getMonth()+1, //month
            "d+" : this.getDate(), //day
            "h+" : this.getHours(), //hour
            "m+" : this.getMinutes(), //minute
            "s+" : this.getSeconds(), //second
            "q+" : Math.floor((this.getMonth()+3)/3), //quarter
            "S" : this.getMilliseconds() //millisecond
        };

        if(/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }

        for(var k in o) {
            if(new RegExp("("+ k +")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
            }
        }
        return format;
    };

       /**
     * 将符合字节流的string转化成Blob对象
     *
     * @param {String} data
     * @return {Blob}
     * @api public
     */
    function binaryToBlob(data, contentType) {
        var bb;
        if (window.BlobBuilder) {
            bb = new BlobBuilder();
        } else if (window.WebKitBlobBuilder) {
            bb = new WebKitBlobBuilder();
        }
        var arr = new Uint8Array(data.length);
        for (var i = 0, l = data.length; i < l; i++) {
            arr[i] = data.charCodeAt(i);
        }
        if( bb ){
            bb.append(arr.buffer);
        } else {
            return new Blob([arr.buffer], { type: contentType});
        }

        return bb.getBlob(contentType);
    }

    /**
     * 得到图片类型和名字
     * @param url 要上传的图片地址
     */
    function getImageTypeAndName(url) {
        if (url.indexOf('.jpg') > -1) {
            return {
                type: 'image/jpeg',
                name: url.substring(url.lastIndexOf('/') + 1)
            };
        } else if (url.indexOf('.png') > -1) {
            return {
                type: 'image/png',
                name: url.substring(url.lastIndexOf('/') + 1)
            };
        } else if (url.indexOf('.gif') > -1) {
            return {
                type: 'image/gif',
                name: url.substring(url.lastIndexOf('/') + 1)
            };
        } else if (url.indexOf('.bmp') > -1) {
            return {
                type: 'image/bmp',
                name: url.substring(url.lastIndexOf('/') + 1)
            };
        }
        return {
            type: 'image/jpeg',
            name: url.substring(url.lastIndexOf('/') + 1)
        }
    }


    function getImageBlob(url, path) {
          var r = new XMLHttpRequest();
          var typeAndName = getImageTypeAndName(path);
          path = path.replace(/^http:\/\//, '');
          url += "?action=remoteUpload&path=" + path;
          r.open("GET", url, false);
          r.overrideMimeType('text/plain; charset=x-user-defined');
          r.send(null);
		  if( r.responseText ) {
			  var blob = binaryToBlob(r.responseText, typeAndName.type);
			  blob.name = blob.fileName = typeAndName.name;
			  blob.fileType = typeAndName.type;
			  return blob;
		  } else {
			alert('上传失败，请重新上传');
		  }

    }

    var github = new Github({
        username: "adam1985",
        password: "yuan008598",
        auth: "basic"
    });

    var repo = github.getRepo("adam1985", "baoxiaoyike"),
        githubFile = $('#fileToUpload'),
        uploadFileBox = $('#upload-file-box'),
        loadingBox = $('#loading-box'),
        uploadImagesBox = $('#upload-images-box');

    function doActionUpload( blob ) {
        var reader = new FileReader();
        reader.readAsArrayBuffer(blob);

        var date = new Date();
        var dateStr = date.format("yyyy-MM-dd hh:mm:ss"),
            path = 'http://adam1985.github.io/baoxiaoyike/img/',
            ext = /\.\w{2,4}/.exec(blob.name)[0],
            fileName = (+new Date) + ext;

        reader.onload = function (e) {
            repo.write('gh-pages', 'img/' + fileName, reader.result, dateStr,
                function(err) {
                    loadingBox.hide();
                    if( !err ) {

                        //var img = new Image();
                        //img.src = path + fileName;

                        prompt("上传成功", path + fileName);
						$('#remote-upload').val(path + fileName);
                        //var $img = $(img);
                        tinyMCE.execCommand("mceInsertContent", false, '<img src="' + path + fileName + '" />');
                        //p.append($img);
                        //$('#content_ifr').contents().find("#tinymce").append($img);
                        //$('.tb-close-icon').trigger('click');

                        //img.onload = function(){};

                    } else {
                        alert("上传失败");
                    }
                });
        };
    }

    githubFile.change(function(){
        loadingBox.show(0);
        var file = document.getElementById('fileToUpload').files[0];
        doActionUpload( file );

    });

    $('#upload-remote-img').click(function(){
        loadingBox.show(0);
        var path = $('#remote-upload').val();
        var blob = getImageBlob('/',path);
		if( blob ) {
			doActionUpload( blob );
		}
        
    });

}(jQuery));
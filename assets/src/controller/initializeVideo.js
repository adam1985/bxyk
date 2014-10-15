define(['jquery', 'component/jwplayer', 'component/mediaelement-and-player'], function($, jwplayer){
	return function(){
		
		/*$('.video-list-item').each(function(){
			var $this = $(this), id = $this.attr("id"), url = $this.attr("data-url"), picPath = $this.attr("data-pic");
			
			jwplayer(id).setup({
				flashplayer:"http://adam1985.github.io/bxyk/assets/swf/jwplayer.flash.swf",
				file: url,
				image: picPath
			});
		});*/
		
		$('.mediaelementplayer').mediaelementplayer({});

	};
	
});
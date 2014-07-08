define(['jquery'], function($){
	return function(){
		var bshareCustoms = $('.bshare-custom');
		bshareCustoms.each(function(){
			var $this = $(this), shareConf = eval( '(' + $this.attr('data-share-data') + ')' );

			//$this.find('a').click(function(){
				
				bShare.addEntry(shareConf);
			//});
		});
		
	};
	
});

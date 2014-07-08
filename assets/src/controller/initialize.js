define(['jquery', './initializeDigg',  './initializeFavorite', './initializeLazyload', './initializeShare'], 
	function($, initializeDigg, initializeFavorite, initializeLazyload, initializeShare){
		$(function(){
			// 打分
			initializeDigg();

			// 收藏
			initializeFavorite();

			// 图片延时加载
			initializeLazyload();
		
			
			//分享
			initializeShare();
			
		});
});

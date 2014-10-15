define(['jquery', './initializeDigg',  './initializeFavorite', 
	'./initializeLazyload', './initializeShare', './initializeVideo'], 
	function($, initializeDigg, initializeFavorite, initializeLazyload, initializeShare, initializeVideo){
		$(function(){
			// 打分
			initializeDigg();

			// 收藏
			initializeFavorite();

			// 图片延时加载
			initializeLazyload();
		
			
			//分享
			initializeShare();

			//视频播放
			initializeVideo();
			
		});
});

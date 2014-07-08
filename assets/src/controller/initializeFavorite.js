define(['jquery', './addFavorite', 'component/jquery.cookie'], function($, addFavorite){
	return function(){
		var closeFavorite = $('#close-favorite'), topNavigator = $('#top-navigator');
		$('#add-favorite').click(function(){
			$.cookie( 'favorite-cookie', true, {
				expires : 365,
				path : '/',
				domain : '.baoxiaoyike.cn'
			});
			addFavorite( this );

		});


		if( !$.cookie('favorite-cookie') ) {
			topNavigator.slideDown(); 
		}

		closeFavorite.click( function() {
			topNavigator.slideUp( function(){
				$.cookie( 'favorite-cookie', true, {
					expires : 7,
					path : '/',
					domain : '.baoxiaoyike.cn'
				});
			});
		});
	};

});


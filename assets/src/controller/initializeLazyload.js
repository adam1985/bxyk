define(['jquery', 'component/jquery.lazyload'], function($, lazyload){
	return function(){
		$('.container').find('img').lazyload({
            effect : 'fadeIn',
            threshold: 200
        });
	};

		
});

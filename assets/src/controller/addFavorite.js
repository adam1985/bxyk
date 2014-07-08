define(function(){
	return function ( element ) {

        var url = location.href,
        	title = document.title,
        	ua = navigator.userAgent.toLowerCase(), 
        	msg = "您的浏览器不支持,请按 Ctrl+D 手动收藏!";

        	element.setAttribute('href', url);
        	element.setAttribute('title', title);

		if ( ua.indexOf("msie 8") > -1) {
        	window.external.AddToFavoritesBar(url, title);
        } else if (document.all) {
        	try {
	            window.external.addFavorite(url, title);
	        } catch(c) {
	            alert("您的浏览器不支持,请按 Ctrl+D 手动收藏!");
	        }
        } else {
        	//window.sidebar ? window.sidebar.addPanel(title, url, "") : 
        	alert("您的浏览器不支持,请按 Ctrl+D 手动收藏!");
        }
	}
});

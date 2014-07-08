define(['jquery', 'component/jquery.cookie'], function($){
	return function(){
		var diggBox = $('.digg-box'), prefix = 'hclick-digg', className = prefix;

		diggBox.each(function(){

			var $this = $(this), 
				postid = $this.attr('data-post-id'),
				data = {
					action: 'digg',
					postid: postid
				};

			if( $.cookie( prefix + postid) ) {
				$this.addClass( className );
			}

			$this.on('click', 'a', function(){
				var $self = $(this), polltype = $self.attr('data-poll-type');
				data = $.extend( data , {
					polltype : polltype
				});

				if( !$.cookie( prefix + postid )) {
					$.ajax({
						type: 'post',
						url : '/',
						data : data,
						success: function( data ){
							$self.find('p').html( data );
							$.cookie( prefix + postid, 1, {
								expires : 1,
								domain : '.baoxiaoyike.cn'
							});
							$this.addClass( className );
						}
					});
				} else {
					alert('亲，您已经对这条笑话表过态了!');
				}
				
			});


		});

		diggBox.trigger('click');
	}

		
});


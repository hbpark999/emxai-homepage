var PREVIEW_MODE = function(){
	var $preview_bar;
	var $window;
	var init = function(){
		$preview_bar = $('#preview_mode_bar');
		$window = $(window);
	};

	var closePreviewMode = function(back_url){
		window.location.href='/backpg/close_preview_mode.cm?back_url='+back_url;
	};
	return {
		'init' : function(){
			init();
		},
		'closePreviewMode' : function(back_url){
			closePreviewMode(back_url);
		}
	}
}();

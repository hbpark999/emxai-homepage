/**
 * 공통 컴포넌트 js 파일
 * 스타일은 im_component.css에 작성
 */
/**
 * 화면 아래에서 올라오는 시트 다이얼로그
 * @type {{isOpen: imSheet.isOpen, close: imSheet.close, open: imSheet.open}}
 */
var imSheet = function(){
	var default_option = {
		html: '',
		backdrop: 'rgba(0, 0, 0, 0.6)',  // 뒷배경 색상
		zIndex: 1351
	};
	var $im_sheet_content;
	var $im_sheet;
	var resizeObserver;
	var resizeObserverTimer;
	var open = function(o, callback) {
		var option = o;
		if(typeof option.id === 'undefined') option.id = makeUniq('im_sheet_');
		option = $.extend({}, default_option, option);
		if(isOpen(option.id)) close(option.id);
		$im_sheet_content = $('<div class="im-sheet-content"></div>').append(o.html);
		$im_sheet = $('<div class="im-sheet" id="' + option.id + '"></div>').css({background: option.backdrop, 'z-index': option.zIndex}).append($im_sheet_content);
		$('body').append($im_sheet).addClass('modal-open');
		setTimeout(function(){
			// 높이에 따른 top 위치 조정 함수
			function updateTop() {
				$im_sheet_content.css({
					'top': 'calc(100% - ' + $im_sheet_content.height() + 'px)'
				});
			}
			
			// 초기 위치 설정
			updateTop();
			$im_sheet_content.focus();
			
			// 초기 렌더링 완료 후 ResizeObserver 설정 (자잘한 초기 높이 변화 무시)
			resizeObserverTimer = setTimeout(function() {
				resizeObserverTimer = null;

				// 250ms 사이에 close() 로 시트가 사라졌으면 observer 부착 skip (누수 방지)
				if (!$im_sheet_content || !$im_sheet_content[0] || !document.contains($im_sheet_content[0])) {
					return;
				}

				// ResizeObserver를 사용하여 높이 변화 감지 (브라우저 지원시)
				if (window.ResizeObserver) {
					// 기존 observer 정리
					if (resizeObserver) {
						resizeObserver.disconnect();
					}

					resizeObserver = new ResizeObserver(function(entries) {
						for (var entry of entries) {
							// 높이가 변경되었을 때 top 위치 재조정 (트랜지션 없이 즉시)
							$im_sheet_content.css({
								'transition': 'none',
								'top': 'calc(100% - ' + $im_sheet_content.height() + 'px)'
							});

							// 위치 조정 후 트랜지션 복원 (다음 프레임에서)
							setTimeout(function() {
								$im_sheet_content.css('transition', '');
							}, 0);
						}
					});

					// $im_sheet_content 요소 관찰 시작
					resizeObserver.observe($im_sheet_content[0]);
				}
			}, 250);
			
			setTimeout(function(){
				if(typeof callback == 'function')
					callback($im_sheet);
			}, 200);
		}, 10);
		$im_sheet.on('click', function(e){
			if($(e.target).parents('.im-sheet-content').length === 0){
				close(option.id);
			}
		});
	};
	var close = function(id, callback) {
		if(typeof id === 'undefined') return false;
		$im_sheet = $("#" + id);
		$im_sheet_content = $im_sheet.find('.im-sheet-content');
		$im_sheet_content.css({
			'top' : '100%'
		});
		
		// ResizeObserver 정리 — observer 생성 전 timer 도 함께 해제 (250ms 사이 close 시 누수 방지)
		if (resizeObserverTimer) {
			clearTimeout(resizeObserverTimer);
			resizeObserverTimer = null;
		}
		if (resizeObserver) {
			resizeObserver.disconnect();
			resizeObserver = null;
		}
		
		setTimeout(function(){
			$im_sheet.remove();
			$('body').removeClass('modal-open');
			if(typeof callback == 'function')
				callback($im_sheet);
		}, 200);
	};
	var isOpen = function(id) {
		if(typeof id === 'undefined') return false;
		var $im_sheet = $("#" + id);
		return $im_sheet.css('display')==='block';
	};
	return {
		'open': function(o, callback){
			open(o, callback);
		},
		'close': function(id, callback){
			close(id, callback);
		},
		isOpen: function(id){
			isOpen(id);
		}
	}
}();

/**
 * imSheet 디자인의 셀렉트 다이얼로그
 * @type {{close: imSheetSelect.close, open: imSheetSelect.open}}
 */
var imSheetSelect = function(){
	var default_option = {
	};
	var open = function(list, selected, select_event, o){
		var option = o;
		if(typeof option.id === 'undefined') option.id = makeUniq('im_sheet_');
		option = $.extend({}, default_option, option);
		var $ul = $('<ul class="im-sheet-select"></ul>');
		for (var key in list){
			var selected_class = key === selected ? 'selected' : '';
			var $li = $('<li data-val="' + key + '" class="' + selected_class + '">' + list[key] + '</li>');
			$ul.append($li);
		}
		imSheet.open({
			html: $ul[0].outerHTML,
			id: option.id
		}, function($im_sheet){
			$im_sheet.find('ul > li').off('click').on('click', function(){
				var $that = $(this);
				var val = $that.attr('data-val');
				$im_sheet.find('ul > li').removeClass('selected');
				$that.addClass('selected');
				close(option.id, function(){
					if(val !== selected){
						if(typeof select_event == 'function')
							select_event(val, option.id);
					}
				});
			})
		});
	};
	var close = function(id, callback){
		imSheet.close(id, callback);
	};
	return {
		'open': function(list, selected, select_event, o){
			open(list, selected, select_event, o);
		},
		'close': function(id, callback){
			close(id, callback);
		}
	}
}();

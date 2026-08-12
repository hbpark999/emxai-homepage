/**
 * jQuery .load() 가드 (DEMO-1291)
 *
 *   - 시나리오 A (자기-page 자기-load): 브라우저에서 요청을 즉시 cancel + console 사유 출력.
 *   - 그 외 same-origin .load(): X-Imweb-JQ-Load 마커 헤더만 부착 (서버 관측용).
 *
 * 배경:
 *   DEMO-1291 발생 사고 — 코드위젯에 박힌 $("#bag").load("/shop_cart") 가 사이트 전체
 *   무한로딩을 유발. .load() 가 응답 HTML 의 inline <script> 를 콜백 실행 전에 즉시
 *   평가해버려 작성자가 콜백에서 .remove() 로 script 를 지워도 이미 실행됨.
 *
 * 시나리오 A (selector 없는 자기-page 자기-load) — 클라이언트 차단:
 *   현재 페이지 P 의 위젯이 .load(P) 로 자기 자신을 다시 끌어오면, 응답 안의 같은 위젯이
 *   또 .load(P) 를 호출 → 무한 재귀 + 스크립트 중복 실행. 가장 직접적인 사고 패턴.
 *   단, .load("P #selector") 처럼 selector 접미사가 있으면 jQuery 가 응답의 <script> 를
 *   제거 후 주입하므로 재귀 위험이 없다 → 차단하지 않고 마커만 부착(정상 섹션 갱신 패턴).
 *   resolveLoadPath(url) 이 현재 페이지 path 와 같고 selector 가 없으면:
 *     1. 원본 .load 를 호출하지 않는다 → 응답을 DOM 에 삽입하지 않으므로 재귀/스크립트
 *        재실행을 원천 차단.
 *     2. console.error 로 차단 사유 출력.
 *     3. Network 탭 가시성을 위해 요청을 띄우자마자 abort → (canceled) 로 표시.
 *        (이 throwaway 요청의 응답은 절대 사용/삽입하지 않는다 — 진단 흔적 용도.)
 *
 * 마커 (시나리오 A 가 아닌 same-origin .load()):
 *   .load(url, ...) 의 url 첫 공백 앞 토큰을 URL 로 해석하여 same-origin 이면 pathname 을
 *   X-Imweb-JQ-Load 헤더로 부착. 서버측 self_recursion_guard.sub 관측용.
 *   cross-origin / URL parse 실패 / 비문자열 url 은 미부착 (사고 패턴 범위 밖).
 *
 * 로드 위치:
 *   html/common/class/site_page.cls 의 header_js 배열에 jQuery 직후 등록.
 *   head 영역에서 jQuery 직후 동기 로드 → 사이트 코드위젯 inline script 가 .load() 호출하기 전 패치 완료.
 *
 * 한계:
 *   - jQuery 가 아닌 fetch/XMLHttpRequest 직접 사용한 코드위젯은 미적용.
 *   - 코드위젯 작성자가 $.fn.load 를 다시 덮어쓰면 우회 가능 (드뭄).
 *   - jQuery 로드 전에 실행되는 코드 (jQuery 보다 먼저 로드된 외부 SDK 등) 는 못 잡음.
 *   - URL 생성자 미지원 환경 (구형 브라우저) 은 미적용 (사이트 동작 영향 없음).
 *   - 시나리오 B (다른 페이지 Q 에서 .load(P)) 는 자기-page 매칭이 안 됨 — 본 가드 범위 밖.
 */
(function ($) {
	if (!$ || !$.fn || typeof $.fn.load !== 'function' || typeof $.ajaxPrefilter !== 'function') {
		return;
	}

	var origLoad = $.fn.load;
	var IN_LOAD = '';

	// path 정규화 — 앞뒤 슬래시 제거 후 단일 선행 슬래시. 서버 self_recursion_guard.sub 의
	// `'/' . trim($path, '/')` 와 동일 규칙으로 맞춰 자기-page 판정을 일치시킨다.
	function normPath(p) {
		return '/' + String(p == null ? '' : p).replace(/^\/+|\/+$/g, '');
	}

	function resolveLoadPath(url) {
		if (typeof url !== 'string' || url === '') {
			return '';
		}
		// `.load("/path #selector")` 형식 지원 — 첫 공백 앞 토큰만 URL
		var firstToken = url.split(/\s+/)[0];
		if (!firstToken) {
			return '';
		}
		try {
			var absolute = new URL(firstToken, location.href);
			// cross-origin .load 는 사고 패턴 범위 밖
			if (absolute.host !== location.host) {
				return '';
			}
			return absolute.pathname || '';
		} catch (e) {
			return '';
		}
	}

	// selector 접미사 유무 — `.load("url selector")` 형식. selector 가 있으면 jQuery 가
	// 응답의 <script> 를 제거 후 주입하므로(실행 안 됨) 재귀 위험이 없다 → 차단 제외 판정에 사용.
	function hasSelectorSuffix(url) {
		if (typeof url !== 'string') {
			return false;
		}
		var parts = url.trim().split(/\s+/);
		return parts.length > 1 && parts.slice(1).join('') !== '';
	}

	// 시나리오 A 차단 시 Network 에 (canceled) 흔적만 남기는 throwaway 요청.
	// 응답은 절대 사용하지 않는다 (open → send → 즉시 abort).
	function emitCanceledTrace(rawUrl) {
		try {
			var firstToken = String(rawUrl).split(/\s+/)[0];
			var xhr = new XMLHttpRequest();
			xhr.open('GET', firstToken, true);
			try {
				xhr.setRequestHeader('X-Imweb-JQ-Load-Blocked', '1');
			} catch (e) {}
			xhr.send();
			xhr.abort();
		} catch (e) {}
	}

	$.fn.load = function (url) {
		// $(window).load(handler) event (jQuery 1.x 호환) — 통과
		if (typeof url === 'function') {
			return origLoad.apply(this, arguments);
		}

		var path = resolveLoadPath(url);

		// 시나리오 A: selector 없는 자기-page 자기-load → 클라이언트 차단.
		// selector 가 있으면 jQuery 가 script 를 제거하므로 재귀 위험 없음 → 통과(마커만).
		if (path && !hasSelectorSuffix(url) && normPath(path) === normPath(location.pathname)) {
			if (window.console && typeof console.error === 'function') {
				console.error(
					'[DEMO-1291] 자기 페이지 재귀 .load() 차단: ' + normPath(path) +
					' — 자기 자신을 ajax 로 다시 불러오면 응답 안의 <script> 가 재실행되어 ' +
					'무한 재귀와 중복 초기화를 유발합니다. (요청을 취소했습니다)'
				);
			}
			emitCanceledTrace(url);
			// 원본 .load 미호출 = 응답 DOM 삽입/스크립트 재실행 원천 차단. 체이닝 위해 this 반환.
			return this;
		}

		// 그 외 same-origin .load() — 마커만 부착 (서버 관측용)
		// 마커도 normPath 로 정규화 → 서버 self_recursion_guard.sub 의 trim 규칙과 동일 형태로 전파.
		// path 가 '' (cross-origin / 파싱 실패) 이면 마커 미부착 유지.
		var prev = IN_LOAD;
		IN_LOAD = path ? normPath(path) : '';
		try {
			return origLoad.apply(this, arguments);
		} finally {
			IN_LOAD = prev;
		}
	};

	$.ajaxPrefilter(function (options, originalOptions, jqXHR) {
		if (IN_LOAD) {
			jqXHR.setRequestHeader('X-Imweb-JQ-Load', IN_LOAD);
		}
	});
})(window.jQuery || window.$);

window.IMWEB_SHOP_FREE_SHIP_NOTIFY_SDK = (function () {

    // magnet-shell custom element를 페이지 로드 시점에 미리 등록한다.
    // 동적 주입되는 모달 HTML(get_order_alarm_modal / get_add_cart_alarm_modal / get_product_option_modal) 안에
    // 같은 import 스크립트가 있지만 innerHTML/append로 들어가면 브라우저가 <script>를 실행하지 않으므로,
    // SDK 진입 시점에 한 번 register하여 동적 magnet-shell이 자동 upgrade되도록 보장한다.
    // customElements.define은 idempotent하여 모달 측 인라인 import가 다시 호출되어도 무해.
    function patchMagnetShell(MagnetShellClass) {
        if (!MagnetShellClass || MagnetShellClass.__imwebManifestUrlPatched) {
            return;
        }

        var proto = MagnetShellClass.prototype;
        var connectedCallback = proto.connectedCallback;
        var resetMangetNode = proto.resetMangetNode;
        var attributeChangedCallback = proto.attributeChangedCallback;

        function syncManifestUrl(element) {
            element.manifestUrl = element.manifestUrl || element.getAttribute('data-manifest-url') || element.getAttribute('manifest-url') || '';
        }

        function executeProductRecommendationModuleScripts(element) {
            if (!element.classList || !element.classList.contains('foProductRecommendationMagnet')) {
                return;
            }

            var scripts = element.querySelectorAll('script[type="module"][src]');
            Array.prototype.forEach.call(scripts, function (script) {
                var src = script.getAttribute('src') || '';
                if (!src || src.indexOf('/_/fo-shopping/assets/product-recommendation-') === -1 || script.getAttribute('data-imweb-executed') === 'Y') {
                    return;
                }

                script.setAttribute('data-imweb-executed', 'Y');

                var executedScript = document.createElement('script');
                executedScript.type = 'module';
                executedScript.src = src;
                if (script.getAttribute('crossorigin') !== null) {
                    executedScript.setAttribute('crossorigin', script.getAttribute('crossorigin') || '');
                }
                document.head.appendChild(executedScript);
            });
        }

        proto.connectedCallback = function () {
            syncManifestUrl(this);
            return connectedCallback.apply(this, arguments);
        };

        proto.resetMangetNode = function () {
            syncManifestUrl(this);
            var result = resetMangetNode.apply(this, arguments);
            if (result && typeof result.then === 'function') {
                return result.then(function (value) {
                    executeProductRecommendationModuleScripts(this);
                    return value;
                }.bind(this));
            }

            executeProductRecommendationModuleScripts(this);
            return result;
        };

        proto.attributeChangedCallback = function (name, oldValue, newValue) {
            if (name === 'data-manifest-url' || name === 'manifest-url') {
                this.manifestUrl = newValue || this.getAttribute('data-manifest-url') || this.getAttribute('manifest-url') || '';
                if (typeof this.clearManifest === 'function') {
                    this.clearManifest();
                }
                return;
            }
            if (typeof attributeChangedCallback === 'function') {
                return attributeChangedCallback.apply(this, arguments);
            }
        };

        MagnetShellClass.__imwebManifestUrlPatched = true;
    }

    if (typeof customElements !== 'undefined') {
        var registeredMagnetShell = customElements.get('magnet-shell');
        if (registeredMagnetShell) {
            patchMagnetShell(registeredMagnetShell);
        } else {
            import('https://static.imweb.me/design-system/magnet/magnet-shell.js')
                .then(function (module) {
                    var currentMagnetShell = customElements.get('magnet-shell');
                    if (currentMagnetShell) {
                        patchMagnetShell(currentMagnetShell);
                        return;
                    }

                    var BaseMagnetShell = module.MagnetShell;
                    class ImwebMagnetShell extends BaseMagnetShell {
                        static get observedAttributes() {
                            var observedAttributes = BaseMagnetShell.observedAttributes || [];
                            return observedAttributes.indexOf('data-manifest-url') === -1
                                ? observedAttributes.concat('data-manifest-url')
                                : observedAttributes;
                        }
                    }

                    customElements.define('magnet-shell', ImwebMagnetShell);
                    patchMagnetShell(ImwebMagnetShell);
                })
                .catch(console.warn);
        }
    }

    // 장바구니 페이지의 주문 알림 모달(get_order_alarm_modal)은 브라우저 세션 1회만 노출한다.
    // IMWEB_SESSIONSTORAGE(vendor/js/common.js) 는 같은 탭의 페이지 이동에도 살아남으므로 재진입해도 다시 뜨지 않음.
    // 탭 종료 / 새 탭 진입 / 시크릿창 종료 시점에 자연스럽게 리셋되고, 로그아웃/로그인 시 logout.cm / backpg/login.cm 에서 명시적으로 제거된다.
    // 스토리지가 막힌 환경(IMWEB_SESSIONSTORAGE 미평가 등)에서는 노출하지 않는다 — 이미 본 것으로 간주.
    //
    // 한편 상품 상세의 장바구니 담기 알림 모달(get_add_cart_alarm_modal)은 의도적으로 페이지뷰 1회 정책을 유지 —
    // 상품을 둘러보며 여러 번 담는 흐름에서 매번 알림을 주는 사용성이 필요하다.
    var _SESSION_KEY_ORDER_ALARM_SHOWN = 'imweb:freeShipNotify:orderAlarmShown';
    var _addCartAlarmShownInThisPageview = false;

    // SDK 는 일반 script 로 즉시 평가되지만 mfe 번들은 module 로 defer 로드되어,
    // POPUP 단독 모드에서는 cart_list_make 응답의 cartTotal:update / cartFreeShippingRemainingPrice:update
    // dispatch 가 mfe 모듈 평가보다 먼저 발생해 mfe store 가 이벤트를 놓치는 케이스가 있다.
    // SDK 가 두 이벤트를 listen 해 마지막 값을 캐싱하고, mfe store 가 모듈 평가 시점에
    // 이 캐시에서 초기값을 hydrate 하여 dispatch 누락에도 일관된 값을 갖도록 한다.
    var _cachedCartTotal = null;
    var _cachedCartFreeShippingRemainingPrice = null;
    var _cachedSelectedOptionsTotal = null;
    var _cachedFreeShipNotifySettings = null;
    window.addEventListener('imweb:freeShipNotify:cartTotal:update', function (e) {
        var detail = e && e.detail ? e.detail : {};
        if (typeof detail.totalPrice === 'number') {
            _cachedCartTotal = detail.totalPrice;
        }
    });
    window.addEventListener('imweb:freeShipNotify:cartFreeShippingRemainingPrice:update', function (e) {
        var detail = e && e.detail ? e.detail : {};
        if (typeof detail.remainingPrice === 'number') {
            _cachedCartFreeShippingRemainingPrice = detail.remainingPrice;
        }
    });
    // 상품 상세 진입 시 site_shop.js 의 initDetail 이 옵션 없는 상품에 한해
    // 무료배송 기준 상품 금액을 selectedOptions:update 로 즉시 dispatch 한다.
    // 이 dispatch 가 mfe 모듈 평가보다 빠를 수 있어 cartTotal 과 동일하게 SDK 가 캐싱한다.
    window.addEventListener('imweb:freeShipNotify:selectedOptions:update', function (e) {
        var detail = e && e.detail ? e.detail : {};
        if (typeof detail.totalPrice === 'number') {
            _cachedSelectedOptionsTotal = detail.totalPrice;
        }
    });

    /**
     * mfe store 가 모듈 평가 시점에 호출. dispatch 누락 케이스에 초기값으로 사용된다.
     * @returns {number|null}
     */
    function getCachedCartTotal() {
        return _cachedCartTotal;
    }
    /**
     * mfe store 가 모듈 평가 시점에 호출. dispatch 누락 케이스에 초기값으로 사용된다.
     * @returns {number|null}
     */
    function getCachedCartFreeShippingRemainingPrice() {
        return _cachedCartFreeShippingRemainingPrice;
    }
    /**
     * mfe store 가 모듈 평가 시점에 호출. dispatch 누락 케이스에 초기값으로 사용된다.
     * @returns {number|null}
     */
    function getCachedSelectedOptionsTotal() {
        return _cachedSelectedOptionsTotal;
    }
    /**
     * mfe store 가 모듈 평가 시점에 호출. BO 미리보기 settings:update 가 MFE 마운트보다 먼저 발생한 경우의 초기값으로 사용된다.
     * @returns {object|null}
     */
    function getCachedFreeShipNotifySettings() {
        return _cachedFreeShipNotifySettings;
    }

    // 매출상승도구 미리보기(sales_tool_preview=freeShipNotify) 진입 시에는 페이지뷰 1회 제한을 우회한다.
    // BO에서 모달 미리보기를 반복 확인할 수 있어야 하므로 has*AlarmShown은 항상 false를 반환.
    // 초기화 시점에 1회 평가해 closure에 보관하면 매 호출마다 URL 파싱 비용을 들이지 않아도 된다.
    var _isSalesToolFreeShipNotifyPreview = (function () {
        try {
            var params = new URLSearchParams(window.location.search);
            return params.get('sales_tool_preview') === 'freeShipNotify';
        } catch (e) {
            return false;
        }
    })();

    if (_isSalesToolFreeShipNotifyPreview) {
        var isAllowedSalesToolPreviewOrigin = function (origin) {
            if (origin === window.location.origin) return true;
            return /^https:\/\/[a-z0-9-]+\.crm\.(imweb|imtest)\.me$/.test(origin);
        };

        // 누적 타겟 위치를 두고 RAF 마다 잔여 거리의 일부씩 좁히는 ease-out 방식.
        // wheel 이 빠르게 연속으로 들어와도 매번 즉시 scrollBy 하지 않고 target 에 누적만 하므로
        // behavior:'smooth' 가 만드는 큐잉/끊김 없이 매끄러운 관성 스크롤로 보인다.
        // 애니메이션이 멈춰서 target=null 이 되면 다음 wheel 에서 현재 스크롤 위치로 재동기화 — 외부 스크롤 변경(앵커 이동 등)과 자연스럽게 정합.
        var smoothScrollState = { targetX: null, targetY: null, rafId: 0 };
        var SMOOTH_SCROLL_EASE = 0.2;

        var tickSmoothScroll = function () {
            var s = smoothScrollState;
            var dy = s.targetY - window.scrollY;
            var dx = s.targetX - window.scrollX;
            if (Math.abs(dy) < 0.5 && Math.abs(dx) < 0.5) {
                window.scrollTo(s.targetX, s.targetY);
                s.rafId = 0;
                s.targetX = null;
                s.targetY = null;
                return;
            }
            window.scrollBy(dx * SMOOTH_SCROLL_EASE, dy * SMOOTH_SCROLL_EASE);
            s.rafId = requestAnimationFrame(tickSmoothScroll);
        };

        window.addEventListener('message', function (event) {
            if (!isAllowedSalesToolPreviewOrigin(event.origin)) return;
            var data = event.data;
            if (!data || typeof data !== 'object') return;
            if (data.type !== 'sales-tool-preview:wheel') return;
            var deltaY = typeof data.deltaY === 'number' ? data.deltaY : 0;
            var deltaX = typeof data.deltaX === 'number' ? data.deltaX : 0;

            var s = smoothScrollState;
            if (s.targetY === null) {
                s.targetY = window.scrollY;
                s.targetX = window.scrollX;
            }
            var maxY = Math.max(0, (document.documentElement.scrollHeight || 0) - window.innerHeight);
            var maxX = Math.max(0, (document.documentElement.scrollWidth || 0) - window.innerWidth);
            s.targetY = Math.max(0, Math.min(maxY, s.targetY + deltaY));
            s.targetX = Math.max(0, Math.min(maxX, s.targetX + deltaX));
            if (!s.rafId) {
                s.rafId = requestAnimationFrame(tickSmoothScroll);
            }
        });
    }

    /**
     * 장바구니 주문 알림 모달이 이번 브라우저 세션(같은 탭의 페이지 이동 포함) 안에서 이미 노출됐는지 여부.
     * IMWEB_SESSIONSTORAGE 미평가 등 스토리지 접근 불가 시에는 노출을 보류한다 (이미 본 것으로 간주).
     * 미리보기 모드에서는 매번 false를 반환해 1회 제한을 우회한다.
     * @returns {boolean}
     */
    function hasOrderAlarmShown() {
        if (_isSalesToolFreeShipNotifyPreview) return false;
        if (typeof IMWEB_SESSIONSTORAGE === 'undefined') return true;
        return IMWEB_SESSIONSTORAGE.get(_SESSION_KEY_ORDER_ALARM_SHOWN) === true;
    }

    /**
     * 장바구니 주문 알림 모달이 노출됐음을 기록. AJAX로 모달 HTML을 fetch하기 직전에 호출한다.
     * sessionStorage 에 기록해 같은 탭의 다른 페이지로 이동해도 재노출되지 않게 한다.
     */
    function markOrderAlarmShown() {
        if (typeof IMWEB_SESSIONSTORAGE === 'undefined') return;
        try {
            IMWEB_SESSIONSTORAGE.set(_SESSION_KEY_ORDER_ALARM_SHOWN, true);
        } catch (e) {
            // sessionStorage quota 초과 등 — 무시. 1회 노출 추적이 불완전해질 뿐 사용자 흐름에는 영향 없음.
        }
    }

    /**
     * 상품 상세 장바구니 담기 알림 모달이 이번 페이지뷰에서 이미 노출됐는지 여부.
     * 미리보기 모드에서는 매번 false를 반환해 1회 제한을 우회한다.
     * @returns {boolean}
     */
    function hasAddCartAlarmShown() {
        if (_isSalesToolFreeShipNotifyPreview) return false;
        return _addCartAlarmShownInThisPageview;
    }

    /**
     * 상품 상세 장바구니 담기 알림 모달이 노출됐음을 기록. AJAX로 모달 HTML을 fetch하기 직전에 호출한다.
     */
    function markAddCartAlarmShown() {
        _addCartAlarmShownInThisPageview = true;
    }

    /**
     * 장바구니 페이지 무료배송 안내 마그넷에 무료배송까지 남은 금액(remainingPrice)을 셋팅하고
     * wrapper(magnet-shell의 parent)의 tw-hidden을 토글한다.
     *
     * cart.sub은 초기 렌더 시 실 데이터가 없어 wrapper가 tw-hidden 상태로 시작하고,
     * get_cart_price.cm / OMS_change_cart_item.cm 응답에 free_shipping_remaining_price가 포함되면 이 함수를 통해 노출된다.
     * MFE에는 CustomEvent로 값을 전달하여 자체 state를 갱신하도록 한다.
     * MFE는 이 값으로 게이지/메시지를 표시하고, 진행도 계산에 필요한 threshold는 (remainingPrice + currentTotal)로 역산한다.
     * @param {number|string|null|undefined} remainingPrice - 무료배송까지 남은 금액. 유효 범위(>=0)일 때만 노출.
     */
    function setCartFreeShippingRemainingPrice(remainingPrice) {
        // TOP_FIXED 마그넷과 POPUP 마커는 BO 설정(shopCartStyle)에 따라 독립적으로 존재한다.
        //   - TOP_FIXED 모드: 마그넷 wrap만 출력 (POPUP 마커 없음)
        //   - POPUP 모드: POPUP 마커만 출력 (TOP_FIXED 마그넷 없음)
        // 어느 한 쪽만 있을 때 다른 쪽 처리가 영향받지 않도록 두 요소를 독립적으로 다룬다.
        var magnet = document.getElementById('foFreeShipNotifyCartPageMagnet');
        var magnetWrap = magnet ? magnet.parentElement : null;
        var popupMarker = document.getElementById('shop_cart_order_alarm_with_free_ship_notify');

        // 응답 누락/무효 값: wrapper와 POPUP 마커를 함께 비활성화해 이전 선택값이 남지 않게 한다.
        if (remainingPrice === undefined || remainingPrice === null) {
            if (magnetWrap) magnetWrap.classList.add('tw-hidden');
            if (popupMarker) popupMarker.setAttribute('data-init-deliv-price-flexable-key', '0');
            return;
        }
        // 달러 등 소수점 통화 지원을 위해 parseFloat 사용.
        var numericRemaining = typeof remainingPrice === 'number' ? remainingPrice : parseFloat(remainingPrice);
        if (isNaN(numericRemaining) || numericRemaining < 0) {
            if (magnetWrap) magnetWrap.classList.add('tw-hidden');
            if (popupMarker) popupMarker.setAttribute('data-init-deliv-price-flexable-key', '0');
            return;
        }

        if (magnetWrap) magnetWrap.classList.remove('tw-hidden');

        // POPUP 마커의 data-init-deliv-price-flexable-key를 실 데이터로 동기화.
        // site_shop.js:addOrderWithCart가 마커값 > 0일 때만 모달을 띄우므로, 실 데이터를 반영해
        // 일반 모드에서도 정상적으로 모달이 노출되도록 한다. 무료배송 충족(0)이면 자연스럽게 모달이 뜨지 않는다.
        if (popupMarker) {
            popupMarker.setAttribute('data-init-deliv-price-flexable-key', String(numericRemaining));
        }

        window.dispatchEvent(new CustomEvent('imweb:freeShipNotify:cartFreeShippingRemainingPrice:update', {
            detail: { remainingPrice: numericRemaining }
        }));
    }

    /**
     * 상품 상세 인라인 마그넷의 노출 여부를 필수 옵션 선택 완료 상태에 따라 토글한다.
     * shopDetailStyle === 'require_option'으로 렌더된 wrapper만 대상. site_shop.js의
     * updateSelectedOptions에서 옵션 선택/해제 시마다 호출한다. 다른 스타일에서는 wrapper의
     * data-shop-detail-style이 다르거나 wrapper 자체가 없어 no-op로 안전하게 동작한다.
     * @param {boolean} isCompleted - 필수 옵션이 모두 선택되었는지 여부
     */
    function setRequireOptionCompleted(isCompleted) {
        var wrap = document.querySelector('._free_ship_notify_detail_magnet_wrap[data-shop-detail-style="require_option"]');
        if (!wrap) return;
        wrap.style.display = isCompleted ? '' : 'none';
    }

    /**
     * 무료배송 안내 모달 버튼 등 PHP에서 렌더된 영역의 강조 색상은 CSS 변수
     * --free-ship-notify-accent 로 inline 참조한다. PHP가 페이지 렌더 시점에 BO 설정값을 인자로 넘겨 호출하면
     * documentElement에 세팅돼 AJAX로 나중에 주입되는 모달까지 모두 cascade로 받는다.
     *
     * 빈 문자열이 들어오면 변수를 제거(removeProperty)하여 `var(--free-ship-notify-accent, ...)`의
     * 폴백 체인(브랜드 컬러 등)이 동작하도록 한다. 빈 문자열로 setProperty하면 빈 값이 적용되어
     * 폴백이 동작하지 않으므로 명시적으로 제거하는 것이 중요하다.
     * @param {string} accentColor - BO 설정의 accentColor. 빈 문자열이면 변수 제거.
     */
    function setAccentColor(accentColor) {
        if (typeof accentColor !== 'string') return;
        if (accentColor.length === 0) {
            document.documentElement.style.removeProperty('--free-ship-notify-accent');
            return;
        }
        document.documentElement.style.setProperty('--free-ship-notify-accent', accentColor);
    }

    // settings:update 이벤트(BO sales-tool-preview 등 동적 갱신)는 같은 변수를 덮어쓴다.
    window.addEventListener('imweb:freeShipNotify:settings:update', function (event) {
        var detail = (event && event.detail) || {};
        _cachedFreeShipNotifySettings = Object.assign({}, _cachedFreeShipNotifySettings || {}, detail);
        setAccentColor(detail.accentColor);
    });

    /**
     * MFE 컴포넌트로 선택된 상품 옵션 총액 정보 전송
     * @param {number} totalPrice - 선택된 옵션 총 금액
     */
    function sendSelectedOptionsUpdate(totalPrice) {
        try {
            const event = new CustomEvent('imweb:freeShipNotify:selectedOptions:update', {
                detail: {
                    totalPrice: totalPrice || 0
                }
            });
            
            // 전역으로 이벤트 발송
            window.dispatchEvent(event);
            
        } catch (error) {
        }
    }
    
    /**
     * 상품 상세 페이지에서 선택된 옵션 총액 업데이트 전송
     * @param {number} total_price - 선택된 옵션 총 금액
     */
    function updateSelectedOptionsTotal(total_price) {
        sendSelectedOptionsUpdate(total_price || 0);
    }
    
    // load_state.cm 응답에 묶여 오는 BO 업셀 config 의 캐시.
    // mfe 모듈 평가 시점이 SDK fetch 보다 늦을 수 있어 listener 미등록 구간의 누락을 보정하기 위함.
    // sharedCurrentTotal 의 getCachedCartTotal 패턴과 동일.
    var _cachedFreeShipNotifyConfig = null;

    /**
     * MFE 컴포넌트로 상품 추천 목록 + BO 업셀 config 전송.
     *
     * 응답 안의 config 는 detail 의 sibling 키로 분리되어 dispatch 된다 (의미상 별개 도메인).
     * 기존 consumer 는 detail.recommendations.prod_list 만 읽고 있어 sibling 추가는 호환됨.
     *
     * @param {object} recommendations - { prod_list, config } shape (load_state.cm 응답의 prod_recommendation)
     */
    function sendProductRecommendations(recommendations) {
        try {
            var payload = recommendations || {};
            var config  = payload.config || null;
            if (config) {
                _cachedFreeShipNotifyConfig = config;
                // PHP 모달 버튼 등 magnet-shell 밖의 DOM 이 var(--free-ship-notify-accent, ...) 로 참조하므로
                // ajax 응답으로 config 가 들어오면 documentElement 의 CSS 변수도 같이 갱신해 PHP 쪽 setAccentColor 호출 의존을 제거.
                if (typeof config.accentColor === 'string') {
                    setAccentColor(config.accentColor);
                }
            }
            const event = new CustomEvent('imweb:freeShipNotify:recommendations:update', {
                detail: {
                    recommendations: { prod_list: payload.prod_list || [] },
                    config:          config,
                }
            });

            // 전역으로 이벤트 발송
            window.dispatchEvent(event);

        } catch (error) {
        }
    }

    /**
     * 추천 상품 카트 추가 완료 신호 — MFE 가 BrandScope click_complete_add_free_shipping_upsell 발화에 사용.
     * 옵션 없음 / 있음, prod / cart 4 케이스 모두 동일 이벤트로 통합.
     */
    function dispatchAdditionalProductAdded(prodIdx, result) {
        try {
            var cartCode = result && typeof result.cart_code === 'string' ? result.cart_code : '';
            window.dispatchEvent(new CustomEvent('imweb:freeShipNotify:additionalProductAdded', {
                detail: { prodIdx: prodIdx, cartCode: cartCode, cart_code: cartCode }
            }));
        } catch (e) {
        }
    }

    var _inlineMagnetCodeByIdx = {};

    function dispatchInlineMagnetItemCounts() {
        if (typeof window.__imwebFreeShipInlineItemCounts !== 'object' || window.__imwebFreeShipInlineItemCounts === null) {
            window.__imwebFreeShipInlineItemCounts = {};
        }
        window.dispatchEvent(new CustomEvent('imweb:freeShipNotify:cartItems:update', {
            detail: { counts: Object.assign({}, window.__imwebFreeShipInlineItemCounts) }
        }));
    }

    function incrementInlineMagnetItemCount(code, idx) {
        if (typeof code !== 'string' || code === '') return;
        if (typeof window.__imwebFreeShipInlineItemCounts !== 'object' || window.__imwebFreeShipInlineItemCounts === null) {
            window.__imwebFreeShipInlineItemCounts = {};
        }
        window.__imwebFreeShipInlineItemCounts[code] = (window.__imwebFreeShipInlineItemCounts[code] || 0) + 1;
        if (typeof idx === 'number' && idx > 0) {
            _inlineMagnetCodeByIdx[idx] = code;
        }
        dispatchInlineMagnetItemCounts();
    }

    function resetInlineMagnetItemCounts() {
        window.__imwebFreeShipInlineItemCounts = {};
        dispatchInlineMagnetItemCounts();
    }

    function getInlineMagnetCodeByIdx() {
        return Object.assign({}, _inlineMagnetCodeByIdx);
    }

    function syncInlineMagnetItemCountsFromAdditionals(additionalsList) {
        if (!Array.isArray(additionalsList)) return;
        var nextCounts = {};
        for (var i = 0; i < additionalsList.length; i++) {
            var item = additionalsList[i];
            if (!item || typeof item.idx !== 'number') continue;
            var code = _inlineMagnetCodeByIdx[item.idx];
            if (typeof code !== 'string' || code === '') continue;
            var count = (typeof item.count === 'number' && item.count > 0) ? item.count : 0;
            if (count > 0) {
                nextCounts[code] = count;
            }
        }
        window.__imwebFreeShipInlineItemCounts = nextCounts;
        dispatchInlineMagnetItemCounts();
    }

    /**
     * 모듈 평가 시점 hydration 용 — 마지막으로 받은 BO 업셀 config 스냅샷을 동기로 반환.
     * @returns {object|null}
     */
    function getCachedFreeShipNotifyConfig() {
        return _cachedFreeShipNotifyConfig;
    }

    function getProductRecommendationElement() {
        return document.querySelector('fo-shopping-product-recommendation');
    }

    function isProductRecommendationContext() {
        return !!(
            document.getElementById('foProductRecommendationAddCartAlertMagnet')
            || document.getElementById('foProductRecommendationCartPageMagnet')
            || getProductRecommendationElement()
        );
    }

    function getProductRecommendationContext(fallback_context) {
        if (fallback_context === 'cart' || fallback_context === 'prod') {
            return fallback_context;
        }

        var productRecommendationElement = getProductRecommendationElement();
        var productRecommendationShell = productRecommendationElement
            ? productRecommendationElement.closest('magnet-shell')
            : (
                document.getElementById('foProductRecommendationCartPageMagnet')
                || document.getElementById('foProductRecommendationAddCartAlertMagnet')
            );
        var context = productRecommendationShell ? productRecommendationShell.getAttribute('data-type') : null;
        return context === 'cart' ? 'cart' : 'prod';
    }
    
    /**
     * MFE 컴포넌트로 상품 옵션 HTML 정보 전송
     * @param {object} optionData - 상품 옵션 HTML 및 관련 정보
     */
    function sendProductOptionHtml(optionData) {
        try {
            const event = new CustomEvent('imweb:freeShipNotify:optionHtml:update', {
                detail: optionData || {}
            });
            
            // 전역으로 이벤트 발송
            window.dispatchEvent(event);
            
        } catch (error) {
        }
    }
    
    /**
     * 무료배송 안내 위젯의 초기 상태(추천 상품 + BO 업셀 config)를 한 요청으로 로드.
     * @param {number} [prod_idx] - 상품 인덱스. 생략 시 cart 맥락으로 간주하여 중복 상품 제외 없이 추천 목록을 반환한다.
     */
    function loadState(prod_idx, context, prod_code, prod_codes) {
        var hasProdIdx = !!prod_idx && prod_idx > 0;
        var hasProductRecommendationContext = context === 'cart' || context === 'prod';
        var isProductRecommendation = hasProductRecommendationContext && isProductRecommendationContext();
        var url = isProductRecommendation
            ? '/shop/product_recommendation/load_state.cm'
            : '/shop/free_ship_notify/load_state.cm';
        var requestData = hasProdIdx ? {'prod_idx': prod_idx} : {};

        if (isProductRecommendation) {
            requestData.context = getProductRecommendationContext(context);
            if (typeof prod_code === 'string' && prod_code !== '') {
                requestData.prod_code = prod_code;
            }
            if (Array.isArray(prod_codes) && prod_codes.length > 0) {
                requestData.prod_codes = prod_codes;
            }
        }

        $.ajax({
            type: 'POST',
            // prod_idx는 현재 추후 중복 상품 제외 용도로만 사용되므로 유효할 때만 전송
            data: requestData,
            url: url,
            dataType: 'json',
            cache: false,
            success: function(result) {

                if (result.msg === 'SUCCESS') {

                    // MFE 컴포넌트로 데이터 전송 (prod_list + config 묶음)
                    sendProductRecommendations(result.prod_recommendation);
                }
            },
            error: function(xhr, status, error) {
            }
        });
    }

    /**
     * BO 미리보기 전용 — 상품 코드 배열을 받아 해당 상품들의 full 데이터 + config 를 fetch.
     * 저장된 config 와 무관하게 편집 중인 선택 상태를 즉시 미리보기에 반영하기 위한 경로.
     * 응답 모양은 load_state.cm 과 동일 (prod_recommendation: { prod_list, config }).
     * 편집 중인 settings 는 별도 postMessage → settings 스토어가 ajax config 를 우선 덮어쓴다.
     * @param {string[]} prod_codes - 미리보기에 노출할 상품 코드 목록.
     */
    function loadStateByCodes(prod_codes) {
        if (!Array.isArray(prod_codes) || prod_codes.length === 0) {
            sendProductRecommendations({ prod_list: [] });
            return;
        }

        $.ajax({
            type: 'POST',
            data: { 'prod_codes': prod_codes },
            // jQuery 가 prod_codes[]=... 형태로 직렬화하도록 traditional: false (default) 유지.
            url: '/shop/free_ship_notify/load_state_by_codes.cm',
            dataType: 'json',
            cache: false,
            success: function(result) {

                if (result.msg === 'SUCCESS') {
                    sendProductRecommendations(result.prod_recommendation);
                }
            },
            error: function(xhr, status, error) {
            }
        });
    }
    
    /**
     * 상품 인덱스를 통해 추가 상품 선택
     * @param {number} product_idx - 상품 인덱스
     * @param {'prod'|'cart'} context - 호출 맥락. 'prod'(상품 상세)은 SITE_SHOP_DETAIL, 'cart'(장바구니)는 SITE_SHOP_CART 경로로 분기한다.
     * @param {function} callback - 완료 콜백 함수 (선택사항)
     */
    function selectAdditionalProductByIdx(product_idx, context, callback) {
        if (!product_idx || product_idx <= 0) {
            if (callback) callback(false, getLocalizeString('설명_오류가발생했습니다', '', '오류가 발생했습니다.'));
            return;
        }

        // 미지정/미지원 값인 경우 기존 동작 호환을 위해 'prod'로 fallback
        if (context !== 'prod' && context !== 'cart') {
            context = 'prod';
        }

        // context별로 필요한 전역 객체가 로드되어 있는지 확인
        if (context === 'prod') {
            if (typeof window.SITE_SHOP_DETAIL === 'undefined' || typeof window.SITE_SHOP_DETAIL.selectAdditionalProduct !== 'function') {
                if (callback) callback(false, getLocalizeString('설명_오류가발생했습니다', '', '오류가 발생했습니다.'));
                return;
            }
        } else {
            // cart 경로는 SITE_SHOP_CART에 대응 함수가 추가된 이후에 동작한다.
            if (typeof window.SITE_SHOP_CART === 'undefined') {
                if (callback) callback(false, getLocalizeString('설명_오류가발생했습니다', '', '오류가 발생했습니다.'));
                return;
            }
        }

        // 상품 정보 조회 Ajax 호출
        $.ajax({
            type: 'POST',
            data: {'product_idx': product_idx},
            url: '/shop/free_ship_notify/get_additional_product_info.cm',
            dataType: 'json',
            cache: false,
            success: function(result) {

                if (result.msg === 'SUCCESS' && result.product_info) {
                    const info = result.product_info;

                    if (typeof info.code === 'string' && info.code !== ''
                        && typeof info.product_idx === 'number' && info.product_idx > 0) {
                        _inlineMagnetCodeByIdx[info.product_idx] = info.code;
                    }

                    try {
                        if (info.has_required_options) {
                            // 필수 옵션이 있는 경우 getProductOptionHtml 호출하여 모달 표시
                            getProductOptionHtml(product_idx, info, context, callback);
                        } else if (context === 'cart') {
                            // cart 맥락: 필수 옵션이 없으므로 카트에 즉시 담기
                            if (typeof window.SITE_SHOP_CART.addCart !== 'function') {
                                if (callback) callback(false, getLocalizeString('설명_오류가발생했습니다', '', '오류가 발생했습니다.'));
                                return;
                            }
                            var addCartRequestOptions = {
                                shipping_template_code: info.shipping_template_code || ''
                            };
                            if (info.is_regularly_prod === true || info.is_regularly_prod === 'Y' || info.only_regularly === true || info.only_regularly === 'Y') {
                                addCartRequestOptions.cart_type = 'regularly';
                            }
                            window.SITE_SHOP_CART.addCart(info.product_idx, [], 1, function(success, message, addCartResult) {
                                if (success) {
                                    dispatchAdditionalProductAdded(product_idx, addCartResult);
                                    if (callback) callback(true, '카트 담기가 완료되었습니다.', addCartResult);
                                } else {
                                    if (callback) callback(false, message || getLocalizeString('설명_오류가발생했습니다', '', '오류가 발생했습니다.'));
                                }
                            }, addCartRequestOptions);
                        } else {
                            // prod 맥락: 필수 옵션이 없는 경우 직접 selectAdditionalProduct 호출
                            if (typeof window.SITE_SHOP_DETAIL.setFreeShipNotifyProdAdditionalRegularPrice === 'function') {
                                window.SITE_SHOP_DETAIL.setFreeShipNotifyProdAdditionalRegularPrice(info.product_idx, info.regular_price || info.price || 0);
                            }
                            window.SITE_SHOP_DETAIL.selectAdditionalProduct(
                                info.product_idx,
                                info.price,
                                info.name,
                                info.maximum_purchase_quantity,
                                info.member_maximum_purchase_quantity,
                                info.maximum_purchase_quantity_type,
                                info.optional_limit,
                                info.optional_limit_type,
                                info.stock_use,
                                info.stock,
                                info.stock_unlimit,
                                info.option_mix_type,
                                info.prod_type,
                                info.period_discount_flag,
                                info.period_discount_data,
                                info.period_discout_group_list,
                                info.membership_discount,
                                info.additional_creator_discount_data || null,
                                true
                            );

                            incrementInlineMagnetItemCount(info.code, info.product_idx);

                            dispatchAdditionalProductAdded(product_idx);
                            if (callback) callback(true, '추가 상품 선택이 완료되었습니다.');
                        }

                    } catch (error) {
                        if (callback) callback(false, getLocalizeString('설명_오류가발생했습니다', '', '오류가 발생했습니다.'));
                    }
                } else {
                    alert(getLocalizeString('설명_오류가발생했습니다', '', '오류가 발생했습니다.'));
                    if (callback) callback(false, result.error_msg || getLocalizeString('설명_오류가발생했습니다', '', '오류가 발생했습니다.'));
                }
            },
            error: function(xhr, status, error) {
                alert(getLocalizeString('설명_오류가발생했습니다', '', '오류가 발생했습니다.'));
                if (callback) callback(false, getLocalizeString('설명_오류가발생했습니다', '', '오류가 발생했습니다.'));
            }
        });
    }

    /**
     * 상품 옵션 HTML을 가져와서 MFE 모달에 전송
     * @param {number} product_idx - 상품 인덱스
     * @param {object} product_info - 상품 정보
     * @param {'prod'|'cart'} context - 호출 맥락
     * @param {function} callback - 완료 콜백 함수 (선택사항)
     */
    function getProductOptionHtml(product_idx, product_info, context, callback) {
        if (!product_idx || product_idx <= 0) {
            if (callback) callback(false, getLocalizeString('설명_오류가발생했습니다', '', '오류가 발생했습니다.'));
            return;
        }

        // 미지정/미지원 값인 경우 기존 동작 호환을 위해 'prod'로 fallback
        if (context !== 'prod' && context !== 'cart') {
            context = 'prod';
        }

        // 1단계: 기본 모달 HTML 구조 가져오기
        $.ajax({
            type: 'POST',
            data: {
                'prod_idx': product_idx,
                'product_name': product_info.name,
                'product_price_text': product_info.price_text,
                'product_thumb_url': product_info.thumb_url
            },
            url: '/shop/free_ship_notify/get_product_option_modal.cm',
            dataType: 'html',
            cache: false,
            success: function(modalHtml) {

                // 2단계: 옵션 HTML 가져오기 (context를 전달하여 cart 컨텍스트에서는 cart 핸들러가 emit 되도록 한다)
                $.ajax({
                    type: 'POST',
                    data: {
                        'prod_idx': product_idx,
                        'selected_require_options': [],
                        '__': '',
                        'is_additional': true,
                        'context': context
                    },
                    url: '/shop/load_prod_additional_option.cm',
                    dataType: 'json',
                    cache: false,
                    success: function(optionResult) {

                        if (optionResult.msg === 'SUCCESS') {
                            if (typeof SITE_SHOP_DETAIL !== 'undefined' && typeof SITE_SHOP_DETAIL.setProdAdditionalRequireOptionCount === 'function') {
                                SITE_SHOP_DETAIL.setProdAdditionalRequireOptionCount(
                                    optionResult.require_option_count,
                                    optionResult.require_input_option_count
                                );
                            }

                            // 모달 HTML에 옵션 HTML 삽입
                            var finalHtml = insertOptionHtml(modalHtml, optionResult.option_html);

                            // cocoaDialog로 모달 표시 (cart 컨텍스트에서는 initDetail 등에 메타데이터를 전달)
                            showProductOptionModal(finalHtml, product_idx, product_info, context, optionResult, callback);
                        } else {
                            if (callback) callback(false, getLocalizeString('설명_오류가발생했습니다', '', '오류가 발생했습니다.'));
                        }
                    },
                    error: function(xhr, status, error) {
                        if (callback) callback(false, getLocalizeString('설명_오류가발생했습니다', '', '오류가 발생했습니다.'));
                    }
                });
            },
            error: function(xhr, status, error) {
                if (callback) callback(false, getLocalizeString('설명_오류가발생했습니다', '', '오류가 발생했습니다.'));
            }
        });
    }
    
    /**
     * 모달 HTML에 옵션 HTML을 삽입
     * @param {string} modalHtml - 기본 모달 HTML
     * @param {string} optionHtml - 옵션 HTML
     * @returns {string} 완성된 HTML
     */
    function insertOptionHtml(modalHtml, optionHtml) {
        // 임시 div에 modalHtml을 로드해서 DOM 조작
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = modalHtml;
        
        // #prod_free_ship_notify_additional_options를 찾아서 innerHTML 설정
        var optionContainer = tempDiv.querySelector('#prod_free_ship_notify_additional_options');
        if (optionContainer) {
            optionContainer.innerHTML = optionHtml;
        }
        
        return tempDiv.innerHTML;
    }
    
    // 모달을 띄운 마지막 맥락. 모달 HTML의 submit 버튼이 completeAdditionalProductSelection()을 인자 없이 호출하므로
    // 어느 맥락에서 모달이 떴는지 기억해둔다.
    var currentSelectionContext = 'prod';
    // cart 맥락에서 submit 시 어느 상품을 카트에 담을지 기억 (SITE_SHOP_DETAIL.initDetail에 넘긴 prod_idx)
    var currentSelectionProductIdx = 0;
    // prod 맥락 completeAdditionalProductSelection 에서 cartItems:update dispatch 용 prod_code 추적
    var currentSelectionProductCode = '';
    var currentSelectionShippingTemplateCode = '';
    var currentSelectionCartType = '';
    // 현재 활성 모달의 cleanup/resolve 핸들. 각 showProductOptionModal 호출마다 closure로 생성되어
    // 자신의 product_idx와 snapshot에 묶인다. complete/cancel/implicit close가 이 핸들을 통해
    // 정확한 모달 인스턴스에 대해서만 동작하도록 보장.
    var _currentModalCleanup = null;            // 명시적 cancel / 암시적 close에서 호출 — snapshot으로 restore
    var _currentModalMarkResolved = null;       // 명시적 complete에서 호출 — 후속 implicit cleanup 차단

    /**
     * SITE_SHOP_DETAIL의 옵션 관리 기계를 cart 맥락에서 초기화한다.
     * showChangeCartItem과 동일한 패턴 - load_prod_additional_option.cm 응답 메타데이터를 그대로 사용.
     * @param {object} optionResult load_prod_additional_option.cm 응답
     */
    function initDetailForCartContext(optionResult) {
        if (typeof SITE_SHOP_DETAIL === 'undefined') {
            return;
        }

        if (window.innerWidth < 768
            && typeof SITE_SHOP_DETAIL.resetSelectedRequireOptions === 'function') {
            SITE_SHOP_DETAIL.resetSelectedRequireOptions();
        }

        if (typeof SITE_SHOP_DETAIL.initDetail === 'function') {
            SITE_SHOP_DETAIL.initDetail({
                prod_idx: optionResult.prod_idx,
                prod_price: optionResult.prod_price,
                require_option_count: optionResult.require_option_count_total || 0,
                use_image_optimizer_on_product_detail_markup: false,
                shop_use_full_load: false
            });
        }

        if (typeof SITE_SHOP_DETAIL.initProdStock === 'function' && optionResult.prod_stock) {
            SITE_SHOP_DETAIL.initProdStock(
                optionResult.prod_stock.stock_use,
                optionResult.prod_stock.stock_no_option,
                optionResult.prod_stock.stock_unlimit
            );
        }

        if (typeof SITE_SHOP_DETAIL.setMaxPurchaseQuantity === 'function' && optionResult.max_prod_quantity !== undefined) {
            SITE_SHOP_DETAIL.setMaxPurchaseQuantity(
                optionResult.max_prod_quantity,
                optionResult.max_member_quantity,
                optionResult.maximum_purchase_quantity_type,
                optionResult.optional_limit,
                optionResult.optional_limit_type,
                optionResult.prod_name
            );
        }

    }

    /**
     * cocoaDialog로 상품 옵션 모달 표시
     * @param {string} html - 완성된 모달 HTML
     * @param {number} product_idx - 상품 인덱스
     * @param {object} product_info - 상품 정보 (get_additional_product_info.cm 응답)
     * @param {'prod'|'cart'} context - 호출 맥락
     * @param {object} optionResult - load_prod_additional_option.cm 응답 (cart 컨텍스트 초기화용 메타데이터 포함)
     * @param {function} callback - 완료 콜백 함수
     */
    function showProductOptionModal(html, product_idx, product_info, context, optionResult, callback) {
        try {
            // 이 모달 인스턴스 전용 closure 변수들. 새 모달마다 독립 생성되어 hide_event/backdrop click이
            // 자신의 product_idx와 진입 시점 snapshot에만 적용되도록 격리한다.
            var modalContext = (context === 'cart') ? 'cart' : 'prod';
            var modalProductIdx = product_idx;
            var modalResolved = false;
            // prod 맥락에서만 진입 직전 상태 snapshot을 받아둠. cart 맥락은 카트로 직접 담는 흐름이라 불필요.
            var modalSnapshot = null;
            if (modalContext === 'prod'
                && typeof window.SITE_SHOP_DETAIL !== 'undefined'
                && typeof window.SITE_SHOP_DETAIL.snapshotProdAdditionalForModal === 'function') {
                modalSnapshot = window.SITE_SHOP_DETAIL.snapshotProdAdditionalForModal(modalProductIdx);
            }

            currentSelectionContext = modalContext;
            currentSelectionProductIdx = modalProductIdx;
            currentSelectionProductCode = (product_info && typeof product_info.code === 'string') ? product_info.code : '';
            currentSelectionShippingTemplateCode = (product_info && typeof product_info.shipping_template_code === 'string') ? product_info.shipping_template_code : '';
            currentSelectionCartType = (product_info && (
                product_info.is_regularly_prod === true ||
                product_info.is_regularly_prod === 'Y' ||
                product_info.only_regularly === true ||
                product_info.only_regularly === 'Y'
            )) ? 'regularly' : '';

            // 현재 모달의 cleanup 핸들 — snapshot 기반 restore. 진입 직전 상태로 되돌려
            // "이번 모달이 추가한 만큼만" revert (기존에 담겨있던 옵션/항목은 보존).
            var cleanupForThisModal = function () {
                if (modalResolved) return;
                modalResolved = true;
                if (modalContext === 'prod' && modalProductIdx > 0
                    && modalSnapshot
                    && typeof window.SITE_SHOP_DETAIL !== 'undefined'
                    && typeof window.SITE_SHOP_DETAIL.restoreProdAdditionalForModal === 'function') {
                    window.SITE_SHOP_DETAIL.restoreProdAdditionalForModal(modalProductIdx, modalSnapshot);
                }
                if (modalProductIdx === currentSelectionProductIdx) {
                    currentSelectionProductIdx = 0;
                }
            };
            // 명시적 complete에서 호출 — restore 없이 resolved만 표시해 후속 implicit cleanup 차단.
            var markResolvedForThisModal = function () {
                modalResolved = true;
            };
            _currentModalCleanup = cleanupForThisModal;
            _currentModalMarkResolved = markResolvedForThisModal;

            // prod 맥락에서만 SITE_SHOP_DETAIL의 추가상품 모달 상태 초기화 수행.
            // cart 맥락은 "추가상품 선택" 개념 없이 바로 카트에 담으므로 다른 초기화(initDetailForCartContext)를 사용한다.
            if (currentSelectionContext === 'prod'
                && typeof SITE_SHOP_DETAIL !== 'undefined'
                && typeof SITE_SHOP_DETAIL.selectAdditionalProductForModal === 'function') {
                if (typeof SITE_SHOP_DETAIL.setFreeShipNotifyProdAdditionalRegularPrice === 'function') {
                    SITE_SHOP_DETAIL.setFreeShipNotifyProdAdditionalRegularPrice(product_idx, product_info.regular_price || product_info.price || 0);
                }
                SITE_SHOP_DETAIL.selectAdditionalProductForModal(
                    product_idx,
                    product_info.price || 0,
                    product_info.name || '',
                    product_info.maximum_purchase_quantity || 0,
                    product_info.member_maximum_purchase_quantity || 0,
                    product_info.maximum_purchase_quantity_type || '',
                    product_info.optional_limit || 0,
                    product_info.optional_limit_type || '',
                    product_info.stock_use || 0,
                    product_info.stock || 0,
                    product_info.stock_unlimit || 0,
                    product_info.option_mix_type || '',
                    product_info.prod_type || '',
                    product_info.period_discount_flag || 0,
                    product_info.period_discount_data || {},
                    product_info.period_discout_group_list || [],
                    product_info.membership_discount || 0,
                    product_info.additional_creator_discount_data || null
                );
            }

            var $staleOptionModal = $('.modal_site_shop_free_ship_notify_option.in');
            if ($staleOptionModal.length > 0) {
                $staleOptionModal.modal('hide');
            }

            var is_mobile_width = (window.innerWidth < 768);
            if(is_mobile_width){
                // 추가 상품 시트와 역할을 공유하므로 ID를 같이 사용
                imSheet.close('prod_additional_sheet', () => {
                    imSheet.open({
                        id: 'prod_additional_sheet',
                        html: html,
                        backdrop: 'rgba(0, 0, 0, 0.15)',
                        zIndex: 17001,
                        onShow: function() {
                            // cart 컨텍스트는 모달이 DOM에 들어간 뒤 SITE_SHOP_DETAIL 초기화
                            // (initDetail이 모달 안의 #prod_options 등을 찾아야 하므로 mount 이후에 호출)
                            if (currentSelectionContext === 'cart') {
                                initDetailForCartContext(optionResult);
                            }
                        }
                    });

                    // backdrop 영역 클릭으로 닫을 때도 cleanup이 동작하도록 추가 click 핸들러 등록.
                    // closure로 캡쳐된 cleanupForThisModal을 직접 호출 — 자신의 product_idx와 snapshot 기준으로 안전하게 restore.
                    $('#prod_additional_sheet').on('click', function(e) {
                        if ($(e.target).parents('.im-sheet-content').length === 0) {
                            cleanupForThisModal();
                        }
                    });

                    // MFE 추천 영역의 담기 버튼 로딩 해제가 이 콜백에 걸려 있으므로 PC 분기와 동일하게 호출
                    if (callback) callback(true, '상품 옵션 모달을 표시했습니다.');
                });
            }else{
                $.cocoaDialog.open({
                    type: 'site_shop_free_ship_notify_option',
                    custom_popup: html,
                    pc_width: 440,
                    // 외부 클릭/ESC 등으로 cocoaDialog가 닫힐 때도 cleanup이 동작하도록 hide_event 등록.
                    // closure로 캡쳐된 cleanupForThisModal — 자신의 product_idx와 snapshot 기준으로 안전하게 restore.
                    // 명시적 complete/cancel은 modalResolved=true로 표시하므로 중복 cleanup 안 됨.
                    hide_event: cleanupForThisModal
                });

                // PC 모달은 동기 mount이므로 바로 초기화
                if (currentSelectionContext === 'cart') {
                    initDetailForCartContext(optionResult);
                }

                if (callback) callback(true, '상품 옵션 모달을 표시했습니다.');
            }
        } catch (error) {
            if (callback) callback(false, getLocalizeString('설명_오류가발생했습니다', '', '오류가 발생했습니다.'));
        }
    }

    /**
     * 추가 상품 선택 취소 처리 및 모달 닫기.
     * 모달 HTML의 취소 버튼/X 버튼에서 호출. prod 맥락은 selectAdditionalProductForModal이
     * 모달 노출 시점에 이미 selected_prod_additionals에 push했으므로 명시적 cleanup이 필요하다.
     * cart 맥락은 다음 모달이 열릴 때 initDetail이 모든 상태를 reset하므로 별도 cleanup 불필요.
     */
    function cancelAdditionalProductSelection() {
        // 현재 활성 모달의 cleanup 호출 — snapshot 기반 restore로 진입 직전 상태로 복원.
        // 이 호출이 modalResolved=true로 표시하므로 후속 hide_event / backdrop click이 중복 cleanup하지 않는다.
        if (typeof _currentModalCleanup === 'function') {
            _currentModalCleanup();
        }

        var is_mobile_width = (window.innerWidth < 768);
        if (is_mobile_width) {
            if (typeof imSheet !== 'undefined' && typeof imSheet.close === 'function') {
                imSheet.close('prod_additional_sheet');
            }
        } else if (typeof $ !== 'undefined' && typeof $.cocoaDialog === 'object' && typeof $.cocoaDialog.close === 'function') {
            var $optionModal = $('.modal_site_shop_free_ship_notify_option.in');
            if ($optionModal.length > 0) {
                $optionModal.modal('hide');
            } else {
                $.cocoaDialog.close();
            }
        }
    }

    /**
     * 추가 상품 선택 완료 처리 및 모달 닫기.
     * 모달 HTML의 submit 버튼에서 호출되며 인자를 받지 않는다. 직전 showProductOptionModal에서 저장한
     * currentSelectionContext를 읽어 context별로 분기한다.
     */
    function completeAdditionalProductSelection() {
        try {
            // 정상 완료 흐름 표시. 후속 hide_event / backdrop click이 snapshot 기준으로 되돌리지 않도록 resolved 플래그만 set.
            if (typeof _currentModalMarkResolved === 'function') {
                _currentModalMarkResolved();
            }
            if (currentSelectionContext === 'cart') {
                // cart 맥락: 무료배송 모달에서는 selectRequireOption이 selectOption을 호출하지 않고 선택 상태만 유지하므로
                // (selectProdAdditionalRequireOption 패턴과 동일) 여기서 selected_require_options를 직접 읽어 addCart 포맷으로 변환한다.
                if (typeof window.SITE_SHOP_CART === 'undefined' || typeof window.SITE_SHOP_CART.addCart !== 'function') {
                    return;
                }
                if (typeof SITE_SHOP_DETAIL === 'undefined' || typeof SITE_SHOP_DETAIL.getSelectedRequireOptions !== 'function') {
                    return;
                }

                var requireOptions = SITE_SHOP_DETAIL.getSelectedRequireOptions();
                var requireCount = (typeof SITE_SHOP_DETAIL.getRequireOptionCount === 'function')
                    ? (SITE_SHOP_DETAIL.getRequireOptionCount() || 0)
                    : 0;
                if (!requireOptions || requireOptions.length < requireCount) {
                    alert(typeof LOCALIZE !== 'undefined' && typeof LOCALIZE.설명_필수옵션이모두선택되어있지않습니다 === 'function'
                        ? LOCALIZE.설명_필수옵션이모두선택되어있지않습니다()
                        : '필수 옵션을 모두 선택해주세요.');
                    return;
                }

                var prodIdx = currentSelectionProductIdx;

                $.ajax({
                    type: 'POST',
                    url: '/shop/select_option.cm',
                    data: {
                        'prod_idx': prodIdx,
                        'count': 1,
                        'require': 'Y',
                        'options': requireOptions
                    },
                    dataType: 'json',
                    cache: false,
                    success: function (selectOptionResult) {
                        if (!selectOptionResult || selectOptionResult.msg !== 'SUCCESS') {
                            alert((selectOptionResult && selectOptionResult.msg) || getLocalizeString('설명_오류가발생했습니다', '', '오류가 발생했습니다.'));
                            return;
                        }

                        var optionPrice = (selectOptionResult.selected_option && typeof selectOptionResult.selected_option.price === 'number')
                            ? selectOptionResult.selected_option.price
                            : 0;

                        // add_cart.cm이 기대하는 포맷: [{ options, require, count, price }]
                        var addCartPayload = [{
                            options: requireOptions,
                            require: true,
                            count: 1,
                            price: optionPrice
                        }];

                        window.SITE_SHOP_CART.addCart(prodIdx, addCartPayload, 1, function(success, message, addCartResult) {
                            if (success) {
                                dispatchAdditionalProductAdded(prodIdx, addCartResult);
                                var is_mobile_width = (window.innerWidth < 768);
                                if (is_mobile_width) {
                                    if (typeof SITE_SHOP_DETAIL !== 'undefined'
                                        && typeof SITE_SHOP_DETAIL.resetSelectedRequireOptions === 'function') {
                                        SITE_SHOP_DETAIL.resetSelectedRequireOptions();
                                    }
                                    currentSelectionProductIdx = 0;
                                    currentSelectionContext = 'prod';
                                    imSheet.close('prod_additional_sheet');
                                } else {
                                    $('.modal_site_shop_free_ship_notify_option.in').modal('hide');
                                }
                            } else {
                                alert(message || getLocalizeString('설명_오류가발생했습니다', '', '오류가 발생했습니다.'));
                            }
                        }, {
                            shipping_template_code: currentSelectionShippingTemplateCode,
                            cart_type: currentSelectionCartType
                        });
                    },
                    error: function () {
                        alert(getLocalizeString('설명_오류가발생했습니다', '', '오류가 발생했습니다.'));
                    }
                });
                return;
            }

            if (typeof window.SITE_SHOP_DETAIL === 'undefined') {
                return;
            }

            // SITE_SHOP_DETAIL의 completeAdditionalProductSelection 함수 호출
            if (typeof window.SITE_SHOP_DETAIL.completeAdditionalProductSelection === 'function') {
                window.SITE_SHOP_DETAIL.completeAdditionalProductSelection();
                dispatchAdditionalProductAdded(currentSelectionProductIdx);
            }

        } catch (error) {
        }
    }

    // 모달의 close/continue 버튼 트래킹 — MFE 가 modal placement 마운트 시 setCloseTracker 로
    // 비동기 핸들러를 등록. PHP 의 close 버튼 onclick 이 trackCloseAndContinue(afterAction) 호출 시
    // 핸들러를 최대 500ms 기다린 후 afterAction 을 실행 (페이지 이동 race 최소화).
    var _closeTracker = null;

    function setCloseTracker(tracker) {
        _closeTracker = typeof tracker === 'function' ? tracker : null;
    }

    function trackCloseAndContinue(afterAction) {
        var done = false;
        function runAfter() {
            if (done) return;
            done = true;
            if (typeof afterAction !== 'function') return;
            try {
                afterAction();
            } catch (e) {
                // afterAction throw 가 Promise unhandled rejection 으로 묶이지 않도록 마이크로태스크 밖으로 재던짐.
                // 기존 동기 onclick 동작과 동등한 에러 surface 유지 (window.onerror 잡힘).
                setTimeout(function () { throw e; }, 0);
            }
        }

        if (typeof _closeTracker !== 'function') {
            runAfter();
            return Promise.resolve();
        }

        var trackerPromise;
        try {
            trackerPromise = _closeTracker();
        } catch (e) {
            runAfter();
            return Promise.resolve();
        }
        if (!trackerPromise || typeof trackerPromise.then !== 'function') {
            runAfter();
            return Promise.resolve();
        }

        var timeoutPromise = new Promise(function (resolve) { setTimeout(resolve, 500); });
        return Promise.race([trackerPromise.catch(function () {}), timeoutPromise])
            .then(runAfter, runAfter);
    }

    // 공개 API
    return {
        setAccentColor: setAccentColor,
        sendSelectedOptionsUpdate: sendSelectedOptionsUpdate,
        updateSelectedOptionsTotal: updateSelectedOptionsTotal,
        loadState: loadState,
        loadStateByCodes: loadStateByCodes,
        selectAdditionalProductByIdx: selectAdditionalProductByIdx,
        getProductOptionHtml: getProductOptionHtml,
        completeAdditionalProductSelection: completeAdditionalProductSelection,
        hasOrderAlarmShown: hasOrderAlarmShown,
        markOrderAlarmShown: markOrderAlarmShown,
        hasAddCartAlarmShown: hasAddCartAlarmShown,
        markAddCartAlarmShown: markAddCartAlarmShown,
        setRequireOptionCompleted: setRequireOptionCompleted,
        setCartFreeShippingRemainingPrice: setCartFreeShippingRemainingPrice,
        resetInlineMagnetItemCounts: resetInlineMagnetItemCounts,
        dispatchInlineMagnetItemCounts: dispatchInlineMagnetItemCounts,
        getInlineMagnetCodeByIdx: getInlineMagnetCodeByIdx,
        syncInlineMagnetItemCountsFromAdditionals: syncInlineMagnetItemCountsFromAdditionals,
        cancelAdditionalProductSelection: cancelAdditionalProductSelection,
        getCachedCartTotal: getCachedCartTotal,
        getCachedCartFreeShippingRemainingPrice: getCachedCartFreeShippingRemainingPrice,
        getCachedSelectedOptionsTotal: getCachedSelectedOptionsTotal,
        getCachedFreeShipNotifySettings: getCachedFreeShipNotifySettings,
        getCachedFreeShipNotifyConfig: getCachedFreeShipNotifyConfig,
        setCloseTracker: setCloseTracker,
        trackCloseAndContinue: trackCloseAndContinue
    };

})();

try {
    window.dispatchEvent(new CustomEvent('imweb:freeShipNotify:sdk-ready'));
} catch (e) {}

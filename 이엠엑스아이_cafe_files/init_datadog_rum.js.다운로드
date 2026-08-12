import { createImdog } from 'https://static.imweb.me/design-system/imdog/imdog.js';

var sessionSampleRate = (typeof SITE_CODE !== 'undefined' && typeof SESSION_SAMPLE_RATE !== 'undefined') ? SESSION_SAMPLE_RATE : 0;

if (typeof IS_B2B_SITE !== 'undefined' && IS_B2B_SITE) {
    sessionSampleRate = 0;
}

var imdog = createImdog();
imdog.init({
    applicationId: 'bcdd1a85-8a90-4c8c-8594-8a3f35984f6e',
	  clientToken:   'pub4b0d7410f941f04271a5ef090eb48d87',
	  service:       'brand-site',
    env: typeof TEST_SERVER !== 'undefined' && !TEST_SERVER ? 'prod' : 'dev',
    version: '260131',
    sessionSampleRate: sessionSampleRate,
    sessionReplaySampleRate: 0,
    customConfig : {
      strategy: {
        type: 'action-threshold',
        actionThreshold: 10,
      },
      receiver: { transport: 'auto' },
      domInteraction: { trackClicks: true },
      debug: false,
    },
    beforeSend: function(event) {
        event.context = event.context || {};
        if (event.type === 'view' && event.view && event.view.time_spent >= 10000000000) {
            event.context.session_retained_10s = true;
        }
        if (event.type === 'resource') {
            var resource = event.resource;
            if (resource && (resource.type === 'fetch' || resource.type === 'xhr')) {
                return event;
            }
            if (resource && resource.url && resource.url.indexOf('/_/') !== -1) {
                return event;
            }
            return null;
        }
        return event;
    },
});

if (typeof SITE_CODE !== 'undefined') {
    imdog.setAccount({
        id: SITE_CODE,
        ...(typeof UNIT_CODE !== 'undefined' && { unit_code: UNIT_CODE }),
        ...(typeof USE_SHOP_IN_SHOP !== 'undefined' && { use_shop_in_shop: USE_SHOP_IN_SHOP }),
        ...(typeof VIEWER_COUNTRY !== 'undefined' && VIEWER_COUNTRY && { viewer_country: VIEWER_COUNTRY }),
    });
}

imdog.setUser({
    ...(typeof MEMBER_HASH !== 'undefined' && MEMBER_HASH && { id: MEMBER_HASH }),
    ...(typeof IS_GUEST !== 'undefined' && { is_guest: IS_GUEST }),
});

(function() {
    if (typeof jQuery === 'undefined') return;

    jQuery(document).ajaxError(function(event, xhr, settings) {
        var errorType = xhr.status === 504 ? 'gateway_timeout' : 'ajax_http_error';
        imdog.addError(new Error('AJAX 요청 실패: ' + xhr.status + ' ' + (xhr.statusText || '')), {
            source: 'custom',
            type: errorType,
            http_status: xhr.status,
            url: settings.url
        });
    });

    jQuery(document).ajaxSuccess(function(event, xhr, settings) {
        if (settings.dataType !== 'json') return;
        var httpStatus = xhr.status;
        if (httpStatus >= 400) {
            var errorType = httpStatus === 504 ? 'gateway_timeout' : 'ajax_http_error';
            imdog.addError(new Error('AJAX 요청 실패: ' + httpStatus + ' ' + (xhr.statusText || '')), {
                source: 'custom',
                type: errorType,
                http_status: httpStatus,
                url: settings.url
            });
            return;
        }
        try {
            var res = typeof xhr.responseJSON !== 'undefined' ? xhr.responseJSON : JSON.parse(xhr.responseText);
            if (!res || res.msg === 'SUCCESS') return;
            imdog.addError(new Error('AJAX 비즈니스 에러: ' + res.msg), {
                source: 'custom',
                type: 'ajax_business_error',
                error_code: res.code,
                url: settings.url
            });
        } catch (e) {
        }
    });
})();

var SITE_VISIT_LOG = function(){

	var getDeviceUUID = function(){
		let du = new DeviceUUID().parse();
		let dua = [
			du.language,
			du.platform,
			du.os,
			du.browser,
			du.version,
			du.isDesktop,
			du.isMobile,
			du.isTablet,
			du.isWindows,
			du.isLinux,
			du.isLinux64,
			du.isMac,
			du.isiPad,
			du.isiPhone,
			du.isiPod,
			du.isSmartTV,
		];

		return dua;
	}

	var getStatSidData = function(){
		var storageKey = 'IMWEB_SITE_STAT_SID';

		var getTomorrowExpireAt = function(){
			var tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);
			tomorrow.setHours(0, 0, 0, 0);
			return tomorrow.getTime();
		};

		var saveStatSidData = function(sid, expireAt){
			try {
				localStorage.setItem(storageKey, JSON.stringify({
					sid: sid,
					expireAt: expireAt
				}));
			} catch (e) {}
		};

		var sanitizeStatSid = function(sid){
			sid = String(sid || '').replace(/[^a-zA-Z0-9_.:\-]/g, '');
			return sid.slice(0, 80);
		};

		var getCookieValue = function(name){
			try {
				var cookies = document.cookie ? document.cookie.split(';') : [];
				for (var i = 0; i < cookies.length; i++) {
					var cookie = cookies[i].replace(/^\s+|\s+$/g, '');
					if (cookie.indexOf(name + '=') !== 0) continue;
					return decodeURIComponent(cookie.slice(name.length + 1));
				}
			} catch (e) {}
			return '';
		};

		var getCookieStatSidData = function(){
			var sid = sanitizeStatSid(getCookieValue('SITE_STAT_SID'));
			if (!sid) return null;
			saveStatSidData(sid, getTomorrowExpireAt());
			return {
				sid: sid,
				isNew: false
			};
		};

		var makeStatSidData = function(now){
			var sid = 'ls' + now + Math.random().toString(36).slice(2, 14);
			saveStatSidData(sid, getTomorrowExpireAt());
			return {
				sid: sid,
				isNew: true
			};
		};

		try {
			var now = new Date().getTime();
			var cookieStatSidData = getCookieStatSidData();
			if (cookieStatSidData) return cookieStatSidData;

			var saved = localStorage.getItem(storageKey);
			if (saved) {
				var savedData = null;
				try {
					savedData = JSON.parse(saved);
				} catch (e) {
					localStorage.removeItem(storageKey);
				}
				if (savedData && savedData.sid && savedData.expireAt && savedData.expireAt > now) {
					return {
						sid: savedData.sid,
						isNew: false
					};
				}
			}

			return makeStatSidData(now);
		} catch (e) {
			var fallbackCookieStatSidData = getCookieStatSidData();
			if (fallbackCookieStatSidData) return fallbackCookieStatSidData;
			return makeStatSidData(new Date().getTime());
		}
	}

	var appendEdgeStatelessToken = function(data, edgeStatelessToken){
		if (edgeStatelessToken) {
			data.edge_stateless_token = edgeStatelessToken;
		}
		return data;
	}

	var addVisitLog = function(referer, token, token_key, menu_code, first_visit, edgeStatelessLog, edgeStatelessToken, retry){
		edgeStatelessLog = edgeStatelessLog === true;
		if (retry === undefined) retry = edgeStatelessLog;

		var data = {'referer' : referer, 'token' : token, 'token_key':token_key, 'menu_code':menu_code, 'dua': getDeviceUUID().join(':'),'first_visit':first_visit?'Y':'N'};
		if (edgeStatelessLog) {
			var statSidData = getStatSidData();
			data.stat_sid = statSidData.sid;
			data.stat_sid_new = statSidData.isNew ? 'Y' : 'N';
			appendEdgeStatelessToken(data, edgeStatelessToken);
		}

		$.ajax({
			type : 'POST',
			data : data,
			url : ('/backpg/add_visit_log.cm'),
			dataType : 'json',
			success : function(res){
				if (edgeStatelessLog && retry && res && String(res.msg) === '-100') {
					getToken(function(newToken, newTokenKey){
						addVisitLog(referer, newToken, newTokenKey, menu_code, first_visit, true, edgeStatelessToken, false);
					}, edgeStatelessToken);
				}
			}
		});
	};

	var addProdViewLog = function(prodCode, token, token_key, edgeStatelessLog, edgeStatelessToken, retry){
		edgeStatelessLog = edgeStatelessLog === true;
		if (retry === undefined) retry = edgeStatelessLog;
		var data = {'prod_code' : prodCode, 'token' : token, 'token_key':token_key, 'dua': getDeviceUUID().join(':')};
		if (edgeStatelessLog) {
			appendEdgeStatelessToken(data, edgeStatelessToken);
		}

		$.ajax({
			type : 'POST',
			data : data,
			url : ('/backpg/add_prod_view_log.cm'),
			dataType : 'json',
			success : function(res){
				if (edgeStatelessLog && retry && res && String(res.msg) === '-100') {
					getToken(function(newToken, newTokenKey){
						addProdViewLog(prodCode, newToken, newTokenKey, true, edgeStatelessToken, false);
					}, edgeStatelessToken);
				}
			}
		});
	};

	var getToken = function(callback, edgeStatelessToken){
		var data = {};
		appendEdgeStatelessToken(data, edgeStatelessToken);
		$.ajax({
			type : 'POST',
			data : data,
			url : ('/backpg/get_visit_token.cm'),
			dataType : 'json',
			success : function(res){
				if(res.msg == 'SUCCESS'){
					callback(res.log_token, res.log_token_key, res.reffrer);
				}
			}
		});
	};

	return {
		'addVisitLog' : function(referer, token, token_key, menu_code, first_visit, edgeStatelessLog, edgeStatelessToken){
			addVisitLog(referer, token, token_key, menu_code, first_visit, edgeStatelessLog, edgeStatelessToken);
		},
		'addProdViewLog' : function(prodCode, token, token_key, edgeStatelessLog, edgeStatelessToken){
			addProdViewLog(prodCode, token, token_key, edgeStatelessLog, edgeStatelessToken);
		},
		'getToken' : function(callback, edgeStatelessToken){
			getToken(callback, edgeStatelessToken);
		}
	}
}();

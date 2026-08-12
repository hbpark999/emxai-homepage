;(function (window, document) {
    var sdkUrl = 'https://player.vimeo.com/api/player.js';
    var sdkLoading = false;
    var sdkQueue = [];

    if (typeof window.$f === 'function' || typeof window.Froogaloop === 'function') {
        return;
    }

    function isVimeoIframe(node) {
        if (!node || !node.nodeName || node.nodeName.toLowerCase() !== 'iframe') {
            return false;
        }
        var src = node.getAttribute('src') || '';
        return src.indexOf('//player.vimeo.com') >= 0 || src.indexOf('https://player.vimeo.com') >= 0 || src.indexOf('http://player.vimeo.com') >= 0;
    }

    function flushSdkQueue() {
        while (sdkQueue.length) {
            (function (callback) {
                callback();
            }(sdkQueue.shift()));
        }
    }

    function ensureVimeoSDK(callback) {
        if (window.Vimeo && typeof window.Vimeo.Player === 'function') {
            callback && callback();
            return;
        }

        // 동일 프레임에서 여러 번 호출되어도 SDK는 한 번만 로드하고, 작업은 큐에 저장한다.
        if (callback) {
            sdkQueue.push(callback);
        }

        if (sdkLoading) {
            // 로딩 중이면 추가 로딩 없이 큐에 쌓인 작업부터 처리한다.
            return;
        }

        sdkLoading = true;
        var script = document.createElement('script');
        script.async = true;
        script.src = sdkUrl;
        script.onload = function () {
            sdkLoading = false;
            flushSdkQueue();
        };
        script.onerror = function () {
            sdkLoading = false;
            // 로드 실패해도 큐를 비워 레거시 postMessage fallback 경로를 실행한다.
            flushSdkQueue();
        };

        var head = document.getElementsByTagName('head')[0];
        if (head) {
            head.appendChild(script);
        } else {
            callback && callback();
        }
    }

    function sendLegacyCommand(node, method) {
        if (!node || !node.contentWindow || typeof node.contentWindow.postMessage !== 'function') {
            return;
        }
        node.contentWindow.postMessage(JSON.stringify({ method: method }), '*');
    }

    function callMethod(node, method) {
        if (!isVimeoIframe(node)) {
            return false;
        }

        if (window.Vimeo && typeof window.Vimeo.Player === 'function') {
            if (!node.__lgVimeoPlayer) {
                try {
                    node.__lgVimeoPlayer = new window.Vimeo.Player(node);
                } catch (error) {
                    node.__lgVimeoPlayer = null;
                }
            }

        if (node.__lgVimeoPlayer && typeof node.__lgVimeoPlayer[method] === 'function') {
            var playerPromise = node.__lgVimeoPlayer[method]();

            if (playerPromise && typeof playerPromise.catch === 'function') {
                playerPromise.catch(function () {});
            }
            return true;
        }
    }

        sendLegacyCommand(node, method);
        return true;
    }

    function VimeoCompat(target) {
        this.element = typeof target === 'string' ? document.getElementById(target) : target;
    }

    VimeoCompat.prototype.api = function (method, arg1, arg2) {
        if (method === 'play' || method === 'pause') {
            if (window.Vimeo && typeof window.Vimeo.Player === 'function') {
                return callMethod(this.element, method);
            }

            sendLegacyCommand(this.element, method);
            ensureVimeoSDK(apiAfterLoad(this.element, method));
            return true;
        }

        if (method === 'addEventListener' && typeof arg2 === 'function') {
            var eventName = arg1;
            var callback = arg2;
            var self = this;
            ensureVimeoSDK(function () {
                if (window.Vimeo && typeof window.Vimeo.Player === 'function') {
                    if (!self.element.__lgVimeoPlayer) {
                        try {
                            self.element.__lgVimeoPlayer = new window.Vimeo.Player(self.element);
                        } catch (error) {
                            self.element.__lgVimeoPlayer = null;
                        }
                    }

                    if (self.element.__lgVimeoPlayer && typeof self.element.__lgVimeoPlayer.on === 'function') {
                        self.element.__lgVimeoPlayer.on(eventName, callback);
                    } else {
                        setTimeout(callback, 0);
                    }
                } else {
                    setTimeout(callback, 0);
                }
            });
        }

        return false;
    };

    function apiAfterLoad(node, method) {
        return function () {
            callMethod(node, method);
        };
    }

    function FroogaloopCompat(target) {
        return new VimeoCompat(target);
    }

    window.$f = FroogaloopCompat;
    window.Froogaloop = FroogaloopCompat;
})(window, document);

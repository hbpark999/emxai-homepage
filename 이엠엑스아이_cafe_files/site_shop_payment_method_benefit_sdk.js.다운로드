window.IMWEB_SHOP_PAYMENT_METHOD_BENEFIT_SDK = window.IMWEB_SHOP_PAYMENT_METHOD_BENEFIT_SDK || (function () {
    var _cachedState = null;
    var _hydratePaymentMethodBenefitModuleScripts = function () {};
    var DEBUG_PREFIX = '[PaymentMethodBenefit SDK]';

    function debugLog(message, payload) {
        return;
        // if (typeof console === 'undefined' || typeof console.log !== 'function') {
        //     return;
        // }
        // if (typeof payload === 'undefined') {
        //     console.log(DEBUG_PREFIX, message);
        //     return;
        // }
        // console.log(DEBUG_PREFIX, message, payload);
    }

    function debugWarn(message, payload) {
        return;
        // if (typeof console === 'undefined' || typeof console.warn !== 'function') {
        //     return;
        // }
        // if (typeof payload === 'undefined') {
        //     console.warn(DEBUG_PREFIX, message);
        //     return;
        // }
        // console.warn(DEBUG_PREFIX, message, payload);
    }

    function patchMagnetShell(MagnetShellClass) {
        if (!MagnetShellClass || MagnetShellClass.__imwebPaymentMethodBenefitPatched) {
            return;
        }

        var proto = MagnetShellClass.prototype;
        var connectedCallback = proto.connectedCallback;
        var resetMangetNode = proto.resetMangetNode;
        var attributeChangedCallback = proto.attributeChangedCallback;

        function syncManifestUrl(element) {
            element.manifestUrl = element.manifestUrl || element.getAttribute('data-manifest-url') || element.getAttribute('manifest-url') || '';
        }

        function executePaymentMethodBenefitModuleScripts(element) {
            if (!element.classList || !element.classList.contains('foPaymentMethodBenefitMagnet')) {
                return;
            }

            debugLog('execute module scripts start', element);
            var roots = [element];
            if (element.shadowRoot) {
                roots.push(element.shadowRoot);
            }

            Array.prototype.forEach.call(roots, function (root) {
                var scripts = root.querySelectorAll('script[type="module"]');
                debugLog('module script candidates', {
                    root: root,
                    count: scripts.length
                });
                Array.prototype.forEach.call(scripts, function (script) {
                    var src = script.getAttribute('src') || '';
                    var scriptContent = script.textContent || '';
                    var isPaymentMethodBenefitScript =
                        src.indexOf('/_/fo-shopping/assets/payment-method-benefit-') !== -1 ||
                        src.indexOf('/src/app/payment-method-benefit/') !== -1 ||
                        src.indexOf('/_/fo-shopping/@vite/client') !== -1 ||
                        src.indexOf('/_/fo-shopping/@react-refresh') !== -1 ||
                        scriptContent.indexOf('@react-refresh') !== -1 ||
                        scriptContent.indexOf('RefreshRuntime') !== -1;

                    if (!isPaymentMethodBenefitScript || script.getAttribute('data-imweb-executed') === 'Y') {
                        return;
                    }

                    if (!src && scriptContent === '') {
                        return;
                    }

                    script.setAttribute('data-imweb-executed', 'Y');
                    debugLog('execute module script', {
                        src: src,
                        inlinePreview: src ? '' : scriptContent.slice(0, 120)
                    });

                    var executedScript = document.createElement('script');
                    executedScript.type = 'module';
                    if (src) {
                        executedScript.src = src;
                        if (script.getAttribute('crossorigin') !== null) {
                            executedScript.setAttribute('crossorigin', script.getAttribute('crossorigin') || '');
                        }
                    } else {
                        executedScript.textContent = scriptContent;
                    }
                    document.head.appendChild(executedScript);
                });
            });
        }

        function executeExistingPaymentMethodBenefitModuleScripts(root) {
            var scope = root && root.nodeType ? root : document;
            var elements = [];
            if (scope.matches && scope.matches('magnet-shell.foPaymentMethodBenefitMagnet')) {
                elements.push(scope);
            }
            if (scope.querySelectorAll) {
                Array.prototype.push.apply(
                    elements,
                    scope.querySelectorAll('magnet-shell.foPaymentMethodBenefitMagnet')
                );
            }
            debugLog('hydrate existing magnets', {
                scope: scope,
                count: elements.length
            });
            Array.prototype.forEach.call(elements, function (element) {
                syncManifestUrl(element);
                executePaymentMethodBenefitModuleScripts(element);
            });
        }

        _hydratePaymentMethodBenefitModuleScripts = executeExistingPaymentMethodBenefitModuleScripts;

        proto.connectedCallback = function () {
            syncManifestUrl(this);
            var result = connectedCallback.apply(this, arguments);
            if (result && typeof result.then === 'function') {
                return result.then(function (value) {
                    executePaymentMethodBenefitModuleScripts(this);
                    return value;
                }.bind(this));
            }

            executePaymentMethodBenefitModuleScripts(this);
            return result;
        };

        proto.resetMangetNode = function () {
            syncManifestUrl(this);
            var result = resetMangetNode.apply(this, arguments);
            if (result && typeof result.then === 'function') {
                return result.then(function (value) {
                    executePaymentMethodBenefitModuleScripts(this);
                    return value;
                }.bind(this));
            }

            executePaymentMethodBenefitModuleScripts(this);
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

        MagnetShellClass.__imwebPaymentMethodBenefitPatched = true;
        executeExistingPaymentMethodBenefitModuleScripts();
    }

    function hydrate(root) {
        debugLog('hydrate called', root || document);
        if (typeof customElements === 'undefined') {
            debugWarn('customElements is undefined');
            return;
        }

        var registeredMagnetShell = customElements.get('magnet-shell');
        if (registeredMagnetShell) {
            debugLog('magnet-shell already registered');
            patchMagnetShell(registeredMagnetShell);
            _hydratePaymentMethodBenefitModuleScripts(root || document);
        } else {
            debugLog('import magnet-shell');
            import('https://static.imweb.me/design-system/magnet/magnet-shell.js')
                .then(function (module) {
                    var currentMagnetShell = customElements.get('magnet-shell');
                    if (currentMagnetShell) {
                        debugLog('magnet-shell registered while importing');
                        patchMagnetShell(currentMagnetShell);
                        _hydratePaymentMethodBenefitModuleScripts(root || document);
                        return;
                    }

                    var BaseMagnetShell = module.MagnetShell;
                    class ImwebPaymentMethodBenefitMagnetShell extends BaseMagnetShell {
                        static get observedAttributes() {
                            var observedAttributes = BaseMagnetShell.observedAttributes || [];
                            return observedAttributes.indexOf('data-manifest-url') === -1
                                ? observedAttributes.concat('data-manifest-url')
                                : observedAttributes;
                        }
                    }

                    customElements.define('magnet-shell', ImwebPaymentMethodBenefitMagnetShell);
                    debugLog('magnet-shell defined by payment method benefit sdk');
                    patchMagnetShell(ImwebPaymentMethodBenefitMagnetShell);
                    _hydratePaymentMethodBenefitModuleScripts(root || document);
                })
                .catch(function (e) {
                    debugWarn('magnet-shell import failed', e);
                });
        }
    }

    hydrate();

    function sendState(paymentMethodBenefit) {
        _cachedState = paymentMethodBenefit || { items: [], cards: [], payments: [] };
        debugLog('sendState', {
            itemCount: _cachedState.items && _cachedState.items.length ? _cachedState.items.length : 0,
            state: _cachedState
        });
        try {
            window.dispatchEvent(new CustomEvent('imweb:paymentMethodBenefit:state:update', {
                detail: {
                    paymentMethodBenefit: _cachedState
                }
            }));
            debugLog('state update event dispatched');
        } catch (e) {
            debugWarn('state update event dispatch failed', e);
        }
    }

    function loadState() {
        debugLog('loadState request start');
        $.ajax({
            type: 'POST',
            data: {},
            url: '/shop/payment_method_benefit/load_state.cm',
            dataType: 'json',
            cache: false,
            success: function (result) {
                debugLog('loadState success response', result);
                if (result && result.msg === 'SUCCESS') {
                    debugLog('loadState success payload', result.payment_method_benefit);
                    sendState(result.payment_method_benefit);
                    return;
                }
                debugWarn('loadState response is not SUCCESS', result);
                sendState({ items: [], cards: [], payments: [] });
            },
            error: function (xhr, textStatus, errorThrown) {
                debugWarn('loadState ajax error', {
                    status: xhr && xhr.status,
                    textStatus: textStatus,
                    errorThrown: errorThrown,
                    responseText: xhr && xhr.responseText
                });
                sendState({ items: [], cards: [], payments: [] });
            }
        });
    }

    function getCachedState() {
        debugLog('getCachedState', _cachedState);
        return _cachedState;
    }

    return {
        loadState: loadState,
        getCachedState: getCachedState,
        hydrate: hydrate
    };
})();

try {
    window.dispatchEvent(new CustomEvent('imweb:paymentMethodBenefit:sdk-ready'));
} catch (e) {}

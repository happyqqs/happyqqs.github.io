if (window.WebViewJavascriptBridge) { return; }

    if (!window.onerror) {
        window.onerror = function(msg, url, line) {
            console.log("WebViewJavascriptBridge: ERROR:" + msg + "@" + url + ":" + line);
        }
    }
    
    window.WebViewJavascriptBridge = {
        registerHandler: registerHandler,
        callHandler: callHandler,
        disableJavscriptAlertBoxSafetyTimeout: disableJavscriptAlertBoxSafetyTimeout,
        _handleMessageFromNative: _handleMessageFromNative
    };
    
    var messageHandlers = {};
    var responseCallbacks = {};
    var uniqueId = 1;
    var dispatchMessagesWithTimeoutSafety = true;
    
    function registerHandler(handlerName, handler) {
        messageHandlers[handlerName] = handler;
    }
    // js调native
    function callHandler(handlerName, data, responseCallback) {
        if (arguments.length == 2 && typeof data == 'function') {
            responseCallback = data;
            data = null;
        }
        _doSend({ handlerName:handlerName, data:data }, responseCallback);
    }
    
    function _doSend(message, responseCallback) {
        if (responseCallback) {
            // 保存回调
            var callbackId = 'cb_'+(uniqueId++)+'_'+new Date().getTime();
            responseCallbacks[callbackId] = responseCallback;
            message['callbackId'] = callbackId;
        }
        window.webkit.messageHandlers.jsToNative.postMessage(message)
    }
    
    // native调js
    function _handleMessageFromNative(messageJSON) {
        _dispatchMessageFromNative(messageJSON);
    }
    
    function _dispatchMessageFromNative(messageJSON) {
        if (dispatchMessagesWithTimeoutSafety) {
            setTimeout(_doDispatchMessageFromNative);
        } else {
             _doDispatchMessageFromNative();
        }
        
        function _doDispatchMessageFromNative() {
            var message = JSON.parse(messageJSON);
            var messageHandler;
            var responseCallback;
    
            if (message.responseId) {
                // native回调js
                responseCallback = responseCallbacks[message.responseId];
                if (!responseCallback) {
                    return;
                }
                responseCallback(message.responseData);
                delete responseCallbacks[message.responseId];
            } else {
                // native直接调js
                if (message.callbackId) {
                    // 存在回调
                    var callbackResponseId = message.callbackId;
                    responseCallback = function(responseData) {
                        _doSend({ handlerName:message.handlerName, responseId:callbackResponseId, responseData:responseData });
                    };
                }
                var handler = messageHandlers[message.handlerName];
                if (!handler) {
                    console.log("WebViewJavascriptBridge: WARNING: no handler for message from native:", message);
                } else {
                    handler(message.data, responseCallback);
                }
            }
        }
    }
    
    function disableJavscriptAlertBoxSafetyTimeout() {
        dispatchMessagesWithTimeoutSafety = false;
    }    
//; (function(){   
//})();

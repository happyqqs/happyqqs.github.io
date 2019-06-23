// 图片切换代码
let myImage = document.querySelector('img');
var num = 1

var jsBridge = function (callback) {
  if (window.WebViewJavascriptBridge) {
      return callback(WebViewJavascriptBridge);
  }
  else {
      document.addEventListener('WebViewJavascriptBridgeReady', function() {
          callback(WebViewJavascriptBridge);
      }, false);
  }
  if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'https://__bridge_loaded__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function() {
      document.documentElement.removeChild(WVJBIframe);
  }, 0);
}

jsBridge(function(bridge) {
  bridge.init();
  bridge.callHandler('init', {});
});

// 个性化欢迎信息
function setHeading(name) {
  let myHeading = document.querySelector('h1');
  myHeading.textContent = 'Mozilla 酷毙了，' + name + '！';
}

function setUserName() {
  let myName = prompt('请输入你的名字');
  localStorage.setItem('name', myName);
  setHeading(myName);
} 

let storedName = localStorage.getItem('name');
if(!storedName) {
   setUserName();
} else {
   setHeading(storedName);
}

let myButton = document.querySelector('button'); 
myButton.onclick = setUserName;

myImage.onclick = function() {
  var logInfo
  if (window.WebViewJavascriptBridge) {
    window.WebViewJavascriptBridge.callHandler('nativeAlert')
    logInfo = "post data"
  } else {
    logInfo = "no WebViewJavascriptBridge"
  }
  setHeading('sqq'+(num++)+logInfo)
  console.log('sqq'+(num++)+logInfo)
};
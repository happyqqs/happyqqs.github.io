// 图片切换代码
let myImage = document.querySelector('img');
var num = 1


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
};
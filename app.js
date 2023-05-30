const electron = require('electron');
const ipc = electron.ipcRenderer;

document.getElementById('pause').addEventListener('click', function () {
  ipc.send('pause');
});
document.getElementById('start').addEventListener('click', function () {
  var radios = document.getElementsByName('proxy');
  var proxyType = "tinsoftproxy"
  for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
      proxyType = radios[i].value;
      break;
    }
  }

  let key1 = document.getElementById('proxyKey1').value
  let key2 = document.getElementById('proxyKey2').value
  let key3 = document.getElementById('proxyKey3').value
  let key4 = document.getElementById('proxyKey4').value
  let apiKeyCaptcha = document.getElementById("apiKeyCaptcha").value
  ipc.send('start', apiKeyCaptcha, key1, key2, key3, key4, proxyType);
});
document.getElementById('result').addEventListener('click', function () {
  ipc.send('result');
})

document.getElementById('btn-createfile').addEventListener('click', function () {
  ipc.send('uploadfile');
})

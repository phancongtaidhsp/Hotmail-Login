const electron = require('electron');
const ipc = electron.ipcRenderer;

document.getElementById('reset').addEventListener('click', function () {
  ipc.send('reset');
});
document.getElementById('start').addEventListener('click', function () {
  var radios = document.getElementsByName('proxy');
  var proxyType = "shoplikeproxy"
  for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
      proxyType = radios[i].value;
      break;
    }
  }
  let dataText = document.getElementById('datatext').value;
  let proxyText = document.getElementById('proxytext').value;
  ipc.send('start', dataText, proxyType, proxyText);
});


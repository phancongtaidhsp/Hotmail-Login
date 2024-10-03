const electron = require('electron');
const ipc = electron.ipcRenderer;

document.getElementById('reset').addEventListener('click', function () {
  ipc.send('reset');
});
document.getElementById('start').addEventListener('click', function () {
  let dataText = document.getElementById('datatext').value || "dakmak847789352@hotmail.com|Limong47@\nbloodaroundfanta2777844@hotmail.com|Limong47@\ntheendstory7910616@hotmail.com|Limong47@";
  let proxyText = document.getElementById('proxytext').value || "f1447450d533ffc3891fdfa78be9a343";
  ipc.send('start', dataText, proxyText);
});


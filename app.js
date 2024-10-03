const electron = require('electron');
const ipc = electron.ipcRenderer;

document.getElementById('reset').addEventListener('click', function () {
  ipc.send('reset');
});
document.getElementById('start').addEventListener('click', function () {
  let dataText = document.getElementById('datatext').value;
  let proxyText = document.getElementById('proxytext').value;
  ipc.send('start', dataText, proxyText);
});


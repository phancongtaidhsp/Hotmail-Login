const electron = require('electron');
const ipc = electron.ipcRenderer;

document.getElementById('stop').addEventListener('click', function () {
  ipc.send('stop');
});
document.getElementById('start').addEventListener('click', function () {
  let pathFilePhone = document.getElementById('filepathphone').value
  let pathFileProxy = document.getElementById('filepathproxy').value
  if(pathFilePhone[0] == '"') {
    pathFilePhone = pathFilePhone.substring(1)
  }
  if(pathFilePhone[pathFilePhone.length - 1] == '"') {
    pathFilePhone = pathFilePhone.substring(0, pathFilePhone.length - 1)
  }
  if(pathFileProxy[0] == '"') {
    pathFileProxy = pathFileProxy.substring(1)
  }
  if(pathFileProxy[pathFileProxy.length - 1] == '"') {
    pathFileProxy = pathFileProxy.substring(0, pathFileProxy.length - 1)
  }
  ipc.send('start', pathFileProxy, pathFilePhone);
});


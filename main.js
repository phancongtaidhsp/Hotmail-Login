const { app, BrowserWindow, dialog } = require('electron');
const electron = require('electron');
const fs = require('fs-extra');
const ipc = electron.ipcMain;

const puppeteer = require('puppeteer-extra');
// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const Action = require('./Action');
const getData = require('./spreadsheet');
const GetTotal = require('./GetTotal');
const ExportData = require('./ExportData');
const exportResult = require('./Result');
var exec = require('child_process').exec;


let flagPause = false;
let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const run = async function (thread, proxies, phones) {
  let proxyIndex = 0;
  let phoneIndex = 0;
  let browser = null;
  let page = null;
  let incompleteFile = isFileExists(thread);
  if (incompleteFile) {
    win.webContents.send('checkfiles', incompleteFile);
    return;
  }
  win.webContents.send('disable', true);
  var st = GetTotal(thread);
  var data = getData(thread);
  var end = data.length;
  flagPause = false;
  let position = {
    x: 0,
    y: 0
  }
  if (thread === '2') {
    position = {
      x: 0,
      y: 500
    }
  } else if (thread === '3') {
    position = {
      x: 800,
      y: 0
    }
  } else if (thread === '4') {
    position = {
      x: 800,
      y: 500
    }
  }
  executableBrowserPath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  let browser_pid = null;
  let cmdKill = 'taskkill /F /T /PID '
  if (st < end) {
    win.webContents.send('done', false);
    for (let i = st; i < end; i++) {
      if (flagPause) {
        break;
      }
      if (!proxies[proxyIndex]) {
        proxyIndex = 0;
      }
      if (!phones[phoneIndex]) {
        phoneIndex = 0;
      }
      await new Promise(async (resolve) => {
        let myTimeout = setTimeout(async () => {
          console.log('>=180s');
          exec(cmdKill + browser_pid, (error, stdout, stderr) => { });
          resolve(true)
        }, 180000);
        try {
          browser = await puppeteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            // executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            headless: false,
            ignoreHTTPSErrors: true,
            ignoreDefaultArgs: ['--enable-automation'],
            args: [`--window-size=1200,650`, `--window-position=${position.x},${position.y}`,
              '--disable-infobars',
              '--disk-cache-size=0',
              '--ignore-certifcate-errors',
              '--ignore-certifcate-errors-spki-list',
              `--proxy-server=${proxies[proxyIndex]}`
            ],
          });
          browser_pid = browser.process().pid;
          page = await browser.newPage();
          try {
            let obj = await Action(page, data[i], phones[phoneIndex]);
            if (Array.isArray(obj) && obj?.length > 0) {
              let result = [...data[i], 'done', proxies[proxyIndex], phones[phoneIndex], ...obj];
              ExportData(result, thread);
              win.webContents.send('total', i + 1, thread);
              win.webContents.send('step', 1, thread);
              await browser.close();
            } else {
              if (!obj) obj = 'restore'
              let result = [...data[i], obj, proxies[proxyIndex], phones[phoneIndex]];
              ExportData(result, thread);
              win.webContents.send('total', i + 1, thread);
              if (obj === 'done') {
                win.webContents.send('step', 1, thread);
              }
              await browser.close();
            }
            clearTimeout(myTimeout)
            resolve(true)
          } catch (error) {
            console.log(error)
            let result = [...data[i], 'restore', proxies[proxyIndex], phones[phoneIndex]];
            ExportData(result, thread);
            win.webContents.send('total', i + 1, thread);
            await browser.close();
            clearTimeout(myTimeout)
            resolve(true)
          }
        } catch (e) {
          let result = [...data[i], 'restore', proxies[proxyIndex], phones[phoneIndex]];
          ExportData(result, thread);
          win.webContents.send('total', i + 1, thread);
          await browser.close();
          clearTimeout(myTimeout)
          resolve(true)
        }
        clearTimeout(myTimeout)
        resolve(true)
      })
      proxyIndex++;
      phoneIndex++;
    }
    await browser.close();
  }
  else {
    win.webContents.send('done', true);
  }
  win.webContents.send('disable', false);
}

function isFileExists(thread) {
  const fileData = `${__dirname}/../extraResources/man${thread}\\data${thread}.xlsx`;
  const fileOutput = `${__dirname}/../extraResources/man${thread}\\output${thread}.xlsx`;
  const fileKetQua = `${__dirname}/../extraResources/man${thread}\\ketqua${thread}.xlsx`;
  const fileFail = `${__dirname}/../extraResources/man${thread}\\fail${thread}.xlsx`;
  const check1 = fs.pathExistsSync(fileData);
  if (!check1) return `data${thread}.xlsx`;
  const check2 = fs.pathExistsSync(fileOutput);
  if (!check2) return `output${thread}.xlsx`;
  const check3 = fs.pathExistsSync(fileKetQua);
  if (!check3) return `ketqua${thread}.xlsx`;
  const check4 = fs.pathExistsSync(fileFail);
  if (!check4) return `fail${thread}.xlsx`;
  return false;
}

ipc.on('start', async function (event, pathFileProxy, pathFilePhone) {
  electron.session.defaultSession.clearCache();
  let splitNumber = 0;
  for (let i = 1; i <= 4; i++) {
    if (!isFileExists(`${i}`)) {
      splitNumber++;
    }
  }

  if (splitNumber) {
    let listProxy = fs.readFileSync(pathFileProxy, 'utf8');
    listProxy = listProxy.split(/\r?\n/);
    let numberSplitProxy = Math.ceil(listProxy.length / splitNumber);

    let listPhone = fs.readFileSync(pathFilePhone, 'utf8');
    listPhone = listPhone.split(/\r?\n/);
    let numberSplitPhone = Math.ceil(listPhone.length / splitNumber);

    for (let i = 1; i <= splitNumber; i++) {
      let proxies = listProxy.slice(numberSplitProxy*(i-1), numberSplitProxy*i);
      let phones = listPhone.slice(numberSplitPhone*(i-1), numberSplitPhone*i);
      run(`${i}`, proxies, phones).catch(e => console.log(e));
    }
  }

})

ipc.on('pause', function (event) {
  flagPause = true;
  win.webContents.send('step', 0);
})

ipc.on('result', function (event) {
  try {
    exportResult('1');
    exportResult('2');
    exportResult('3');
    exportResult('4');
    win.webContents.send('result', true);
  } catch (error) {
    win.webContents.send('result', false);
  }
})
ipc.on('uploadfile', function (event) {
  const files = dialog.showOpenDialogSync(win, {
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Excel', extensions: ['xlsx'] }]
  });
  if (!files) return;
  for (const file of files) {
    let arr = file.split('\\');
    let number = /\d/.exec(arr[arr.length - 1]);
    if (number) number = number[0];
    else number = 0;
    let destination = `${__dirname}/../extraResources/man${number}/${arr[arr.length - 1]}`;
    fs.copy(file, destination)
      .then(() => win.webContents.send('uploadfile', true))
      .catch(err => win.webContents.send('uploadfile', false))
  }
})
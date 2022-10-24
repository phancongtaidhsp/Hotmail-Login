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
const { checkKeyProxy, getNewIp } = require('./proxy');

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

const run = async function (thread, proxyKey, token) {
  let proxy = null;
  let browser = null;
  let context = null;
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
  if (st < end) {
    win.webContents.send('done', false);
    for (let i = st; i < end; i++) {
      if (flagPause) {
        break;
      }
      let newProxy = await getNewIp(proxyKey)
      if (proxy !== newProxy?.proxy) {
        proxy = newProxy?.proxy
      }
      browser = await puppeteer.launch({
        // executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        headless: false,
        ignoreHTTPSErrors: true,
        ignoreDefaultArgs: ['--enable-automation'],
        args: [`--window-size=600,450`, `--window-position=${position.x},${position.y}`,
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-infobars',
          '--window-position=0,0',
          '--ignore-certifcate-errors',
          '--ignore-certifcate-errors-spki-list',
          '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
          `--proxy-server=${proxy}`
        ],
      });
      context = await browser.createIncognitoBrowserContext();
      let page = await context.newPage();
      let obj = await Action(context, token, page, data[i])
      if (Array.isArray(obj) && obj?.length > 0) {
        let result = [...data[i], 'done', proxy, ...obj];
        ExportData(result, thread);
        win.webContents.send('total', i + 1, thread);
        win.webContents.send('step', 1, thread);
        await browser.close();
      } else {
        if (!obj) obj = 'restore'
        let result = [...data[i], obj, proxy];
        ExportData(result, thread);
        win.webContents.send('total', i + 1, thread);
        await browser.close();
      }
    }
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

ipc.on('start', async function (event, token, key1, key2, key3, key4) {
  let checkproxykey1, checkproxykey2, checkproxykey3, checkproxykey4;
  let incompleteFile1 = isFileExists('1');
  let incompleteFile2 = isFileExists('2');
  let incompleteFile3 = isFileExists('3');
  let incompleteFile4 = isFileExists('4');
  if (key1) {
    checkproxykey1 = await checkKeyProxy(key1)
    if (checkproxykey1) {
      run('1', key1, token);
    }
  } else if (!incompleteFile1) {
    win.webContents.send('failProxyKey', 1);
    return
  }
  if (key2) {
    checkproxykey2 = await checkKeyProxy(key2)
    if (checkproxykey2) {
      run('2', key2, token);
    }
  } else if (!incompleteFile2) {
    win.webContents.send('failProxyKey', 2);
    return
  }

  if (key3) {
    checkproxykey3 = await checkKeyProxy(key3)
    if (checkproxykey3) {
      run('3', key3, token);
    }
  } else if (!incompleteFile3) {
    win.webContents.send('failProxyKey', 3);
    return
  }

  if (key4) {
    checkproxykey4 = await checkKeyProxy(key4)
    if (checkproxykey4) {
      run('4', key4, token);
    }
  } else if (!incompleteFile4) {
    win.webContents.send('failProxyKey', 4);
    return
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
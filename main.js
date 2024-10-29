const { app, BrowserWindow, dialog } = require('electron');
const electron = require('electron');
const ipc = electron.ipcMain;

const puppeteer = require('puppeteer-extra');
// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const Action = require('./Action');
const { checkKeyProxyTmp, getNewIpTmp, checkKeyProxy, getNewIp } = require('./proxy');

let win;
let browerList = [null, null, null, null, null];

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

const run = async function (thread, data, proxyType, proxyKey) {
  let page = null;
  let getNewIPFunction = getNewIpTmp;
  if (proxyType === "shoplikeproxy") {
    getNewIPFunction = getNewIp;
  }
  let { proxy, username, password } = await getNewIPFunction(proxyKey);
  let position = {
    x: 0,
    y: 0
  }
  if (thread == '2') {
    position = {
      x: 300,
      y: 0
    }
  } else if (thread == '3') {
    position = {
      x: 600,
      y: 0
    }
  } else if (thread == '4') {
    position = {
      x: 900,
      y: 0
    }
  } else if (thread == '5') {
    position = {
      x: 1200,
      y: 0
    }
  }
  browerList[thread] = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    // executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: false,
    ignoreHTTPSErrors: true,
    ignoreDefaultArgs: ['--enable-automation'],
    args: [`--window-size=500,600`, `--window-position=${position.x},${position.y}`,
      '--disable-infobars',
      '--disk-cache-size=0',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list',
      `--proxy-server=${proxy}`
    ],
  });
  context = await browerList[thread].createIncognitoBrowserContext();
  page = await context.newPage();
  if (username && password) {
    await page.authenticate({
      username,
      password,
    });
  }
  await Action(page, data);
}


ipc.on('start', async function (event, dataText, proxyType, proxyText) {
  electron.session.defaultSession.clearCache();
  let dataArr = dataText.split("\n");
  let proxyArr = proxyText.split("\n");
  let findIncorrectData = dataArr.find(t => !t.includes("|"));
  if (findIncorrectData) {
    win.webContents.send('failInput');
    return;
  }
  let checkProxyFunc = checkKeyProxyTmp;
  if (proxyType == "shoplikeproxy") {
    checkProxyFunc = checkKeyProxy;
  }
  for (let keyProxy of proxyArr) {
    let isValidProxyKey = await checkProxyFunc(keyProxy);
    if (!isValidProxyKey) {
      win.webContents.send('failProxyKey', keyProxy);
      return;
    }
  }

  if (dataArr.length > 0 && dataArr.length <= 5 && proxyArr.length > 0) {
    let proxyIndex = 0;
    for (let i = 0; i < dataArr.length; i++) {
      let proxy = proxyArr[proxyIndex];
      run(i+1, dataArr[i].split("|"), proxyType, proxy);
      if (proxyIndex + 1 < proxyArr.length) {
        proxyIndex++;
      } else {
        proxyIndex = 0;
      }
    }
  } else {
    win.webContents.send('failInput');
  }
})

ipc.on('reset', async function (event) {
  for (const browser of browerList) {
    if (browser) {
      await browser.close();
    }
  }
  browerList = [null, null, null, null, null];
})

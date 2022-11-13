const SendMail = require("./SendMail")
const getLink = require("./GetLink");

const action = async (context, token, page, record) => {
  const [mail, pass, newpass] = record;

  let urlId = null;

  let sendMail = null;
  try {
    sendMail = await SendMail(context, token, page, mail)
  } catch (error) {
    console.log(error);
    return Promise.resolve("restore")
  }
  try {
    if (sendMail === "success") {
      for (let i = 0; i < 3; i++) {
        await page.waitFor(3000)
        urlId = await getLink(mail, pass)
        console.log('urlId...');
        console.log(urlId);
        if(urlId === 'no imap' || urlId === 'fail') {
          return Promise.resolve("fail")
        }
        if (urlId) {
          break;
        }
      }
      if (!urlId) {
        return Promise.resolve("fail")
      }
    } else {
      return Promise.resolve(sendMail);
    }
  
    await page.goto(urlId, { timeout: 30000, waitUntil: 'domcontentloaded' });
  
    await page.waitFor(3000)
  
    let btnContinue = await page.$(".ftd-box .m-button-container-right a");
  
    if (btnContinue) {
      await page.click(".ftd-box .m-button-container-right a");
    }
  
    let isUnlock = ""
  
    for (let index = 0; index < 10; index++) {
      await page.waitFor(3000)
      let passwordEl = await page.$("#password")
      let unLockLinkEl = await page.$(".pwdChange")
      if (passwordEl) {
        break;
      }
      if (unLockLinkEl) {
        isUnlock = "Unlock"
        await unLockLinkEl.click();
        break;
      }
    }
  
    await page.waitForSelector("#password", { timeout: 20000 })
  
    await page.waitFor(1000);
  
    await page.type("#password", newpass, { delay: 30 });
  
    await page.waitFor(1000);
  
    await page.type("confirm-password-input input", newpass, { delay: 30 });
  
    await page.waitFor(2000);
  
    await page.click("#action")
  
    await page.waitForSelector(".success-icon-wrap", { timeout: 10000 })
  
    await page.waitFor(3000)
  
    return Promise.resolve([isUnlock])
  } catch (error) {
    console.log(error);
  }
  
};
module.exports = action;
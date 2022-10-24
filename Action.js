const SendMail = require("./SendMail")
const getCode = require("./GetCode");

const action = async (context, token, page, record) => {
  const [mail, pass, newpass] = record;

  let urlId = null;

  for (let index = 0; index < 2; index++) {
    let sendMail = null;
    try {
      sendMail = await SendMail(context, token, page, mail)
    } catch (error) {
      console.log(error);
    }

    if (sendMail === "success") {
      await page.waitFor(3000)
      urlId = await getCode(mail, pass)
      console.log('urlId...');
      console.log(urlId);
      if (urlId) {
        break;
      }
    } else {
      return Promise.resolve("fail")
    }
  }

  if (!urlId) {
    return Promise.resolve("fail")
  }

  try {
    await page.goto(urlId, { timeout: 60000, waitUntil: 'networkidle2' });
  } catch (error) {
    await page.close();
    page = await context.newPage();
    await page.goto(urlId, { timeout: 60000, waitUntil: 'networkidle2' });
  }

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

  await page.waitForSelector("#password")

  await page.waitFor(1000);

  await page.type("#password", newpass, { delay: 30 });

  await page.waitFor(1000);

  await page.type("confirm-password-input input", newpass, { delay: 30 });

  await page.waitFor(2000);

  await page.click("#action")

  await page.waitForSelector(".success-icon-wrap")

  await page.waitFor(3000)

  return Promise.resolve([isUnlock])
};
module.exports = action;
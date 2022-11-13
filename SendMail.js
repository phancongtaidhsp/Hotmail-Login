const Captcha = require("2captcha")

const SendMail = async (context, captchaKey, page, mail) => {

  const solver = new Captcha.Solver(captchaKey)

  let captchaSolved = true;

  try {
    await page.goto('https://iforgot.apple.com/password/verify/appleid', { timeout: 30000 });
  } catch (error) {
    try {
      await page.close()
      page = await context.newPage();
      await page.goto('https://iforgot.apple.com/password/verify/appleid', { timeout: 30000 });
    } catch (err) {
      console.log(err);
    }
  }


  for (let index = 0; index < 5; index++) {

    await page.waitForSelector(".form-textbox input");

    await page.waitFor(1000);

    await page.type(".form-textbox input", mail, { delay: 30 })

    await page.waitFor(2000);


    if (await page.$("iforgot-captcha")) {
      const url = await page.evaluate(() => {
        let img = document.querySelector(".idms-captcha-wrapper img")
        if (img) {
          return Promise.resolve(img.src)
        }
      })
      if (url) {
        try {
          const { data } = await solver.imageCaptcha(url)
          if (data) {
            await page.type(".captcha-container .form-textbox input", data, { delay: 30 })
            await page.waitFor(1000)
            await page.click(".idms-step-footer button")
          }
        } catch (error) {
          return Promise.resolve("Unable resolve captcha")
        }
      }
    }

    for (let index = 0; index < 10; index++) {
      captchaSolved = true;
      await page.waitFor(3000);
      let title = await page.$(".app-title")
      let subtext = await page.$("#subtext0 .semi-bold")
      let resetOption = await page.$("input[value='reset_password']")
      let errorMess = await page.$("idms-textbox .form-message");
      let errorCaptcha = await page.$("iforgot-captcha .captcha-container .form-message");
      if (title) {
        let titleText = await title.evaluate(el => el.textContent)
        if (titleText.includes("Confirm your phone number.")) {
          return Promise.resolve("fail")
        }
      }
      if (subtext) {
        await page.click("#action");
        break;
      } else if (resetOption) {
        await page.click("#action");
        index = 0;
      } else if (errorCaptcha) {
        captchaSolved = false;
      } else if (errorMess) {
        return Promise.resolve("fail")
      }
    }
    if (captchaSolved) {
      break;
    } else {
      await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    }
  }

  await page.waitForSelector(".description .semi-bold");

  await page.waitFor(2000)

  let mailEl = await page.$(".description .semi-bold")

  let mailElText = await mailEl.evaluate(el => el.textContent)

  let arrMailText = mailElText.split("@");

  let arrMailReal = mail.split("@");

  if (arrMailText?.[0]?.[0] && arrMailReal?.[0]?.[0]) {
    if (arrMailReal?.[0]?.[0]?.toLowerCase() === arrMailText?.[0]?.[0].toLowerCase() && arrMailReal?.[1]?.[0]?.toLowerCase() === arrMailText?.[1]?.[0].toLowerCase()) {
      return Promise.resolve("success")
    }
  }

  return Promise.resolve("fail")

}

module.exports = SendMail;
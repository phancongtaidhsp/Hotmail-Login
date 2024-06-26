const fetchCode = require("./helper");
const promiseAny = require('promise.any');

const action = async (page, record, phonetext) => {
  const [mail, pass] = record;
  let [phone, urlPhone] = phonetext.split("----");
  phone = phone.replace("+1", "");

  await page.bringToFront();

  await page.goto('https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=154&ct=1719404353&rver=7.0.6738.0&wp=MBI_SSL&wreply=https%3a%2f%2foutlook.live.com%2fowa%2f%3fnlp%3d1%26cobrandid%3dab0455a0-8d03-46b9-b18b-df2f57b9e44c%26RpsCsrfState%3dfbaf99ec-fd80-babe-5844-a2916afa3c22&id=292841&aadredir=1&CBCXT=out&lw=1&fl=dob%2cflname%2cwld&cobrandid=ab0455a0-8d03-46b9-b18b-df2f57b9e44c', { timeout: 30000 });

  await page.waitForSelector('input[type="email"]');

  await page.waitFor(1000);

  await page.type('input[type="email"]', mail, { delay: 30 });

  await page.waitFor(1000);

  await page.click('button[type="submit"]');

  await promiseAny([
    page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
    page.waitForSelector('input[type="password"]'),
    page.waitForSelector('#usernameError'),
    page.waitForSelector('#proofConfirmationText'),
    page.waitForSelector('#iPollSessionProgress'),
    page.waitForSelector('#error_Info'),
  ])

  await page.waitFor(2000);

  await promiseAny([
    page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
    page.waitForSelector('input[type="password"]'),
  ])

  await page.type('input[type="password"]', pass, { delay: 30 });

  await page.waitFor(1000);

  await page.click('button[type="submit"]');

  await promiseAny([
    page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
    page.waitForSelector('#serviceAbuseLandingTitle'),
    page.waitForSelector('#proofConfirmationText'),
    page.waitForSelector('#iPollSessionProgress .c_dotsPlaying'),
    page.waitForSelector('#error_Info'),
    page.waitForSelector('#idTD_Error'),
    page.waitForSelector('#iProofList'),
    page.waitForSelector('#kmsiTitle'),
    page.waitForSelector('#iShowSkip')
  ])

  await page.waitFor(2000);

  await promiseAny([
    page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
    page.waitForSelector('#serviceAbuseLandingTitle'),
    page.waitForSelector('#proofConfirmationText'),
    page.waitForSelector('#iPollSessionProgress .c_dotsPlaying'),
    page.waitForSelector('#error_Info'),
    page.waitForSelector('#idTD_Error'),
    page.waitForSelector('#iProofList'),
    page.waitForSelector('#kmsiTitle'),
    page.waitForSelector('#iShowSkip')
  ])

  // is looked
  if (await page.$('#serviceAbuseLandingTitle')) {
    await page.waitForSelector('#StartAction');

    await page.waitFor(1000);

    await page.click('#StartAction');

    await promiseAny([
      page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
      page.waitForSelector('#enterPhoneNumberTitle')
    ])

    await page.waitFor(2000);

    await promiseAny([
      page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
      page.waitForSelector('#enterPhoneNumberTitle')
    ])

    await page.waitForSelector('#enterPhoneNumberTitle');

    await page.waitFor(1000);

    await page.type('#proofField', phone, { delay: 30 });

    await page.waitFor(1000);

    await page.click('#nextButton');

    await promiseAny([
      page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
      page.waitForSelector('#enter-code-input'),
      page.waitForSelector('#proofFieldError')
    ])

    await page.waitFor(2000);

    await promiseAny([
      page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
      page.waitForSelector('#enter-code-input'),
      page.waitForSelector('#proofFieldError')
    ])

    if (await page.$('#proofFieldError')) {
      return Promise.resolve('phone')
    }

    await page.waitFor(2000);

    let code = '';

    for (let i = 0; i < 10; i++) {
      code = await fetchCode(urlPhone);
      if (code) {
        break;
      }
      await page.waitFor(2000);
    }

    if (code) {
      await page.type('#enter-code-input', code, { delay: 30 });

      await page.waitFor(1000);

      await page.click('#nextButton');

      await promiseAny([
        page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
        page.waitForSelector('#FinishAction')
      ])

      await page.waitFor(3000);

      if (await page.$('#FinishAction')) {
        return Promise.resolve('done')
      }
    }
  }

  if (await page.$('#kmsiTitle')) {
    return Promise.resolve(['not require phone'])
  }

  if (await page.$('#iShowSkip')) {
    await page.waitFor(1000);

    await page.click('#iShowSkip');

    await promiseAny([
      page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
      page.waitForSelector('#kmsiTitle')
    ])

    await page.waitFor(2000);

    await promiseAny([
      page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
      page.waitForSelector('#kmsiTitle')
    ])

    if (await page.$('#kmsiTitle')) {
      return Promise.resolve(['not require phone'])
    }
  }

  return Promise.resolve('fail')

};
module.exports = action;
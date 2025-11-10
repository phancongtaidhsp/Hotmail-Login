const promiseAny = require('promise.any');

const action = async (page, record) => {
  const [mail, pass] = record;

  await page.bringToFront();

  await page.goto('https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=154&ct=1719404353&rver=7.0.6738.0&wp=MBI_SSL&wreply=https%3a%2f%2foutlook.live.com%2fowa%2f%3fnlp%3d1%26cobrandid%3dab0455a0-8d03-46b9-b18b-df2f57b9e44c%26RpsCsrfState%3dfbaf99ec-fd80-babe-5844-a2916afa3c22&id=292841&aadredir=1&CBCXT=out&lw=1&fl=dob%2cflname%2cwld&cobrandid=ab0455a0-8d03-46b9-b18b-df2f57b9e44c', { timeout: 30000 });

  await page.waitForSelector('input[type="email"]');

  await page.waitFor(1000);

  await page.type('input[type="email"]', mail, { delay: 30 });

  await page.waitFor(1000);

  await page.click('button[type="submit"]');

  await page.waitFor(2000);

  await promiseAny([
    page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
    page.waitForSelector('input[type="password"]'),
    page.waitForSelector('#proof-confirmation-email-input'),
    page.waitForSelector('#usernameError'),
    page.waitForSelector('#proofConfirmationText'),
    page.waitForSelector('#iPollSessionProgress'),
    page.waitForSelector('#error_Info'),
  ])

  await page.waitFor(2000);

  let [usepassBtn] = await page.$x("//span[normalize-space(text())='Use your password']");
  if (usepassBtn) {
    await usepassBtn.click();
  }

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
    page.waitForSelector('#iShowSkip'),
    page.waitForSelector("#acceptButton")
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
    page.waitForSelector('#iShowSkip'),
    page.waitForSelector("#acceptButton")
  ])

  let acceptBtn = await page.$("#acceptButton");
  if (acceptBtn) {
    await acceptBtn.click();
  }

  try {
    let frameHandle = await page.waitForSelector("#unified_consent_dialog_frame", { timeout: 120000 })
    let iFrame = await frameHandle.contentFrame();
    await iFrame.waitFor(1000);
    await iFrame.waitFor("#unified-consent-continue-button");
    await iFrame.waitFor(1000);
    await iFrame.evaluate(() => {
      window.scrollTo(0, 9999);
    });
    await iFrame.waitFor(1000);
    await iFrame.click("#unified-consent-continue-button");
    await iFrame.waitFor(1000);
    await iFrame.evaluate(() => {
      window.scrollTo(0, 9999);
    });
    await iFrame.waitFor(1000);
    await iFrame.click("#unified-consent-continue-button");
  } catch (error) {
    console.log(error);
    console.log("There is no A quick note about your Microsoft account")
  }

};
module.exports = action;
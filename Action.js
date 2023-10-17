
const action = async (page_tmp, page, record) => {
  const [mail, pass] = record;
  await page.bringToFront();

  await page.goto('https://login.microsoftonline.com/common/oauth2/authorize?client_id=00000002-0000-0ff1-ce00-000000000000&redirect_uri=https%3a%2f%2foutlook.office.com%2fowa%2f&resource=00000002-0000-0ff1-ce00-000000000000&response_mode=form_post&response_type=code+id_token&scope=openid&nonce=638239726213898366.815fc981-5d7f-4368-abaa-6162e0d925e7&msaredir=1&client-request-id=d652ad0e-e8fd-cd76-dc71-935a7433d932&protectedtoken=true&claims=%7b%22id_token%22%3a%7b%22xms_cc%22%3a%7b%22values%22%3a%5b%22CP1%22%5d%7d%7d%7d&prompt=select_account&state=DYu7DoIwAABB_4UN6UNKOxAHE8OAxoAGZCF9kUhASKkY_t4Od9Od73ne3rFz-MDJSwimCLMEEQQxZRQTcqAw7iSjMIxV0oVHTGjIBechgQRpoBiKdeK7d42mH49Os5nG2aaLHrS0LZdy-n5swKUtfza15quDxXKrUxgYrd7GRY8p5VkBZHYl-cZWVReLQMzkIxubceibMu4FAquoLrM40_ZV3cATK3Cvi01Vzz8', { timeout: 30000 });

  await page.waitForSelector('input[type="email"]');

  await page.waitFor(2000);

  await page.type('input[type="email"]', mail, { delay: 30 });

  await page.waitFor(2000);

  await page.click('input[type="submit"]');

  await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

  await page.waitForSelector('input[type="password"]');

  await page.waitFor(2000);

  await page.type('input[type="password"]', pass, { delay: 30 });

  await page.waitFor(2000);

  await page.click('input[type="submit"]');

  let url_redirected = false;

  page.on('response', response => {
    const status = response.status()
    //[301, 302, 303, 307, 308]
    if ((status >= 300) && (status <= 399)) {
      url_redirected = true;
    }
  });

  await page.waitFor(2000);

  if (url_redirected) {
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
  }

  let isConfirm = false;
  let isDone = false;

  console.log("url_redirected");
  console.log(url_redirected);

  if (url_redirected) {
    for (let index = 0; index < 10; index++) {
      if (await page.$('.confirmIdentity')) isConfirm = true;
      if (await page.$('#KmsiDescription')) {
        await page.click('#idBtn_Back');
        isDone = true;
      }
      if (isConfirm || isDone) break;
      await page.waitFor(3000);
    }
  } else {
    url_redirected = false;
    let count = 0;
    for (let index = 0; index < 10; index++) {
      await page.waitFor(3000);
      if (await page.$('.confirmIdentity')) {
        isConfirm = true;
        break;
      }
      if (await page.$('#KmsiDescription')) {
        await page.click('#idBtn_Back');
        if (url_redirected) {
          await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        }
        await page.waitFor(2000);
        isDone = true;
        break;
      }
      if (await page.$('#idBtn_Back')) {
        await page.click('#idBtn_Back');
        if (url_redirected) {
          await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        }
        await page.waitFor(2000);
        isDone = true;
        break;
      }
      if (await page.$('#iNext')) {
        await page.click('#iNext');
        if (url_redirected) {
          await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        }
        await page.waitFor(2000);
        isDone = true;
        break;
      }
      if (await page.$('#iLooksGood')) {
        await page.click('#iLooksGood');
        if (url_redirected) {
          await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        }
        await page.waitFor(2000);
        isDone = true;
        break;
      }
      if (await page.$('#StickyFooter button span')) {
        await page.click('#StickyFooter button span');
        if (count > 0) {
          await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
          await page.waitFor(2000);
          isDone = true;
          break;
        }
        count++;
      }
    }
    await page.waitFor(2000);
  }

  if (isConfirm) {
    await page.waitForSelector('.confirmIdentity');

    await page.waitFor(2000);

    await page_tmp.bringToFront();

    await page_tmp.goto('https://www.microsoft.com/vi-vn/microsoft-365?rtc=1', { timeout: 30000 });

    await page_tmp.waitForSelector('#mectrl_headerPicture');

    await page_tmp.waitFor(2000);

    await page_tmp.click('#mectrl_headerPicture');

    await page_tmp.waitForNavigation({ waitUntil: 'domcontentloaded' });

    for (let index = 0; index < 10; index++) {
      if (await page_tmp.$('#idBtn_Back')) {
        await page_tmp.click('#idBtn_Back');
        await page_tmp.waitForNavigation({ waitUntil: 'domcontentloaded' });
        break;
      }
      if (await page_tmp.$('#iNext')) {
        await page_tmp.click('#iNext');
        await page_tmp.waitForNavigation({ waitUntil: 'domcontentloaded' });
        break;
      }
      await page_tmp.waitFor(3000);
    }

    let url_redirected_tmp = false;

    page_tmp.on('response', response => {
      const status = response.status()
      //[301, 302, 303, 307, 308]
      if ((status >= 300) && (status <= 399)) {
        url_redirected_tmp = true;
      }
    });

    if (url_redirected_tmp) {
      await page_tmp.waitForNavigation({ waitUntil: 'domcontentloaded' });
    }

    await page_tmp.waitFor(2000);

    for (let index = 0; index < 10; index++) {
      if (await page_tmp.$('#searchBoxColumnContainerId input[id="topSearchInput"]')) break;
      if (await page_tmp.$('#iLooksGood')) {
        await page_tmp.click('#iLooksGood');
        await page_tmp.waitForNavigation({ waitUntil: 'domcontentloaded' });
        break;
      }
      if (await page_tmp.$('#idBtn_Back')) {
        await page_tmp.click('#idBtn_Back');
        await page_tmp.waitForNavigation({ waitUntil: 'domcontentloaded' });
        break;
      }
      if (await page_tmp.$('#iNext')) {
        await page_tmp.click('#iNext');
        await page_tmp.waitForNavigation({ waitUntil: 'domcontentloaded' });
        break;
      }
      await page_tmp.waitFor(3000);
    }

    for (let index = 0; index < 10; index++) {
      if (await page_tmp.$('#searchBoxColumnContainerId input[id="topSearchInput"]')) break;
      if (await page_tmp.$('#StickyFooter button span')) {
        await page_tmp.click('#StickyFooter button span');
        await page_tmp.waitForNavigation({ waitUntil: 'domcontentloaded' });
        break;
      }
      if (await page_tmp.$('#idBtn_Back')) {
        await page_tmp.click('#idBtn_Back');
        await page_tmp.waitForNavigation({ waitUntil: 'domcontentloaded' });
        break;
      }
      if (await page_tmp.$('#iNext')) {
        await page_tmp.click('#iNext');
        await page_tmp.waitForNavigation({ waitUntil: 'domcontentloaded' });
        break;
      }
      await page_tmp.waitFor(3000);
    }

    await page_tmp.waitForSelector('#searchBoxColumnContainerId input[id="topSearchInput"]');

    await page_tmp.waitFor(8000);

    await page_tmp.type('#searchBoxColumnContainerId input[id="topSearchInput"]', "Facebook Ads Team", { delay: 30 });

    await page_tmp.waitFor(2000);

    await page_tmp.keyboard.press('Enter')

    for (let index = 0; index < 10; index++) {
      if (await page_tmp.$('.ckaDq #EmptyState_MainMessage')) return Promise.resolve('fail')
      const facebook = await page_tmp.$('span[title="advertise-noreply@support.facebook.com"]');
      if (facebook) return Promise.resolve('done');
      await page_tmp.waitFor(1000);
    }
  } else if (isDone) {

    for (let index = 0; index < 10; index++) {
      if (await page.$('#searchBoxColumnContainerId input[id="topSearchInput"]')) break;
      if (await page.$('#iLooksGood')) {
        await page.click('#iLooksGood');
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        break;
      }
      if (await page.$('#idBtn_Back')) {
        await page.click('#idBtn_Back');
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        break;
      }
      if (await page.$('#iNext')) {
        await page.click('#iNext');
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        break;
      }
      await page.waitFor(3000);
    }

    for (let index = 0; index < 10; index++) {
      if (await page.$('#searchBoxColumnContainerId input[id="topSearchInput"]')) break;
      if (await page.$('#StickyFooter button span')) {
        await page.click('#StickyFooter button span');
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        break;
      }
      if (await page.$('#idBtn_Back')) {
        await page.click('#idBtn_Back');
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        break;
      }
      if (await page.$('#iNext')) {
        await page.click('#iNext');
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        break;
      }
      await page.waitFor(3000);
    }

    for (let index = 0; index < 10; index++) {
      if (await page.$('#searchBoxColumnContainerId input[id="topSearchInput"]')) break;
      if (await page.$('#idBtn_Back')) {
        await page.click('#idBtn_Back');
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        break;
      }
      if (await page.$('#iNext')) {
        await page.click('#iNext');
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        break;
      }
      await page.waitFor(3000);
    }

    await page.waitForSelector('#searchBoxColumnContainerId input[id="topSearchInput"]');

    await page.waitFor(8000);

    await page.type('#searchBoxColumnContainerId input[id="topSearchInput"]', "Facebook Ads Team", { delay: 30 });

    await page.waitFor(2000);

    await page.keyboard.press('Enter')

    for (let index = 0; index < 10; index++) {
      if (await page.$('.ckaDq #EmptyState_MainMessage')) return Promise.resolve('fail')
      const facebook = await page.$('span[title="advertise-noreply@support.facebook.com"]');
      if (facebook) return Promise.resolve('done');
      await page.waitFor(1000);
    }
  }

  return Promise.resolve('fail')

};
module.exports = action;
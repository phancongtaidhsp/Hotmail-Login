
const action = async (page_tmp, page, record) => {
  const [mail, pass] = record;
  await page.bringToFront();

  await page.goto('https://login.microsoftonline.com/common/oauth2/authorize?client_id=00000002-0000-0ff1-ce00-000000000000&redirect_uri=https%3a%2f%2foutlook.office.com%2fowa%2f&resource=00000002-0000-0ff1-ce00-000000000000&response_mode=form_post&response_type=code+id_token&scope=openid&nonce=638239726213898366.815fc981-5d7f-4368-abaa-6162e0d925e7&msaredir=1&client-request-id=d652ad0e-e8fd-cd76-dc71-935a7433d932&protectedtoken=true&claims=%7b%22id_token%22%3a%7b%22xms_cc%22%3a%7b%22values%22%3a%5b%22CP1%22%5d%7d%7d%7d&prompt=select_account&state=DYu7DoIwAABB_4UN6UNKOxAHE8OAxoAGZCF9kUhASKkY_t4Od9Od73ne3rFz-MDJSwimCLMEEQQxZRQTcqAw7iSjMIxV0oVHTGjIBechgQRpoBiKdeK7d42mH49Os5nG2aaLHrS0LZdy-n5swKUtfza15quDxXKrUxgYrd7GRY8p5VkBZHYl-cZWVReLQMzkIxubceibMu4FAquoLrM40_ZV3cATK3Cvi01Vzz8', { timeout: 30000 });

  await page.waitForSelector('input[type="email"]');

  await page.waitFor(2000);

  await page.type('input[type="email"]', mail, { delay: 30 });

  await page.waitFor(2000);

  await Promise.allSettled([
    page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
    page.click('input[type="submit"]')
  ])

  for (let index = 0; index < 10; index++) {
    if (await page.$('input[type="password"]')) {
      break;
    }
    if (await page.$('#usernameError')) {
      return Promise.resolve('fail');
    }
    if (await page.$('#proofConfirmationText') && !await page.$('.confirmIdentity')) {
      return Promise.resolve('fail');
    }
    if (await page.$('#iPollSessionProgress .c_dotsPlaying')) {
      return Promise.resolve('fail');
    }
    if (await page.$('#error_Info')) {
      return Promise.resolve('fail');
    }
    await page.waitFor(3000);
  }

  await page.waitForSelector('input[type="password"]');

  await page.waitFor(2000);

  await page.type('input[type="password"]', pass, { delay: 30 });

  await page.waitFor(2000);

  await Promise.allSettled([
    page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
    page.click('input[type="submit"]')
  ])


  await page.waitFor(2000);

  let isConfirm = false;
  let isDone = false;
  let count = 0;

  for (let index = 0; index < 10; index++) {
    try {
      if (await page.$('.confirmIdentity')) {
        isConfirm = true;
        break;
      }
      if (await page.$('#passwordError')) {
        return Promise.resolve('fail');
      }
      if (await page.$('#proofConfirmationText') && !await page.$('.confirmIdentity')) {
        return Promise.resolve('fail');
      }
      if (await page.$('#iPollSessionProgress .c_dotsPlaying')) {
        return Promise.resolve('fail');
      }
      if (await page.$('#error_Info')) {
        return Promise.resolve('fail');
      }
      if (await page.$('#idTD_Error')) {
        return Promise.resolve('fail');
      }
      if (await page.$('#iProofList') && !await page.$('.confirmIdentity')) {
        return Promise.resolve('fail');
      }
      if (await page.$('#KmsiDescription')) {
        await Promise.allSettled([
          page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
          page.click('#idBtn_Back')
        ])
        await page.waitFor(2000);
        isDone = true;
        break;
      }
      if (await page.$('#idBtn_Back')) {
        await Promise.allSettled([
          page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
          page.click('#idBtn_Back')
        ])
        await page.waitFor(2000);
        isDone = true;
        break;
      }
      if (await page.$('#iShowSkip')) {
        await Promise.allSettled([
          page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
          page.click('#iShowSkip')
        ])
        await page.waitFor(2000);
        isDone = true;
        break;
      }
      if (await page.$('#iNext')) {
        await Promise.allSettled([
          page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
          page.click('#iNext')
        ])
        await page.waitFor(2000);
        isDone = true;
        break;
      }
      if (await page.$('#iLandingViewAction')) {
        await Promise.allSettled([
          page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
          page.click('#iLandingViewAction')
        ])
        await page.waitFor(2000);
        isDone = true;
        break;
      }
      if (await page.$('#iLooksGood')) {
        await Promise.allSettled([
          page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
          page.click('#iLooksGood')
        ])
        await page.waitFor(2000);
        isDone = true;
        break;
      }
      if (await page.$('#StickyFooter button span')) {
        await Promise.allSettled([
          page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
          page.click('#StickyFooter button span')
        ])
        if (count > 0) {
          await page.waitFor(2000);
          isDone = true;
          break;
        }
        count++;
      }
      if (await page.$('#searchBoxColumnContainerId input[id="topSearchInput"]')) {
        break;
      }
      if (await page.$('#topLevelRegion')) break;
      await page.waitFor(2000);
    } catch (error) {
      console.log(error);
    }
  }

  if (isConfirm) {

    await page.waitFor(2000);

    await page_tmp.bringToFront();

    try {
      await page_tmp.goto('https://www.microsoft.com/vi-vn/microsoft-365?rtc=1', { timeout: 30000 });

      await page_tmp.waitForSelector('#mectrl_headerPicture');

      await page_tmp.waitFor(2000);

      await page_tmp.click('#mectrl_headerPicture');

      await page_tmp.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 });

      await page_tmp.waitFor(5000);
    } catch (error) {
      console.log(error);
    }

    for (let index = 0; index < 10; index++) {
      try {
        if (await page_tmp.$('#topLevelRegion')) break;
        if (await page_tmp.$('#searchBoxColumnContainerId input[id="topSearchInput"]')) break;
        if (await page_tmp.$('#idTD_Error')) {
          return Promise.resolve('fail');
        }
        if (await page_tmp.$('#error_Info')) {
          return Promise.resolve('fail');
        }
        if (await page_tmp.$('#iProofList') && !await page_tmp.$('.confirmIdentity')) {
          return Promise.resolve('fail');
        }
        if (await page_tmp.$('#proofConfirmationText') && !await page_tmp.$('.confirmIdentity')) {
          return Promise.resolve('fail');
        }
        if (await page_tmp.$('#iPollSessionProgress .c_dotsPlaying')) {
          return Promise.resolve('fail');
        }
        if (await page_tmp.$('#iShowSkip')) {
          await Promise.allSettled([
            page_tmp.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
            page_tmp.click('#iShowSkip')
          ])
        }
        if (await page_tmp.$('#iLooksGood')) {
          await Promise.allSettled([
            page_tmp.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
            page_tmp.click('#iLooksGood')
          ])
        }
        if (await page_tmp.$('#iLandingViewAction')) {
          await Promise.allSettled([
            page_tmp.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
            page_tmp.click('#iLandingViewAction')
          ])
        }
        if (await page_tmp.$('#StickyFooter button span')) {
          await Promise.allSettled([
            page_tmp.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
            page_tmp.click('#StickyFooter button span')
          ])
        }
        if (await page_tmp.$('#idBtn_Back')) {
          await Promise.allSettled([
            page_tmp.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
            page_tmp.click('#idBtn_Back')
          ])
        }
        if (await page_tmp.$('#iNext')) {
          await Promise.allSettled([
            page_tmp.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
            page_tmp.click('#iNext')
          ])
        }
        await page_tmp.waitFor(3000);
      } catch (error) {
        console.log(error);
      }
    }

    if (!await page_tmp.$('#searchBoxColumnContainerId input[id="topSearchInput"]')) {
      await page_tmp.goto('https://outlook.live.com/mail/0/', { timeout: 30000 });
    }

    await page_tmp.waitForSelector('#searchBoxColumnContainerId input[id="topSearchInput"]');

    await page_tmp.waitFor(8000);

    if (await page_tmp.$('.ms-Modal-scrollableContent .ms-Dialog-actions .ms-Button--primary')) {
      await page_tmp.click('.ms-Modal-scrollableContent .ms-Dialog-actions .ms-Button--primary')
      await page_tmp.waitFor(2000);
    }

    if (await page_tmp.$('.ms-Modal-scrollableContent .pRd6S .ms-Button--primary')) {
      await page_tmp.click('.ms-Modal-scrollableContent .pRd6S .ms-Button--primary')
      await page_tmp.waitFor(2000);
    }

    await page_tmp.type('#searchBoxColumnContainerId input[id="topSearchInput"]', "Facebook Ads Team", { delay: 30 });

    await page_tmp.waitFor(2000);

    await page_tmp.keyboard.press('Enter')

    await page_tmp.waitFor(5000);

    for (let index = 0; index < 10; index++) {
      let valueInput = await page_tmp.evaluate(() => {
        return Promise.resolve(document.querySelector('#searchBoxColumnContainerId input[id="topSearchInput"]')?.value);
      });
      if(valueInput == "Facebook Ads Team") {
        const facebook = await page_tmp.$('span[title="advertise-noreply@support.facebook.com"]');
        if (facebook) {
          return Promise.resolve('done');
        } else if (await page_tmp.$('.ckaDq #EmptyState_MainMessage')) return Promise.resolve('fail');
      }
      await page_tmp.waitFor(1000);
    }
    return Promise.resolve('fail');
  } else if (isDone) {
    for (let index = 0; index < 10; index++) {
      try {
        if (await page.$('#topLevelRegion')) break;
        if (await page.$('#searchBoxColumnContainerId input[id="topSearchInput"]')) break;
        if (await page.$('#idTD_Error')) {
          return Promise.resolve('fail');
        }
        if (await page_tmp.$('#error_Info')) {
          return Promise.resolve('fail');
        }
        if (await page.$('#proofConfirmationText') && !await page.$('.confirmIdentity')) {
          return Promise.resolve('fail');
        }
        if (await page.$('#iPollSessionProgress .c_dotsPlaying')) {
          return Promise.resolve('fail');
        }
        if (await page.$('#iProofList') && !await page.$('.confirmIdentity')) {
          return Promise.resolve('fail');
        }
        if (await page.$('#iLooksGood')) {
          await Promise.allSettled([
            page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
            page.click('#iLooksGood')
          ])
        }
        if (await page.$('#iShowSkip')) {
          await Promise.allSettled([
            page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
            page.click('#iShowSkip')
          ])
        }
        if (await page.$('#StickyFooter button span')) {
          await Promise.allSettled([
            page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
            page.click('#StickyFooter button span')
          ])
        }
        if (await page.$('#iLandingViewAction')) {
          await Promise.allSettled([
            page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
            page.click('#iLandingViewAction')
          ])
        }
        if (await page.$('#idBtn_Back')) {
          await Promise.allSettled([
            page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
            page.click('#idBtn_Back')
          ])
        }
        if (await page.$('#iNext')) {
          await Promise.allSettled([
            page.waitForNavigation({ waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 10000 }),
            page.click('#iNext')
          ])
        }
        await page.waitFor(3000);
      } catch (error) {
        console.log(error);
      }
    }

    await page.waitFor(2000);

    if (!await page.$('#searchBoxColumnContainerId input[id="topSearchInput"]')) {
      await page.goto('https://outlook.live.com/mail/0/', { timeout: 30000 });
    }

    await page.waitForSelector('#searchBoxColumnContainerId input[id="topSearchInput"]');

    await page.waitFor(8000);

    if (await page.$('.ms-Modal-scrollableContent .ms-Dialog-actions .ms-Button--primary')) {
      await page.click('.ms-Modal-scrollableContent .ms-Dialog-actions .ms-Button--primary')
      await page.waitFor(2000);
    }

    if (await page.$('.ms-Modal-scrollableContent .pRd6S .ms-Button--primary')) {
      await page.click('.ms-Modal-scrollableContent .pRd6S .ms-Button--primary')
      await page.waitFor(2000);
    }

    await page.type('#searchBoxColumnContainerId input[id="topSearchInput"]', "Facebook Ads Team", { delay: 30 });

    await page.waitFor(2000);

    await page.keyboard.press('Enter')

    await page.waitFor(5000);

    for (let index = 0; index < 10; index++) {
      let valueInput = await page.evaluate(() => {
        return Promise.resolve(document.querySelector('#searchBoxColumnContainerId input[id="topSearchInput"]')?.value);
      });
      if(valueInput == "Facebook Ads Team") {
        const facebook = await page.$('span[title="advertise-noreply@support.facebook.com"]');
        if (facebook) {
          return Promise.resolve('done');
        }
        else if (await page.$('.ckaDq #EmptyState_MainMessage')) return Promise.resolve('fail');
      }
      await page.waitFor(1000);
    }
    return Promise.resolve('fail')
  }

  return Promise.resolve('restore')

};
module.exports = action;
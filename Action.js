
const action = async (pageApple, record) => {
  const [mail] = record;
  // qua trang apple
  try {
    await pageApple.bringToFront();
    await pageApple.goto('https://iforgot.apple.com/password/verify/appleid', { timeout: 30000 });
    await pageApple.waitForSelector('input.generic-input-field');
    await pageApple.waitFor(1000);
    await pageApple.type('input.generic-input-field', mail, { delay: 30 });
    await pageApple.waitFor(99999999);
  } catch (error) {
    console.log(error);
  }
};
module.exports = action;
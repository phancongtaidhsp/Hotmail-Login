const axios = require('axios');

const getCode = async (mail, pass) => {
  let res = await axios({
    url: `https://tools.dongvanfb.com/api/get_messages?mail=${mail}&pass=${pass}`,
    method: 'get',
  })
  if (res?.data) {
    const { messages } = res?.data;
    if(messages[0]?.message) {
      let regex = /https:\/\/iforgot.apple.com\/verify\/email\?(\d|\w|=|-)+/
      let urls = regex.exec(messages[0]?.message)
      if(urls[0]) {
        return urls[0]
      }
    }
  }
  return null;
}

module.exports = getCode;
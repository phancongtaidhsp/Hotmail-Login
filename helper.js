
const axios = require('axios');
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false
});

const fetchCode = async (url) => {
  let res = await axios({
    url: url,
    method: 'get',
    httpsAgent: agent
  })
  if (res?.data?.data) {
    let matches = res.data.data.code.match(/\d+/);
    if(matches?.[0]) {
      return matches[0];
    }
  }
  return "";
}

module.exports = fetchCode;
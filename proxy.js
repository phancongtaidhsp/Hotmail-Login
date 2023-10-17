const axios = require('axios');
const moment = require('moment');
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false
});

const checkKeyProxy = async (key) => {
  let res = await axios({
    url: `http://proxy.tinsoftsv.com/api/getKeyInfo.php?key=${key}`,
    method: 'get',
    httpsAgent: agent
  })
  if (res?.data) {
    if(res.data?.success) {
      return true
    }
  }
  return false
}

const checkCurrentIp = async (key) => {
  let res = await axios({
    url: `http://proxy.tinsoftsv.com/api/getProxy.php?key=${key}`,
    method: 'get',
    httpsAgent: agent
  })
  if (res?.data) {
    if(res.data?.success) {
      return res.data
    }
  }
  return false
}

const checkCurrentIpTmp = async (key) => {
  let res = await axios({
    url: `https://tmproxy.com/api/proxy/get-current-proxy`,
    method: 'post',
    data: {
      api_key: key
    },
    httpsAgent: agent
  }, )
  if (res.data?.data) {
    return {
      ...res.data?.data,
      proxy: res.data?.data?.https
    }
  }
  return false
}

const getNewIp = async (key) => {
  let checkIp = await checkCurrentIp(key);
  if(checkIp?.next_change <= 0 || !checkIp?.success){
    let res = await axios({
      url: `http://proxy.tinsoftsv.com/api/changeProxy.php?key=${key}&location=1`,
      method: 'get',
      httpsAgent: agent
    })
    if (res.data) {
      if(res.data?.success && res.data?.timeout > 200) {
        return res.data
      }
    }
  }
  return checkIp
}

const getNewIpTmp = async (key) => {
  let checkIp = await checkCurrentIpTmp(key);
  if(checkIp?.next_request <= 0){
    let res = await axios({
      url: `https://tmproxy.com/api/proxy/get-new-proxy`,
      method: 'post',
      data: {
        api_key: key,
        location: 1
      },
      httpsAgent: agent
    })
    if (res.data?.data) {
      return {
        ...res.data?.data,
        proxy: res.data?.data?.https
      }
    }
  }
  return checkIp
}

const checkKeyProxyTmp = async (key) => {
  let res = await axios({
    url: `https://tmproxy.com/api/proxy/stats`,
    method: 'post',
    data: {
      api_key: key,
    },
    httpsAgent: agent
  })
  if (res.data?.data?.expired_at) {
    return new Date().getTime() < moment(res.data?.data?.expired_at, "hh:mm:ss DD/MM/YYYY").toDate().getTime()
  }
  return false
}

module.exports = {
  checkKeyProxy,
  checkCurrentIp,
  getNewIp,
  checkCurrentIpTmp,
  getNewIpTmp,
  checkKeyProxyTmp
};

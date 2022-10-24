const axios = require('axios');

const checkKeyProxy = async (key) => {
  let res = await axios({
    url: `http://proxy.tinsoftsv.com/api/getKeyInfo.php?key=${key}`,
    method: 'get',
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
  })
  if (res?.data) {
    if(res.data?.success) {
      return res.data
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
    })
    if (res.data) {
      if(res.data?.success && res.data?.timeout > 200) {
        return res.data
      }
    }
  }
  return checkIp
}


module.exports = {
  checkKeyProxy,
  checkCurrentIp,
  getNewIp
};
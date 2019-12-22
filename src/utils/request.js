import Taro from '@tarojs/taro'
import { API_USER_SEESION, API_REFRESH_TOKEN, API_USER_LOGIN, API_CODE, API_MOBILE_LOGIN } from '@constants/api'


const noNeedLoginURLs = [
  API_USER_LOGIN,
  API_USER_SEESION,
  API_CODE,
  API_MOBILE_LOGIN
]

export async function fetchApi(options) {
  return new Promise((resolve, reject) => {
    const token = Taro.$globalData.token
    if (token) {
      return directRequest(options).then(resolve).catch(reject)
    } else if (noNeedLoginURLs.indexOf(options.url) >= 0) {
      return directRequest(options).then(resolve).catch(reject)
    } else {
      return getToken().then(() => {
        return directRequest(options).then(resolve).catch(reject)
      })
    }
  })
}

export async function directRequest(options) {
  const { url, payload, method = 'GET', showToast = true, autoLogin = true } = options
  let header = {}
  if (method === 'POST') {
    header['Content-Type'] = 'application/json'
  } else {
    header['Content-Type'] = 'application/x-www-form-urlencoded'
  }
  if (noNeedLoginURLs.indexOf(options.url) < 0) {
    header.token = Taro.$globalData.token ? Taro.$globalData.token : ''
  }
  return new Promise((resolve, reject) => {
    Taro.request({
      url,
      method,
      data: payload,
      header: {
        ...header
      },
    }).then(async (res) => {
      const { data } = res.data
      if (res.statusCode == 200) {
        if (!res.data.status) {
          if (showToast) {
            Taro.showModal({
              title: '提示',
              content: res.data.message
            })
          }
          reject(res)
        } else {
          resolve(data)
        }
      } else if (res.statusCode == 500) {
        Taro.showToast({
          title: '请求异常',
          icon: 'none',
          duration: 1000
        })
        // setTimeout(() => {
        //   Taro.navigateBack()
        // }, 1000)
        reject(res)
      } else if (res.statusCode == 403 || res.statusCode == 404) {
        Taro.showToast({
          title: '请求异常',
          icon: 'none',
          duration: 1000
        })
        setTimeout(() => {
          Taro.reLaunch({
            url: '/pages/home/home'
          })
        }, 1000)
        reject(res)
      } else if (res.statusCode == 401) {
        Taro.showModal({
          title: '提示',
          content: res.data.message
        })
        reject(res)
      }
  
      resolve(data)
    }).catch((err) => {
      console.log(err)
      // const defaultMsg = err.code && err.code === 'CODE_AUTH_EXPIRED' ? '登录失效' : '请求异常'
      if (showToast) {
        Taro.showToast({
          title: err && err.message,
          icon: 'none'
        })
      }
  
      // if (err.code && err.code === 'CODE_AUTH_EXPIRED' && autoLogin) {
      //   Taro.navigateTo({
      //     url: '/pages/user-login/user-login'
      //   })
      // }
  
      reject(err)
    })
  })
}
export async function getToken() {
  return new Promise(resolve => {
    const loginInfo = Taro.getStorageSync('loginInfo')

    if (loginInfo && Date.parse(new Date()) < loginInfo.expire_time) {
      Taro.$globalData.token = loginInfo.token
      resolve()
    } else if (loginInfo && loginInfo.token) {
      const token = JSON.parse(JSON.stringify(loginInfo)).token
      loginInfo && Taro.removeStorageSync('loginInfo')
      // resolve()
      refreshToken(token).then(resolve)
    } else {
      resolve()
    }
  })
}

export function refreshToken(token) {
  let loginPromise
  loginPromise = new Promise(function (resolve, reject) {
    console.log(token, 1111111)
    let refreshToken = {
      url: API_REFRESH_TOKEN,
      payload: {
        token
      },
      method: 'POST',
      showToast: false,
      autoLogin: false
    }
    directRequest(refreshToken).then(res => {
      console.log(res)
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
  return loginPromise
}

export function login() {
  return new Promise(resolve => {
    Taro.login().then(resLogin => {
      let loginpParams = {
        url: API_USER_SEESION,
        payload: {code: resLogin.code},
        method: 'POST',
        showToast: false,
        autoLogin: false
      }
      directRequest(loginpParams).then(res => {
        Taro.$globalData.openid = res.openId
        resolve()
      })
    })
  })
}

export function getUserToken(detail) {
  const item = () => {
    directRequest({
      url: API_USER_LOGIN,
      payload: {
        ...detail,
        openId: Taro.$globalData.openid
      },
      method: 'POST',
      autoLogin: false
    }).then(token => {
      Taro.setStorageSync('loginInfo', {
        'token': token,
        'expire_time': Date.parse(new Date()) + 29 * 24 * 60 * 60 * 1000,
      })
      Taro.$globalData.token = token
    })
  }
  if (Taro.$globalData.openid) {
    item()
  } else {
    login().then(() => {
      item()
    })
  }
}

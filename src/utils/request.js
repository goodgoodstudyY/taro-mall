import Taro from '@tarojs/taro'
import { API_USER_SEESION, API_REFRESH_TOKEN, API_USER_LOGIN } from '@constants/api'


const noNeedLoginURLs = [
  API_USER_LOGIN,
  API_USER_SEESION
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
  let header = ''
  if (method === 'POST') {
    header = 'application/json'
  }
  return Taro.request({
    url,
    method,
    data: payload,
    header: {
      'Content-Type': header || 'application/x-www-form-urlencoded',
      'token': Taro.$globalData.token ? Taro.$globalData.token : ''
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
        return Promise.reject(res)
      } else {
        return data
      }
    } else if (res.statusCode == 500) {
      Taro.showToast({
        title: '请求异常',
        icon: 'none',
        duration: 1000
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1000)
      return Promise.reject(res)
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
      return Promise.reject(res)
    }

    return data
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

    // return Promise.reject({ message: defaultMsg, ...err })
  })
}
export async function getToken() {
  return new Promise(resolve => {
    const loginInfo = Taro.getStorageSync('loginInfo')

    if (loginInfo && Date.parse(new Date()) < loginInfo.expire_time) {
      Taro.$globalData.token = loginInfo.token
      resolve()
    } else if (loginInfo && loginInfo.token) {
      Taro.$globalData.token = loginInfo.token
      loginInfo && Taro.removeStorageSync('loginInfo')
      // resolve()
      refreshToken().then(resolve)
    } else {
      resolve()
    }
  })
}

export function refreshToken() {
  let loginPromise
  loginPromise = new Promise(function (resolve, reject) {
    let refreshToken = {
      url: API_REFRESH_TOKEN,
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

export function login(detail) {
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
        console.log(res)
        Taro.$globalData.openid = res.openId
        directRequest({
          url: API_USER_LOGIN,
          payload: {
            ...detail,
            openId: res.openId
          },
          method: 'POST',
          autoLogin: false
        }).then(token => {
          Taro.setStorageSync('loginInfo', {
            'token': token,
            'expire_time': Date.parse(new Date()) + 29 * 24 * 60 * 60 * 1000,
          })
          Taro.$globalData.token = token
          console.log(token)
          resolve()
        })
      })
      // directRequest({
      //   url: API_USER_LOGIN,
      //   payload: {

      //   }
      // })
      // Taro.setStorageSync('loginInfo', {
      //   'sessionKey': res.sessionKey,
      //   'expire_time': Date.parse(new Date()) + 4.5 * 24 * 60 * 60 * 1000,
      // })
    })
  })
}

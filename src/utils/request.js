import Taro from '@tarojs/taro'
import { API_USER_SEESION } from '@constants/api'


const noNeedLoginURLs = [
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
  // if (Taro.$globalData.token) {
  //   Object.assign(
  //     payload || {},
  //     {
  //       token: Taro.$globalData.token
  //     }
  //   )
  // }
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
      return data
    } else if (res.statusCode == 500) {
      Taro.showToast({
        title: '请求异常',
        icon: 'none',
        duration: 1000
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1000)
      return Promise.reject()
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
      return Promise.reject()
    }

    return data
  }).catch((err) => {
    const defaultMsg = err.code && err.code === 'CODE_AUTH_EXPIRED' ? '登录失效' : '请求异常'
    if (showToast) {
      Taro.showToast({
        title: err && err.errorMsg || defaultMsg,
        icon: 'none'
      })
    }

    if (err.code && err.code === 'CODE_AUTH_EXPIRED' && autoLogin) {
      Taro.navigateTo({
        url: '/pages/user-login/user-login'
      })
    }

    return Promise.reject({ message: defaultMsg, ...err })
  })
}
export async function getToken() {
  return new Promise(resolve => {
    const loginInfo = Taro.getStorageSync('loginInfo')

    if (loginInfo && Date.parse(new Date()) < loginInfo.expire_time) {
      // store.dispatch({
      //   type: 'USER_LOGIN',
      //   payload: {
      //     loginInfo: {
      //       token: loginInfo.token,
      //     }
      //   }
      // })
      Taro.$globalData.token = loginInfo.token
      Taro.$globalData.sessionKey = loginInfo.sessionKey
      resolve()
    } else if (loginInfo && loginInfo.sessionKey) {
      Taro.checkSession({
        success: () => {
          Taro.$globalData.sessionKey = loginInfo.sessionKey
          resolve()
        },
        fail: () => {
          Taro.removeStorageSync('loginInfo')
          login().then(resolve)
        }
      })
    } else {
      loginInfo && Taro.removeStorageSync('loginInfo')
      login().then(resolve)
    }
  })
}

export function login() {
  let loginPromise
  loginPromise = new Promise(function (resolve, reject) {
      Taro.login().then(resLogin => {
        let loginpParams = {
          url: API_USER_SEESION,
          payload: {code: resLogin.code},
          method: 'POST',
          showToast: false,
          autoLogin: false
        }
        directRequest(loginpParams).then(res => {
          // Taro.setStorageSync('loginInfo', {
          //   'sessionKey': res.sessionKey,
          //   'expire_time': Date.parse(new Date()) + 4.5 * 24 * 60 * 60 * 1000,
          // })
          Taro.$globalData.sessionKey = res.sessionKey

          resolve(res)
        }).catch(err => {
          reject(err)
        })
      }).catch(err => {
        Taro.hideLoading()
        Taro.showToast({
          title: '登录失败',
          icon: 'none'
        })
        reject(err)
      })
    })
  return loginPromise
}

import Taro from '@tarojs/taro'
import { API_USER, API_USER_LOGIN } from '@constants/api'

function getStorage(key) {
  return Taro.getStorage({ key }).then(res => res.data).catch(() => '')
}

function updateStorage(data = {}) {
  return Promise.all([
    Taro.setStorage({ key: 'token', data: data['3rdSession'] || '' }),
    Taro.setStorage({ key: 'uid', data: data['uid'] || ''})
  ])
}

/**
 * 简易封装网络请求
 * // NOTE 需要注意 RN 不支持 *StorageSync，此处用 async/await 解决
 * @param {*} options
 */
export default async function fetch(options) {
  const { url, payload, method = 'GET', showToast = true, autoLogin = true } = options
  const token = await getStorage('token')
  const header = token ? { 'WX-PIN-SESSION': token, 'X-WX-3RD-Session': token } : {}
  if (method === 'POST') {
    header['content-type'] = 'application/json'
  }

  return Taro.request({
    url,
    method,
    data: payload,
    header
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

    if (url === API_USER_LOGIN) {
      await updateStorage(data)
    }

    // XXX 用户信息需展示 uid，但是 uid 是登录接口就返回的，比较蛋疼，暂时糅合在 fetch 中解决
    if (url === API_USER) {
      const uid = await getStorage('uid')
      return { ...data, uid }
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

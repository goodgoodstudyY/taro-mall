import { USER_INFO, USER_SESSION, USER_LOGOUT, USER_LOGIN } from '@constants/user'
import { API_USER, API_USER_LOGIN } from '@constants/api'
import { createAction } from '@utils/redux'

/**
 * 获取用户信息
 * @param {*} payload
 */
export const dispatchUser = payload => createAction({
  url: API_USER,
  fetchOptions: {
    showToast: false,
    autoLogin: false
  },
  type: USER_INFO,
  payload
})

/**
 * 用户登录
 * @param {*} payload
 */
export const dispatchLogin = payload => createAction({
  url: API_USER_LOGIN,
  fetchOptions: {
    showToast: false,
    autoLogin: false
  },
  method: 'POST',
  type: USER_LOGIN,
  payload
})

export const dispatchSession = () => ({type: USER_SESSION})
/**
 * 用户退出登录
 */
export const dispatchLogout = () => ({ type: USER_LOGOUT })

import { USER_INFO, USER_LOGIN, USER_CODE, USER_MOBILE_LOGIN } from '@constants/user'
import { API_USER, API_USER_LOGIN, API_CODE, API_MOBILE_LOGIN } from '@constants/api'
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

export const dispatchGetCode = payload => createAction({
  url: API_CODE,
  method: 'POST',
  type: USER_CODE,
  payload
})

export const dispatchMobileLogin = payload => createAction({
  url: API_MOBILE_LOGIN,
  method: 'POST',
  type: USER_MOBILE_LOGIN,
  payload
})

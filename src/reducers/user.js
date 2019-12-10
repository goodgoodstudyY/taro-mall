import { USER_INFO, USER_LOGIN, USER_LOGOUT } from '@constants/user'

const INITIAL_STATE = {
  userInfo: {},
  showPageError: false
}

export default function user(state = INITIAL_STATE, action) {
  if (action && action.payload && action.payload.showPageError) {
    state.showPageError = true
    return state
  }
  switch(action.type) {
    case USER_INFO: {
      return {
        ...state,
        userInfo: {
          ...action.payload,
          login: true
        }
      }
    }
    case USER_LOGIN: {
      return { ...state }
    }
    case USER_LOGOUT: {
      return {
        ...INITIAL_STATE
      }
    }
    default:
      return state
  }
}

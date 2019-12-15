import { USER_INFO, USER_LOGIN, USER_SESSION, USER_LOGOUT } from '@constants/user'

const INITIAL_STATE = {
  userInfo: {},
  showPageError: false,
  token: '',
  sessionKey: ''
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
    case USER_SESSION: {
      const sessionKey = action.payload.sessionKey || state.sessionKey
      return { ...state, sessionKey }
    }
    case USER_LOGIN : {
      const loginInfo = action.payload
      return {...state, loginInfo}
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

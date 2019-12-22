import { USER_INFO, USER_LOGIN, USER_CODE, USER_MOBILE_LOGIN } from '@constants/user'

const INITIAL_STATE = {
  userInfo: {},
  showPageError: false,
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
    case USER_LOGIN : {
      const loginInfo = action.payload
      return {...state, loginInfo}
    }
    default:
      return state
  }
}

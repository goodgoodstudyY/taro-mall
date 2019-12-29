import {
  ADDRESS_LIST,
  ADDRESS_ADD
} from '@constants/address'

const INITIAL_STATE = {
  addressList: [],
  showPageError: false
}

export default function address(state = INITIAL_STATE, action) {
  if (action && action.payload && action.payload.showPageError) {
    state.showPageError = true
    return state
  }
  switch(action.type) {
    case ADDRESS_LIST: {
      return {
        ...state,
        addressList: action.payload
      }
    }
    case ADDRESS_ADD: {
      return {
        ...state
      }
    }
    default:
      return state
  }
}
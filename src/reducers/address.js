import Taro from '@tarojs/taro'
import {
  ADDRESS_LIST
} from '@constants/cart'

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
      console.log(action.payload)
      return {
        ...state
      }
    }
    default:
      return state
  }
}
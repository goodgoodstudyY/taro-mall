import {
  ORDER_PRICE,
  ORDER_PAY,
  ORDER_PRE,
  ORDER_PAY_CALLBACK,
  ORDER_LIST,
  ORDER_CONFIRM_GOODS,
  ORDER_COMMENT,
  ORDER_PACKAGE
} from '@constants/order'

const INITIAL_STATE = {
  showPageError: false,
  packageInfo: {}
}

export default function order(state = INITIAL_STATE, action) {
  if (action && action.payload && action.payload.showPageError) {
    state.showPageError = true
    return state
  }
  switch(action.type) {
    case ORDER_PRICE:
    case ORDER_PAY:
    case ORDER_PRE:
    case ORDER_LIST:
    case ORDER_CONFIRM_GOODS:
    case ORDER_COMMENT:
    case ORDER_PAY_CALLBACK: {
      return {
        ...state
      }
    }
    case ORDER_PACKAGE: {
      return {
        packageInfo: action.payload[0]
      }
    }
    default: {
      return state
    }
  }
}
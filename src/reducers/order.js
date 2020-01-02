import {
  ORDER_PRICE, ORDER_PAY, ORDER_PRE, ORDER_PAY_CALLBACK
} from '@constants/order'

const INITIAL_STATE = {
  showPageError: false,
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
    case ORDER_PAY_CALLBACK: {
      return {
        ...state
      }
    }
    default: {
      return state
    }
  }
}
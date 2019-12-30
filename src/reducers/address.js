import {
  ADDRESS_LIST,
  ADDRESS_ADD,
  ADDRESS_DEL,
  ADDRESS_EDIT
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
      let list = action.payload
      let arr1 = []
      list.map(x => {
        if (x.isDefault == 1) {
          arr1.unshift(x)
        } else {
          arr1.push(x)
        }
      })
      return {
        ...state,
        addressList: arr1
      }
    }
    case ADDRESS_EDIT:
    case ADDRESS_DEL:
    case ADDRESS_ADD: {
      return {
        ...state
      }
    }
    default:
      return state
  }
}
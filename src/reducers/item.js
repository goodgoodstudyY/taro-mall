import { ITEM_INFO, ITEM_RECOMMEND } from '@constants/item'

const INITIAL_STATE = {
  itemInfo: {},
  showPageErr: false
}

export default function item(state = INITIAL_STATE, action) {
  if (action && action.payload && action.payload.showPageError) {
    state.showPageError = true
    return state
  }
  switch(action.type) {
    case ITEM_INFO: {
      return {
        ...state,
        itemInfo: action.payload
      }
    }
    case ITEM_RECOMMEND: {
      return { ...state }
    }
    default:
      return state
  }
}

import { CATE_TAG_MENU, CATE_SUB, CATE_SUB_LIST, CATE_MENU } from '@constants/cate'

const INITIAL_STATE = {
  tagMenu: [],
  menu: [],
  category: [],
  subMenu: [],
  subCategory: {},
  showPageErr: false
}

export default function cate(state = INITIAL_STATE, action) {
  if (action && action.payload && action.payload.showPageError) {
    state.showPageError = true
    return state
  }
  switch(action.type) {
    case CATE_TAG_MENU: {
      const tagMenu = action.payload
      return { ...state, tagMenu }
    }
    case CATE_MENU: {
      const menu =  action.payload
      return {
        ...state,
        menu
      }
    }
    case CATE_SUB: {
      return {
        ...state,
        subMenu: action.payload.category.subCategoryList
      }
    }
    case CATE_SUB_LIST: {
      const { id, itemList } = action.payload
      return {
        ...state,
        subCategory: { ...state.subCategory, [id]: itemList }
      }
    }
    default:
      return state
  }
}

import { CATE_TAG_MENU, CATE_SUB, CATE_SUB_LIST, CATE_MENU } from '@constants/cate'

const INITIAL_STATE = {
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
      const categoryList = action.payload
      const menu = categoryList.map(({ id, name }) => ({ id, name }))
      return { ...state, menu, category: categoryList }
    }
    case CATE_MENU: {
      console.log(action.payload)
      return {
        ...state
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

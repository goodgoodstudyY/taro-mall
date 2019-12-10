import { CATE_TAG_MENU, GOOGS_DETAIL, CATE_SUB_LIST, CATE_MENU } from '@constants/cate'

const INITIAL_STATE = {
  tagMenu: [],
  menu: [],
  goodsDetail: {},
  goodsList: [],
  showPageError: false
}

export default function cate(state = INITIAL_STATE, action) {
  if (action && action.payload && action.payload.showPageError) {
    state.showPageError = true
    return state
  } else {
    state.showPageError = false
  }
  switch(action.type) {
    case CATE_TAG_MENU: {
      const tagMenu = action.payload.map(x => {
        x.tagId = x.id
        return x
      })
      tagMenu.unshift({name: '全部'})
      return { ...state, tagMenu }
    }
    case CATE_MENU: {
      const menu =  action.payload.map(x => {
        x.typeId = x.id
        return x
      })
      return {
        ...state,
        menu
      }
    }
    case GOOGS_DETAIL: {
      return {
        ...state,
        goodsDetail: action.payload
        // subMenu: action.payload.category.subCategoryList
      }
    }
    case CATE_SUB_LIST: {
      const { list } = action.payload
      return {
        ...state,
        goodsList: list
      }
    }
    default:
      return state
  }
}

import Taro from '@tarojs/taro'
import { CATE_TAG_MENU, GOOGS_DETAIL, CATE_SUB_LIST, CATE_MENU } from '@constants/cate'
import { API_GOODS_TAG_LIST, API_GOODS_Detail, API_CATE_SUB_LIST, API_CATE, API_CATE_SUB_LIST_HAVE_TOKEN } from '@constants/api'
import { createAction } from '@utils/redux'

/**
 * 分类菜单、列表
 * @param {*} payload
 */
export const dispatchTagMenu = payload => createAction({
  url: API_GOODS_TAG_LIST,
  type: CATE_TAG_MENU,
  payload
})

export const dispatchMenu = payload => createAction({
  url: API_CATE,
  type: CATE_MENU,
  payload
})

/**
 * 商品详情
 * @param {*} payload
 */
export const dispatchGoodsDetail = payload => createAction({
  url: API_GOODS_Detail + '/' + payload,
  type: GOOGS_DETAIL
})

/**
 * 商品列表
 * @param {*} payload
 */
export const dispatchSubList = payload => createAction({
  url: Taro.$globalData.token ? API_CATE_SUB_LIST_HAVE_TOKEN : API_CATE_SUB_LIST,
  type: CATE_SUB_LIST,
  method: 'POST',
  payload
})

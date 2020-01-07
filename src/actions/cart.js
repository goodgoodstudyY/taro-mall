import {
  CART_NUM,
  CART_ADD, CART_UPDATE_CHECK, CART_UPDATE
} from '@constants/cart'

/**
 * 购物车信息
 * @param {*} payload
 */
// export const dispatchCart = payload => createAction({
//   url: API_CART,
//   type: CART_INFO,
//   payload
// })

/**
 * 购物车物品数量
 * @param {*} payload
 */
export const dispatchCartNum = payload => {
  return dispatch => {
    dispatch({
      type: CART_NUM,
      payload
    })
  }
}

/**
 * 添加商品到购物车
 * @param {*} payload
 */
export const dispatchAdd = payload => {
  return dispatch => {
    dispatch({
      type: CART_ADD,
      payload
    })
  }
}

/**
 * 更新商品信息
 * @param {*} payload
 */
export const dispatchUpdate = payload => ({
  type: CART_UPDATE,
  payload
})

/**
 * 更新商品选中状态
 * @param {*} payload
 */
export const dispatchUpdateCheck = payload => {
  return dispatch => {
    dispatch({
      type: CART_UPDATE_CHECK,
      payload
    })
  }
}

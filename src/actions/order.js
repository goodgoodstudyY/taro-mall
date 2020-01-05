import {
  ORDER_PRICE, ORDER_PAY, ORDER_PRE, ORDER_PAY_CALLBACK, ORDER_LIST, ORDER_CONFIRM_GOODS
} from '@constants/order'
import {
  API_ORDER_PRICE, API_ORDER_PRE, API_ORDER_PAY, API_ORDER_PAY_CALLBACK, API_ORDER_LIST, API_ORDER_CONFIRM_GOODS
} from '@constants/api'
import { createAction } from '@utils/redux'

export const dispatchOrderPrice = payload => createAction({
  url: API_ORDER_PRICE,
  method: 'POST',
  type: ORDER_PRICE,
  payload
})

export const dispatchOrderPre = payload => createAction({
  url: API_ORDER_PRE,
  method: 'POST',
  type: ORDER_PRE,
  payload
})

export const dispatchOrderPay = payload => createAction({
  url: API_ORDER_PAY + '?orderId=' + payload.orderId,
  method: 'POST',
  type: ORDER_PAY,
  // payload
})

export const dispatchOrderCallback = payload => createAction({
  url: API_ORDER_PAY_CALLBACK,
  type: ORDER_PAY_CALLBACK,
  payload
})

export const dispatchOrderList = payload => createAction({
  url: API_ORDER_LIST,
  type: ORDER_LIST,
  method: 'POST',
  payload
})

export const dispatchConfirmGoods = payload => createAction({
  url: API_ORDER_CONFIRM_GOODS + '?orderId=' + payload.orderId ,
  type: ORDER_CONFIRM_GOODS,
  method: 'POST',
  payload
})
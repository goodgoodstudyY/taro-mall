import {
  ADDRESS_LIST, ADDRESS_ADD, ADDRESS_DEL, ADDRESS_EDIT
} from '@constants/address'
import {
  API_ADDRESS_LIST, API_ADD_ADDRESS, API_DEL_ADDRESS, API_EDIT_ADDRESS
} from '@constants/api'
import { createAction } from '@utils/redux'

export const dispatchAddressList = payload => createAction({
  url: API_ADDRESS_LIST,
  method: 'POST',
  type: ADDRESS_LIST,
  payload
})

export const dispatchAddAddress = payload => createAction({
  url: API_ADD_ADDRESS,
  method: 'POST',
  type: ADDRESS_ADD,
  payload
})

export const dispatchDelAddress = payload => createAction({
  url: API_DEL_ADDRESS + '/' + payload,
  type: ADDRESS_DEL
})

export const dispatchEditAddress = payload => createAction({
  url: API_EDIT_ADDRESS,
  method: 'POST',
  type: ADDRESS_EDIT,
  payload
})
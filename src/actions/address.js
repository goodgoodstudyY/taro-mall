import {
  ADDRESS_LIST, ADDRESS_ADD
} from '@constants/address'
import {
  API_ADDRESS_LIST, API_ADD_ADDRESS
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
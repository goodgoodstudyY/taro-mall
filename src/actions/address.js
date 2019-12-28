import {
  ADDRESS_LIST,
} from '@constants/address'
import {
  API_ADDRESS_LIST
} from '@constants/api'
import { createAction } from '@utils/redux'

export const dispatchAddressList = payload => createAction({
  url: API_ADDRESS_LIST,
  method: 'POST',
  type: ADDRESS_LIST,
  payload
})
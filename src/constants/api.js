/**
 * NOTE HOST、HOST_M 是在 config 中通过 defineConstants 配置的
 * 只所以不在代码中直接引用，是因为 eslint 会报 no-undef 的错误，因此用如下方式处理
 */
/* eslint-disable */
export const host = HOST
export const hostM = HOST_M
/* eslint-enable */
const yanxuan = 'https://miniapp.you.163.com'

// pic
export const CDN = 'https://yanxuan.nosdn.127.net'

// home

// cate
export const API_GOODS_TAG_LIST = `${host}/common/goods/tags/list`
export const API_CATE = `${host}/common/goods/type/list`
export const API_GOODS_Detail = `${host}/common/goods/info`
export const API_CATE_SUB_LIST = `${host}/common/goods/list`
export const API_CATE_SUB_LIST_HAVE_TOKEN = `${host}/wx/goods/list`
export const API_GOODS_DETAIL_HAVE_TOKEN = `${host}/wx/goods/info`

// order
export const API_ORDER_PRICE = `${host}/wx/pay/price`
export const API_ORDER_PRE = `${host}/wx/pay/pre`
export const API_ORDER_PAY = `${host}/wx/pay/order`
export const API_ORDER_PAY_CALLBACK = `${host}/wx/pay/callback`
export const API_ORDER_LIST = `${host}/wx/order/list`
export const API_ORDER_CONFIRM_GOODS = `${host}/wx/order/sendComplete`
export 

// address
export const API_ADDRESS_LIST = `${host}/wx/customer/address/list`
export const API_ADD_ADDRESS = `${host}/wx/customer/address/add`
export const API_DEL_ADDRESS = `${host}/wx/customer/address/del`
export const API_EDIT_ADDRESS = `${host}/wx/customer/address/update`

// user
export const API_USER = `${yanxuan}/xhr/user/getDetail.json`
export const API_USER_SEESION = `${host}/common/wxAutoLogin`
export const API_USER_LOGIN = `${host}/common/getToken`
export const API_REFRESH_TOKEN = `${host}/common/refreshWxToken`
export const API_CODE = `${host}/common/sendSms`
export const API_MOBILE_LOGIN = `${host}/common/login`

// item
export const API_ITEM = `${yanxuan}/xhr/item/detail.json`
export const API_ITEM_RECOMMEND = `${yanxuan}/xhr/rcmd/itemDetail.json`

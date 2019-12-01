/**
 * NOTE HOST、HOST_M 是在 config 中通过 defineConstants 配置的
 * 只所以不在代码中直接引用，是因为 eslint 会报 no-undef 的错误，因此用如下方式处理
 */
/* eslint-disable */
export const host = HOST
export const hostM = HOST_M
/* eslint-enable */
const yanxuan = 'https://miniapp.you.163.com'
const yanxuan_m = 'https://m.you.163.com'

// pic
export const CDN = 'https://yanxuan.nosdn.127.net'

// home
export const API_HOME = `${yanxuan}/xhr/index/index.json`
export const API_HOME_SEARCH_COUNT = `${yanxuan}/xhr/search/displayBar.json`
export const API_HOME_PIN = `${yanxuan_m}/pin/min/item/recommend.json`
export const API_HOME_RECOMMEND = `${yanxuan}/xhr/rcmd/index.json`

// cate
export const API_GOODS_TAG_LIST = `${host}/common/goods/tags/list`
// export const API_CATE = `${host}/xhr/list/category.json`
export const API_CATE_SUB = `${yanxuan}/xhr/list/subCate.json`
export const API_CATE_SUB_LIST = `${yanxuan}/xhr/list/l2Items2.json`

// order


// cart
export const API_CART = `${yanxuan}/xhr/promotionCart/getCarts.json`
export const API_CART_NUM = `${yanxuan}/xhr/promotionCart/getMiniCartNum.json`
export const API_CART_RECOMMEND = `${yanxuan}/xhr/rcmd/cart.json`
export const API_CART_ADD = `${yanxuan}/xhr/promotionCart/add.json`
export const API_CART_UPDATE = `${yanxuan}/xhr/promotionCart/update.json`
export const API_CART_UPDATE_CHECK = `${yanxuan}/xhr/promotionCart/updateCheck.json`

// user
export const API_USER = `${yanxuan}/xhr/user/getDetail.json`
export const API_USER_LOGIN = `${yanxuan}/xhr/u/mailLogin.json`
export const API_CHECK_LOGIN = `${yanxuan}/xhr/u/checkLogin.json`

// item
export const API_ITEM = `${yanxuan}/xhr/item/detail.json`
export const API_ITEM_RECOMMEND = `${yanxuan}/xhr/rcmd/itemDetail.json`

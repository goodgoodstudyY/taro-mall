import Taro, { getBluetoothDevices } from '@tarojs/taro'
import {
  CART_INFO, CART_NUM, CART_RECOMMEND,
  CART_ADD, CART_UPDATE, CART_UPDATE_CHECK
} from '@constants/cart'

const INITIAL_STATE = {
  cartInfo: [],
  recommend: {},
  showPageError: false
}

// TODO H5、RN 还不支持 setTabBarBadge
const updateTabBar = (count) => {
  if (count > 0) {
    Taro.setTabBarBadge({
      index: 3,
      text: `${count}`
    })
  } else {
    Taro.removeTabBarBadge({
      index: 3
    })
  }
}

export default function cart(state = INITIAL_STATE, action) {
  if (action && action.payload && action.payload.showPageError) {
    state.showPageError = true
    return state
  }
  switch(action.type) {
    case CART_ADD: {
      let good = action.payload
      let goods = []
      let haveSameGood = false
      state.cartInfo.map(x => {
        if (x.id == good.id) {
          good.num = x.num + good.num
          haveSameGood = true
          goods.push(good)
        } else {
          goods.push(x)
        }
      })
      if (!haveSameGood) {
        goods.push(good)
      }
      return {
        cartInfo: goods
      }
    }
    case CART_INFO:
    case CART_UPDATE:
    case CART_UPDATE_CHECK: {
      return {
        ...state,
        cartInfo: action.payload
      }
    }
    case CART_NUM: {
      updateTabBar(action.payload.countCornerMark)
      return state
    }
    case CART_RECOMMEND: {
      return {
        ...state,
        recommend: action.payload
      }
    }
    default:
      return state
  }
}

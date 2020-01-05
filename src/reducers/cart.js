import Taro from '@tarojs/taro'
import {
  CART_INFO, CART_NUM,
  CART_ADD, CART_UPDATE_CHECK
} from '@constants/cart'

const INITIAL_STATE = {
  cartInfo: [],
  recommend: {},
  count: 0,
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
          console.log(goods.num, x.num, good.num, 2222)
          if (good.num <= 0) return
          goods.push(Object.assign(
            x,
            good
          ))
          console.log(11111)
        } else {
          if (good.num <= 0) return
          goods.push(x)
        }
      })
      if (!haveSameGood) {
        goods.push(good)
      }
      return {
        ...state,
        cartInfo: goods
      }
    }
    case CART_UPDATE_CHECK: {
      return {
        ...state,
        cartInfo: state.cartInfo.map(x => {
          if (x.id == action.payload.id) {
            x = action.payload
          }
          return x
        })
      }
    }
    case CART_NUM: {
      const num = action.payload.countCornerMark + state.count || 0
      if (!action.payload.notUpdateNum) {
        updateTabBar(num)
      }
      return {
        ...state,
        count: num
      }
    }
    default:
      return state
  }
}

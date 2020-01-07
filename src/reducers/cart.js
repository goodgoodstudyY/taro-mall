import Taro from '@tarojs/taro'
import {
  CART_NUM, CART_UPDATE,
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
          if (good.num <= 0) return
          goods.push(Object.assign(
            x,
            good
          ))
        } else {
          goods.push(x)
        }
      })
      if (!haveSameGood && good.num > 0) {
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
    case CART_UPDATE: {
      let num = 0
      let curCart = []
      state.cartInfo.map(x => {
        if (!x.checked) {
          num = num + x.num
          curCart.push(x)
        }
      })
      return {
        ...state,
        cartInfo: curCart,
        count: num
      }
    }
    default:
      return state
  }
}

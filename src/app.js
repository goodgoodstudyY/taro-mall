import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import Index from './pages/index'

import configStore from './store'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore()

class App extends Component {
  config = {
    pages: [
      'pages/home/home',
      'pages/cate/cate',
      'pages/goods-detail/goods-detail',
      'pages/cart/cart',
      'pages/user/user',
      'pages/user-login-email/user-login-email',
      'pages/item/item',
      'pages/order/order',
      'pages/search-goods/search-goods',
      'pages/shopInfo/shopInfo',
      'pages/goodsPayment/goodsPayment',
      'pages/addressList/addressList',
      'pages/addressEdit/addressEdit',
      'pages/orderDetail/orderDetail'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '餐饮包装',
      navigationBarTextStyle: 'black'
    },
    networkTimeout: {
      request: 5000,
      connectSocket: 5000,
      uploadFile: 5000,
      downloadFile: 5000
    },
    tabBar: {
      color: "#666",
      selectedColor: "#b4282d",
      backgroundColor: "#fafafa",
      borderStyle: 'black',
      list: [{
        pagePath: "pages/home/home",
        iconPath: "./assets/tab-bar/home.png",
        selectedIconPath: "./assets/tab-bar/home-active.png",
        text: "首页"
      }, {
        pagePath: "pages/cate/cate",
        iconPath: "./assets/tab-bar/cate.png",
        selectedIconPath: "./assets/tab-bar/cate-active.png",
        text: "商品"
      }, {
        pagePath: "pages/order/order",
        iconPath: "./assets/tab-bar/order.png",
        selectedIconPath: "./assets/tab-bar/order-active.png",
        text: "订单"
      }, {
        pagePath: "pages/cart/cart",
        iconPath: "./assets/tab-bar/cart.png",
        selectedIconPath: "./assets/tab-bar/cart-active.png",
        text: "购物车"
      }, {
        pagePath: "pages/user/user",
        iconPath: "./assets/tab-bar/user.png",
        selectedIconPath: "./assets/tab-bar/user-active.png",
        text: "个人"
      }]
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))

Taro.$globalData = {}
Taro.$page = {}
Taro.$lock = {}

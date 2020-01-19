import Taro, { Component } from '@tarojs/taro'
// eslint-disable-next-line no-unused-vars
import { View, Text, Image, Button } from '@tarojs/components'
// import { bridgeOrderData } from '../../comm/order'
import { OnlyTime, formatTime, crop } from '../../utils/util'

import './index.scss'

export default class Tenant extends Component {

  static options = {
    addGlobalClass: true
  }

  state = {
    orderItem: {},
    restTime: ''
  }

  static defaultProps = {
    styles: {},
    coupon: []
  }

  store = {
    defaultImg: 'https://weapp-1253522117.image.myqcloud.com//image/20190403/393a3220c7b54d3d.png?imageView2/1/w/110/h/110',
    timer: null
  }

  componentWillMount() {
    let order = this.props.order
    const time = order.updateTime.split('T')
    order.updateTime = time[0].replace(/\.|\-/g, '/') + ' ' + time[1].slice(0, 8)
    this.setState({
      orderItem: order
    }, () => {
      if (this.state.orderItem.orderStatus == 2) {
        this.countDown()
      }
    })
  }

  componentWillUnmount() {
    clearInterval(this.store.timer)
  }

  countDown () {
    const count = () => {
      const restTime = new Date(this.state.orderItem.updateTime).getTime() + 60 * 32 * 60 * 1000 - Date.now()
      this.setState({
        restTime: restTime > 0 ? OnlyTime(restTime) : ''
      })
      if (restTime <= 0) {
        clearInterval(this.store.timer)
      }
    }
    count()
    this.store.timer = setInterval(() => {
      count()
    }, 1000)
  }

  goOrderDetail(id) {
    Taro.navigateTo({
      url: '../orderDetail/orderDetail?order_id=' + id
    })
  }

  callPhone() {
    Taro.makePhoneCall({
			phoneNumber: '18300681922'
		}).catch(() => { })
  }

  getTime(e) {
    return (new Date().getTime() - new Date(e * 1000) - (120 * 60 * 1000)) < 0 ? true : false
  }

  getProduct(id) {
    this.props.onGetProduct(id)
  }

  cancel(id) {
    this.props.onCancel(id)
  }

  toPay(id) {
    this.props.onToPay(id)
  }

  getEvaluate(item) {
    Taro.navigateTo({
      url: '/pages/evaluateOrder/evaluateOrder?item=' + JSON.stringify(item)
    })
  }

  render () {
    const { orderItem, restTime } = this.state
    const status = [1, 4, 5, 6]
    const totalNum = orderItem.goodsInfo && orderItem.goodsInfo.reduce((now, next) => {return now + next.count}, 0)
    const typeText = {
      2: '待支付',
      1: '待发货',
      3: '待收货',
      4: '待评价',
      5: '已完成'
    }
    return (
      <View className='card-component bgc-w'>
        <View className='fsbc order-top' onClick={this.goOrderDetail.bind(this, orderItem.id)}>
          <View className='fs28 c000'>
            <Text>创建时间：{orderItem.updateTime ? formatTime(orderItem.updateTime) : ''}</Text>
          </View>
          <View className='fs28 cef bold'>
            <Text>{typeText[orderItem.orderStatus]}</Text>
          </View>
        </View>
        <View className='shop-list'>
          {
            orderItem.goodsInfo && orderItem.goodsInfo.map((x, index) => {
              return (
                <View key={x.goodsId}>
                  <View className='item fss' onClick={this.goOrderDetail.bind(this, orderItem.id)}>
                    <Image
                      className='shop-img'
                      mode='aspectFill'
                      src={x.picture ? crop(x.picture, 110) : this.store.defaultImg}
                    />
                    <View className='f1 fsbs-c detail ml30'>
                      <View className='fs28'>{x.name}</View>
                    </View>
                    <View className='fsbe-c detail'>
                      <View className='fs28'>¥{x.price}</View>
                      <View className='fs26 c999 mt20'>×{x.count}</View>
                    </View>
                  </View>
                </View>
              )
            })
          }
        </View>
        <View
          className='fs30 order-top w100 fec' 
          onClick={this.goOrderDetail.bind(this, orderItem.id)}
        >
          {/* <Text>创建时间：{formatTime(new Date(orderItem.updateTime))}</Text> */}
          <View>
            <Text>共{totalNum}件商品  合计：</Text><Text className='cr'>¥{orderItem.goodsPrice + orderItem.packagePrice}</Text>
          </View>
        </View>
        <View className='fec'>
        {
          (orderItem.orderStatus == 3) && (
            <View className='order-bottom fec'>
              <Button className='btn-size fs26 c666 w176 button-gray' onClick={this.callPhone}>联系商家</Button>
              <Button className='btn-size fs26 get-btn cfff ml30 w176' onClick={this.getProduct.bind(this, orderItem.id)}>确认收货</Button>
            </View>
          )
        }
        {
          orderItem.orderStatus == 2 && (
            <View className='order-bottom fec'>
              {
                restTime && 
                <Button className='btn-size fs26 c666 w176 button-gray' onClick={this.cancel.bind(this, orderItem.id)}>取消订单</Button>
              }
              {
                restTime && (
                  <Button className='btn-size fs26 get-btn cfff ml30 btn-fix' onClick={this.toPay.bind(this, orderItem.id)}>待支付 {restTime}</Button>
                )
              }
              {
                !restTime && 
                (
                  <View className='btn-size fs26 c666 ml30 button-gray w176'>已失效</View>
                )
              }
          </View>
          )
        }
        {
          orderItem.orderStatus == 4 && (
            <View className='order-bottom fec'>
              <Button className='btn-size fs26 c666 w176 button-gray' onClick={this.callPhone}>联系商家</Button>
              <Button className='btn-size fs26 get-btn cfff ml30 w176' onClick={this.getEvaluate.bind(this, orderItem)}>评价</Button>
            </View>
          )
        }
        {
          orderItem.orderStatus == 5
          ?
          <View className='order-bottom fec'>
            <Button className='btn-size fs26 c666 w176 button-gray' onClick={this.callPhone}>联系商家</Button>
          </View>
          : <View></View>
        }
        </View>
      </View>
    )
  }
}

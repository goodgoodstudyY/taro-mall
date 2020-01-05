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
    this.setState({
      // orderItem: bridgeOrderData(this.props.order)
      orderItem: this.props.order
    }, () => {
      if (this.state.orderItem.type == 0) {
        this.countDown()
      }
    })
  }

  componentWillUnmount() {
    clearInterval(this.store.timer)
  }

  countDown () {
    const count = () => {
      const restTime = this.state.orderItem.createTime * 1000 + 15 * 60 * 1000 - Date.now()
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

  render () {
    const { orderItem, restTime } = this.state
    const status = [1, 4, 5, 6]
    const totalPrice = orderItem.goodsInfo && orderItem.goodsInfo.reduce((now, next) => {return now + next.count * next.price}, 0)
    const totalNum = orderItem.goodsInfo && orderItem.goodsInfo.reduce((now, next) => {return now + next.count}, 0)
    return (
      <View className='card-component bgc-w'>
        <View className='fsbc order-top' onClick={this.goOrderDetail.bind(this, orderItem.id)}>
          <View className='fs28 c000'>
            <Text>订单编号：{orderItem.id}</Text>
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
          className={'fs30 order-top w100 ' + (orderItem.orderType == 6 && orderItem.type == 100 ? 'fsbc' : 'fec')} 
          onClick={this.goOrderDetail.bind(this, orderItem.id)}
        >
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
                orderItem.type.status != 0 && 
                <Button className='btn-size fs26 c666 w176 button-gray' onClick={this.cancel.bind(this, orderItem.id)}>取消订单</Button>
              }
                <Button className='btn-size fs26 get-btn cfff ml30 btn-fix' onClick={this.toPay.bind(this, orderItem.id)}>待支付 {restTime}</Button>
          </View>
          )
        }
        {
          status.includes(Number(orderItem.orderStatus))
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

import Taro, { Component } from '@tarojs/taro'
// eslint-disable-next-line no-unused-vars
import { View, Text, Image, Button } from '@tarojs/components'
// import { bridgeOrderData } from '../../comm/order'
import { OnlyTime, formatTime } from '../../utils/util'

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
    is_eat_first: false,
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
    if(!this.state.restTime || this.state.orderItem.type == 0 && this.state.restTime) {
      Taro.nav({
        url: '../orderDetail/orderDetail',
        data: {
          order_id: id
        }
      })
    }
  }

  callPhone() {
    Taro.makePhoneCall({
			phoneNumber: Taro.$globalData.phone
		}).catch(() => { })
  }

  getQrCode(key, sn) {
    Taro.nav({
      url: '../extractionCode/extractionCode',
      data: {
        order_id: key,
        sn,
      }
    })
  }

  addDishes() {
    const e = this.state.orderItem
    Taro.$globalData.desk = e.desk
    Taro.$globalData.terminalInfoID = e.terminal_id
    if(this.getTime(e.pay_time) == true) {
      Taro.nav({
        url: '/pages/orderDishesList/orderDishesList'
      })
    }
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

  toPay(id, payType) {
    this.props.onToPay(id, payType)
  }

  goToPay(order) {
    this.props.onGoToPay && this.props.onGoToPay(order)
  }


  render () {
    const { orderItem, restTime } = this.state
    const status = ['20', '21', '22', '23', '24', '30']
    const { type, disCountPrice } = orderItem
    const totalPrice = orderItem.snapshot && orderItem.snapshot.list.reduce((now, next) => {return now + next.num * next.sku_price}, 0)
    return (
      <View className='card-component bf'>
        <View className='fsbc order-top' onClick={this.goOrderDetail.bind(this, orderItem.id)}>
          <View className='fs28 c0'>
            <Text>订单编号：{orderItem.sn}</Text>
          </View>
          <View className='fs28 cef bold'>
            <Text>{orderItem.type == 60 && orderItem.deliveryType ==2 ? '配送中' : orderItem.typeSmallText}</Text>
          </View>
        </View>
        <View className='shop-list'>
          {
            orderItem.snapshot && orderItem.snapshot.list && orderItem.snapshot.list.map((x, index) => {
              return (
                <View key={x.goods_id}>
                  <View className='item fss' onClick={this.goOrderDetail.bind(this, orderItem.id)}>
                    <Image
                      className='shop-img'
                      mode='aspectFill'
                      src={x.goods_picture ? x.goods_picture.url + '?imageView2/1/w/110/h/110' : this.store.defaultImg}
                    />
                    <View className='f1 fsbs-c detail ml30'>
                      <View className='fs28'>{x.goods_name}</View>
                      <View className='fs26 c999 mt20 ellipsis2'>
                        {x.sku_name + ' ' + (x.attribute ? x.attribute.map(item => item.item_name).join(' ') : '')}
                        {/* {
                            x.attribute.length > 0
                            &&
                            x.attribute.map(item => {
                                return (
                                    <View className='ml10' key={item.id}>{item.item_name}</View>
                                )
                            })
                        } */}
                      </View>
                    </View>
                    <View className='fsbe-c detail'>
                      <View className='f28'>¥{x.sku_price}</View>
                      <View className='f26 c9 mt20'>×{x.num}</View>
                    </View>
                  </View>
                  {
                    orderItem.snapshot
                    &&
                    index != (orderItem.snapshot.list.length -1)
                    &&
                    x.bat_no != orderItem.snapshot.list[Number(index) + 1].bat_no
                    &&
                    <View className='show-time'>
                      <View className='line'></View>
                      <View className='time'>以上菜品 {x.create_time && formatTime(new Date(x.create_time * 1000), '-').slice(5).slice(0, -3)} 下单</View>
                    </View>
                  }
                </View>
              )
            })
          }
        </View>
        <View
          className={'fs30 order-top w100 ' + (orderItem.orderType == 6 && orderItem.type == 100 ? 'fsbc' : 'fec')} 
          onClick={this.goOrderDetail.bind(this, orderItem.id)}
        >
          {
            orderItem.orderType == 6 && orderItem.type == 100
            ? <Text className='fs24 c999'>取餐号{orderItem.runningWater}</Text>
            : null
          }
          <View>
            <Text>共{orderItem.snapshot.total_num}件{orderItem.goods_type == '1' ? '商' : '菜'}品 {orderItem.type == 0 ? (type == 1 ? `特价优惠￥${disCountPrice} ` : type == 2 ? `满减优惠￥${disCountPrice} ` : '') : ' '} 合计：</Text><Text className='cr'>¥{(orderItem.type==0 && orderItem.is_eat_first) ? ((Number(totalPrice - disCountPrice) + Number(Number(orderItem.fixed_cost))).toFixed(2)) : orderItem.actual_amount}</Text>
          </View>
        </View>
        <View className='fec'>
        {
          (orderItem.type == 50 || orderItem.type==60) && (
            <View className='order-bottom fec'>
              <Button className='btn-size fs26 c666 w176 button-gray' onClick={this.callPhone}>联系商家</Button>
              <Button className='btn-size fs26 get-btn cf ml30 w176' onClick={this.getProduct.bind(this, orderItem.id)}>确认收货</Button>
            </View>
          )
        }
        {
          orderItem.type==0
          ? 
            orderItem.is_eat_first
            ? (<View className='order-bottom fec'>
                <Button className='btn-size f26 get-btn cf ml30 btn-fix' onClick={this.goToPay.bind(this, orderItem)}>去结账</Button>
            </View>)
            : 
            (<View className='order-bottom fec'>
                {
                  orderItem.type.status != 0
                  && <Button className='btn-size f26 c6 w176 button-gray' onClick={this.cancel.bind(this, orderItem.id)}>取消订单</Button>
                }
                {
                  !restTime
                    ? <Button className='btn-size f26 c6 ml30 w176 button-gray' >已失效</Button>
                    : <Button className='btn-size f26 get-btn cf ml30 btn-fix' onClick={this.toPay.bind(this, orderItem.id, orderItem.payType)}>待支付 {restTime}</Button>}
            </View>)
          : null
        }
        {/* {
          orderItem.type == 0 && (
            <View className='order-bottom fec'>
              {
                orderItem.type.status != 0 && 
                <Button className='btn-size fs26 c666 w176 button-gray' onClick={this.cancel.bind(this, orderItem.id)}>取消订单</Button>
              }
              {
                !restTime
                ?
                <Button className='btn-size f26 c6 ml30 w176 button-gray' >已失效</Button>
                :
                <Button className='btn-size fs26 get-btn cf ml30 btn-fix' onClick={this.toPay.bind(this, orderItem.payType)}>待支付 {restTime}</Button>
              }
          </View>
          )
        } */}
        {
          orderItem.type == 40 && (
            <View className='order-bottom fec'>
              <Button className='btn-size fs26 get-btn cf ml30 w176' onClick={this.getQrCode.bind(this, orderItem.id, orderItem.sn)}><Text>提取码</Text></Button>
            </View>
          )
        }
        {
          (orderItem.type == 100 || status.includes(orderItem.type)) && orderItem.orderType != 6
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

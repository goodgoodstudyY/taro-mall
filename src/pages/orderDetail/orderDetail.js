import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Map, CoverView, CoverImage } from '@tarojs/components'

import { connect } from '@tarojs/redux'
import * as actions from '@actions/order'
import MyPage from '../../components/my-page/index'
// import { bridgeOrderData } from '../../../../comm/order'
import { formatTime, crop, OnlyTime } from '../../utils/util'
import './orderDetail.scss'

// import logIcon from '../../../../imgs/log_icon.png'
// import busIcon from '../../../../imgs/business_icon.png'
// import guestIcon from '../../../../imgs/guest_icon.png'
@connect(state => state.order, { ...actions })
export default class Index extends Component {
  config = {
    navigationBarTitleText: '订单详情',
    backgroundColor: '#ab2b2b',
    navigationBarBackgroundColor: '#ab2b2b',
    navigationBarTextStyle: 'white'
  }

  constructor(props) {
    super(props)
    this.state = {
      order: {},
      showBackToHome: false,
      openPopup: false,
      markers: [
        {
          id: 'log',
          latitude: '23.099994',
          longitude: '113.324520',
          // iconPath: logIcon,
          width: 45,
          height: 60,
          label: {
            content: '骑手到店取货中',
            color: '#000000',
            fontSize: 15,
            bgColor: '#ffffff',
            padding: 6,
            borderRadius: 5,
            anchorX: -20,
            anchorY: -95
          }
        },
        {
          id: 'bus',
          latitude: '23.0995',
          longitude: '113.326',
          // iconPath: busIcon,
          width: 45,
          height: 60,
        },
        {
          id: 'guest',
          latitude: '23.0997',
          longitude: '113.327',
          // iconPath: guestIcon,
          width: 45,
          height: 60
        }
      ],
      markersWithPage: [
        {
          id: 'log',
          latitude: 23.099994,
          longitude: 113.324520
        },
        {
          id: 'bus',
          latitude: 23.0995,
          longitude: 113.326
        },
        {
          id: 'guest',
          latitude: 23.0997,
          longitude: 113.327
        }
      ],
      centerLatlng: [23.0997, 113.327],
      restTime: '',
      canPay: false
    }
    this.store = {
      mapCtx: Taro.createMapContext('map'),
      deliveryRefresh: null,
      timer: null
    }
  }
  componentWillMount() {
    if (this.$router.params.shop_id) {
      this.setState({
        showBackToHome: true
      })
    }
    this.init()
  }
  componentWillUnmount() {
    clearInterval(this.store.deliveryRefresh)
  }

  onPullDownRefresh () {
    Taro.stopPullDownRefresh()
  }


  setIncludePoints () {
    if (process.env.TARO_ENV === 'weapp') {
      // ali直接在组件里面设置padding
      this.store.mapCtx.includePoints({
        points: this.state.markersWithPage,
        padding: [90, 20, 10, 20]
      })
    }
  }
  
  //  跳转物流详情
  toLogistics(e) {
    Taro.nav({
      url: '/pages/logistics/logistics',
      data: {
        id: e //不见id
      }
    })
  }
  //  确认收货
  getProduct(type) {
    Taro.showModal({
      title: '确认收货',
      content: '请确认你是否收到你的商品',
      cancelText: '取消',
      success: (res) => {
        if(res.confirm) {
          this.props.dispatchConfirmGoods({
            orderId: this.$router.params.order_id
          }).then(() => {
            Taro.$page['orderList'].changeList(type)
            Taro.showToast({
              title: '确认收货成功',
              icon: 'success',
              duration: 800
            })
            setTimeout(() => {
              Taro.navigateBack()
            }, 800);
          })
        }
      }
    })
  }

  // 跳转支付页面
  toPay() {
    if (Taro.$lock['pay']) {
      console.log('锁住了,支付中')
      return
    }
    let orderId = this.$router.params.order_id
    Taro.$lock['pay'] = true
    this.props.dispatchOrderPay({
      orderId: orderId
    }).then(res => {
      if (Object.keys(res).length > 0) {
          res.package = res.prepayId
          Taro.requestPayment(res).then(() => {
              this.props.dispatchOrderCallback({
                  orderId: orderId,
                  status: true
              }).then(() => {
                  this.delLock()
                  Taro.showToast({
                      title: '支付成功',
                      icon: 'success',
                      duration: 1000
                  })
                  this.init()
                  Taro.$page['orderList'].changeList()
              })
          }).catch(() => {
              this.delLock()
              Taro.showToast({
                  title: '用户取消',
                  icon: 'none',
                  mask: true
              })
              this.props.dispatchOrderCallback({
                  orderId: this.state.orderId,
                  status: false
              })
          })
      }
    }).catch(() => {
        this.delLock()
    })
  }
  delLock() {
    Taro.hideToast()
    delete Taro.$lock['pay']
  }
  // 取消订单
  cancelOrder() {
    Taro.showModal({
      title: '取消订单',
      content: '是否确定取消订单',
      cancelText: '取消',
      success: res => {
        if (res.confirm) {
          this.props.dispatchCancelOrder({
            orderId: this.$router.params.order_id
          }).then(() => {
            Taro.showToast({
              title: '取消成功',
              icon: 'success',
              duration: 800
            })
            Taro.$page['orderList'].changeList(2)
            setTimeout(() => {
              Taro.navigateBack()
            }, 800);
          })
        }
      }
    })
  }

  goHome() {
    Taro.$navigate.backHome()
  }
  // 联系商家
  callPhone() {
    Taro.makePhoneCall({
      phoneNumber: '18300681922'
    }).catch(() => {})
  }

  calcelScroll (e) {
    e.stopPropagation()
    e.preventDefault()
  }

  closeMark () {
    this.setState({
      openPopup: false
    })
  }

  checkProgress (e) {
    e.stopPropagation
    this.setState({
      openPopup: this.state.order.statusProcess.length > 0 ? true : false
    })
  }

  onrefreshMap () {
    this.queryDeliveryOrderDetail()
  }

  getTimes() {
    clearInterval(this.store.timer)
    let restTime = new Date(this.state.order.updateTime).getTime()
    const timer = () => {
      if (restTime) {
        if (restTime - Date.now() + 60 * 24 * 60 * 1000 < 0) {
          this.setState({
            canPay: false
          })
          clearInterval(this.store.timer)
        } else {
          restTime = OnlyTime(new Date(this.state.order.updateTime).getTime() - Date.now() + 60 * 24 * 60 * 1000)
          this.setState({
            restTime: restTime,
            canPay: true
          })
        }
      }
    }

    timer()
    this.store.timer = setInterval(() => {
      timer()
    }, 1000)
  }

  callCourierPhone () {
    // 此处为配送员电话
    Taro.makePhoneCall({
			phoneNumber: this.state.order.distributorInfo.mobile
		})
  }

  render() {
    const {
      showBackToHome,
      order,
      openPopup,
      markers,
      markersWithPage,
      centerLatlng,
      canPay,
      restTime
    } = this.state
    // const canShowMap = ['22', '23', '24'].includes(order.type) || order.type == 60 && order.deliveryType == 2
    const canShowMap = false
    const typeText = {
      2: '待支付',
      1: '待发货',
      3: '待收货',
      4: '待评价',
      5: '待评价',
      6: '已完成'
    }
    
    return (
      <MyPage onReload={this.init.bind(this)} homeback={showBackToHome}>
        {
          canShowMap && (
            <Map
              id='map'
              latitude={centerLatlng[0]}
              longitude={centerLatlng[1]}
              scale='16'
              markers={markers}
              className='map'
              style={{'height': `calc(50vh - 50rpx)`}}
              include-points={markersWithPage}
              include-padding={{
                left: 20,
                right: 20,
                top: 90,
                bottom: 10
              }}
            >
              <CoverView className='map-refresh fcc' onClick={this.onrefreshMap}>
                <CoverImage
                  className='refresh-icon'
                  src={Taro.$utils.crop('https://weapp-1253522117.image.myqcloud.com//image/20190731/38dda61fb914d2b3.png', 42)} 
                ></CoverImage>
              </CoverView>
            </Map>
          )
        }
        
        {/* type   100 完成  -10 退款  0 待支付  50、60 待收货  20、30 待送达  40 自提 */}
        {
          !canShowMap && (
            <View className='bottom-background'></View>
          )
        }
        {
          !canShowMap && (
            <View
              className='fs44 bold p-r mb60 mt40 fcc cfff'
              onClick={this.checkProgress.bind(this)}
            >
              <Text>订单{typeText[order.orderStatus]}</Text>
              {
                order.statusProcess.length > 0 && (
                  <View className='iconfont fs20 c1a ml10'>&#xe662;</View>
                )
              }
            </View>
          )
        }
        <View className='detail-wrap pt16' style={canShowMap ? {height: `calc(50vh - 50rpx)`, 'overflow-y': 'scroll'} : ''}>
          {
            canShowMap && (
              <View className='ship-info fsbc br16'>
                <Image 
                  className='ml30 ship-left' 
                  src={Taro.$utils.crop('https://weapp-1253522117.image.myqcloud.com//image/20190730/2980caac0e446815.png', 44, 36)}
                >
                </Image>
                <View className='ml30 f1'>
                  <Text className='fs46 c1a bold'>{order.distributorInfo.name}</Text>
                  <View className='mt20 fsc'>
                    <Image 
                      className='c1a ship-middle' 
                      src={Taro.$utils.crop('https://weapp-1253522117.image.myqcloud.com//image/20190730/0fa2c1b6e10a1220.png', 22, 26)}
                    />
                    <Text className='fs26 c1a ml10'>{order.deliveryType == 2 ? '订单由达达平台骑手服务' : ''}</Text>
                  </View>
                </View>
                <View className='call-phone-wrap fsc'>
                  <View className='left-border'></View>
                  <Image 
                    className='call-phone c53' 
                    onClick={this.callCourierPhone} 
                    src='https://weapp-1253522117.image.myqcloud.com//image/20190730/348335c4641995fb.png'
                  />
                </View>
              </View>
            )
          }
          {/* 地址详情 */}
          <View className={'address prdf' + (canShowMap ? ' br16 mt16' : ' br30')}>
            <View className='fsc ml30'>
              <View className='address-icon iconfont'>&#xe75c;</View>
            </View>
            {/* 非自提状态 */}
              <View className='fscs-c address-detail ml30 mr45'>
                <View className='fs28'>
                  <Text>{order.orderReceiveName}</Text>
                </View>
                <View className='fs28 fsbs-c h77 mt20'>
                  <Text>{order.orderReceiveProvince + order.orderReceiveCity + order.orderReceiveArea + order.orderReceiveAddress}</Text>
                </View>
              </View>
          </View>

          <View className='order-detail bgc-w column br16 mt16'>
            {/* 购买的物品 */}
            {
              order.goodsInfo && order.goodsInfo.map((item, index) => {
                return (
                  <View key={item.goodsId}>
                    <View className='item row'>
                      <View className='s110'>
                        <Image
                          className='s110' 
                          mode='aspectFill' 
                          src={
                            item.picture
                            ? crop(item.picture, 110)
                            :'https://weapp-1253522117.image.myqcloud.com//image/20190403/393a3220c7b54d3d.png?imageView2/1/w/110/h/110'
                          } 
                        />
                      </View>
                      <View className='ml30 row fb w520 detail'>
                        <View class='fb column'>
                          <Text className='fs28 bold ellipsis2 awidth'>{item.name}</Text>
                        </View>
                        <View className='fb column'>
                          <Text className='fs28 bold'>
                            ¥{item.price}
                          </Text>
                          <Text className='fs26 c999 tr'>×{item.count}</Text>
                        </View>
                      </View>
                    </View>
                  </View> 
                )
              })
            }
            <View className='border top-border' style='height: 1px' />
            {/* 支付金额详情 */}
            <View className='row pay-crash'>
                <View className='fs26 c10 ml15'>
                  {order.packagePrice == 0 && <Text>免配送费</Text>}
                  {order.packagePrice > 0 && <Text>{`运费${order.packagePrice}元`}</Text>}
                </View>
              <View className='fs26 c333 ml15 row'>
                { order.goodsPrice > order.goodsRealPrice
                  ? <Text>共优惠¥{order.goodsPrice - order.goodsRealPrice * 1}</Text>
                  : <Text></Text>
                }
                <View className='ml20'>
                  <Text>实付：¥{order.goodsPrice + order.packagePrice * 1}</Text>
                </View>
              </View>
            </View>
          </View>

          <View className='order-detail bgc-w column br16 mt16'>
            <View className='bs '>
              <View className='fs32 bold info-tip'>
                <Text>订单信息</Text>
              </View>
            </View>
            <View className='row info-detail mt40'>
              <View className='fs28 cb3'>
                <Text>订单编号</Text>
              </View>
              <View className='fs28 c1a'>
                <Text>{order.id}</Text>
              </View>
            </View>
            <View className='row info-detail'>
              <View className='fs28 cb3'>
                <Text>订单创建时间</Text>
              </View>
              <View className='fs28 c1a'>
                <Text>{formatTime(new Date(this.state.order.updateTime))}</Text>
              </View>
            </View>
            
            {/* 如果不是自配送才显示 */}
            {/* {
              order.deliveryType != 0 && !order.is_eat_first && (
                <View className='row info-detail'>
                  <Text className='fs28 cb3'>配送方式</Text>
                  <Text className='fs28 c1a'>
                  {
                    order.deliveryType == 1 
                    ?'商家配送' 
                    : order.deliveryType == 2 
                      ? '达达平台提供配送服务' 
                      : 'UU跑腿提供配送服务'
                  }
                  </Text>
                </View>
              )
            } */}
            {
              order.deliveryType == 2 && order.distributorInfo.name && (
                <View className='row info-detail'>
                  <Text className='fs28 cb3'>配送员</Text>
                  <View className='fs28 c1a' onClick={this.callCourierPhone}>
                    <Text>{order.distributorInfo.name}</Text>
                    <Text className='iconfont fs24 c1a'>&#xe632;</Text>
                  </View>
                </View>
              )
            }
            {
              order.remark && (
                <View className='row info-detail'>
                  <Text className='fs28 cb3'>订单备注</Text>
                  <Text className='fs28 c1a ellipsis2 w80 fec'>{order.remark}</Text>
                </View>
              )
            }
            {order.orderStatus == 7 && (
              <View className='row info-detail'>
                <View className='fs28 cb3'>
                  <Text>退款时间</Text>
                </View>
                <View className='fs28 c1a'>
                  <Text>{order.refund_time}</Text>
                </View>
              </View>
            )}
            {order.orderStatus == 7 && (
              <View className='row info-detail'>
                <View className='fs28 cb3'>
                  <Text>退款金额</Text>
                </View>
                <View className='fs28 c1a'>
                  <Text>¥{order.actual_refund}</Text>
                </View>
              </View>
            )}
            {
              order.orderStatus == 7 && order.refund_reason && (
                <View className='row info-detail'>
                  <View className='fs28 cb3'>
                    <Text>退款原因</Text>
                  </View>
                  <View className='fs28 c1a'>
                    <Text>{order.refund_reason}</Text>
                  </View>
                </View>
              )
            }
          </View>
        </View>

        {/* 状态摁钮 */}
        {/* 未支付 */}
        {order.orderStatus == 2 && (
          <View className='bottom-button bcf rowe baseline'>
            {
              canPay && (
                <View
                  className='btn-size fs26 c666 button-gray w176'
                  onClick={this.cancelOrder}
                >
                  取消订单
                </View>
              )
            }
            {
              canPay && (
                <View
                  className='btn-size fs26 get-btn cfff ml30 w220'
                  onClick={this.toPay}
                >
                  待支付 {restTime}
                </View>
              )
            }
            {
              !canPay && (
                <View className='btn-size fs26 c666 ml30 button-gray w176'>已失效</View>
              )
            } 
          </View>
        )}
        {
          [1, 4, 5, 6].includes(+order.orderStatus) && 
          (
            <View className='bottom-button bgc-w rowe baseline'>
              <View
                className='btn-size fs26 c666 w176 button-gray'
                onClick={this.callPhone}
              >
                联系商家
              </View>
            </View>
          )
        }
        {/* 待收货 */}
        {order.orderStatus == 3 && (
          <View className='bottom-button bgc-w rowe baseline'>
            <View
              className='btn-size fs26 c666 button-gray w176'
              onClick={this.callPhone}
            >
              联系商家
            </View>
            <View
              className='btn-size fs26 get-btn cfff ml30 w176'
              onClick={this.getProduct.bind(this, order.orderStatus)}
            >
              确认收货
            </View>
          </View>
        )}
        {/* 订单进度弹窗 */}
        {
          openPopup && (
            <View className='mark' onTouchMove={this.calcelScroll} onClick={this.closeMark.bind(this)}>
              <View className='progress-list'>
                <View className='progress-tit fcc fs34 c1a'>
                  <Text>订单进度</Text>
                </View>
                <View className='fss-c w100 bcf pt50 pb30'>
                  <View className='ml80'>
                    {
                      order.statusProcess.length > 0 && order.statusProcess.map((x, n) => { 
                        return (
                          <View key={x.id} className='fss'>
                            <View className='fsc-c'>
                              <View className={'circle fcc' + (n > 0 ? ' mt-15' : '')}>
                                <View className='in-circle'></View>
                              </View>
                              {
                                ((n+1) < order.statusProcess.length) && (
                                  <View className='circle-hor'></View>
                                )
                              }
                            </View>
                            <View className='pop-right ml50'>
                              <View className={'fss-c' + (n > 0 ? ' mt-15' : '')}>
                                <Text className='fs30 c222'>{x.status_text}</Text>
                                <Text className='fs24 c79 mt14'>{x.time}</Text>
                              </View>
                            </View>
                          </View>
                          
                        )
                      })
                    }
                  </View>
                </View>
              </View>
            </View>
          )
        }
      </MyPage>
    )
  }

  init() {
    let order_id = this.$router.params.order_id
    this.props.dispatchOrderList({
      pageNumber: 1,
      pageSize: 10,
      query: {
        id: order_id
      }
    }).then(data => {
      this.setState({
        order: data.list[0]
      }, () => {
        if (this.state.order.orderStatus == 2) {
          this.getTimes()
        }
      })
    })
  }

  queryDeliveryOrderDetail() {
    Taro.$apiRenderData(this, {
      url: '/customer/order/queryDeliveryButlerOrderDetail',
      data: {
        order_id: this.$router.params.order_id
      }
    }).then(res => {
      const data = res.data.data
      this.setState({
        order: bridgeOrderData(data)
      }, () => {
        if (['22', '23', '24'].includes(data.status) || data.status == 60 && data.delivery_type == 2) {
          this.getDeliveryData()
        } else {
          clearInterval(this.store.deliveryRefresh)
        }
      })
    })
  }

  getDeliveryData () {
    const { order: {distributorInfo, snapshot, typeText} } = this.state
    const logLnglat = distributorInfo.lnglat.split(',')
    const guestLnglat = snapshot.delivery_info.to_lnglat.split(',')
    const busLnglat = snapshot.delivery_info.form_lnglat.split(',')
    this.state.markers.map(x => {
      if (x.id == 'log') {
        x.latitude = logLnglat[1]
        x.longitude = logLnglat[0]
        x.label.content = typeText
      } else if (x.id == 'guest') {
        x.latitude = guestLnglat[1]
        x.longitude = guestLnglat[0]
      } else if (x.id == 'bus') {
        x.latitude = busLnglat[1]
        x.longitude = busLnglat[0]
      }
    })

    this.state.markersWithPage.map(x => {
      if (x.id == 'log') {
        x.latitude = logLnglat[1]
        x.longitude = logLnglat[0]
      } else if (x.id == 'guest') {
        x.latitude = guestLnglat[1]
        x.longitude = guestLnglat[0]
      } else if (x.id == 'bus') {
        x.latitude = busLnglat[1]
        x.longitude = busLnglat[0]
      }
    })

    this.setState({
      markers: this.state.markers,
      markersWithPage: this.state.markersWithPage
    }, () => {
      this.setIncludePoints()
    })
  }

}

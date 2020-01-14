import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/order'
import MyPage from '../../components/my-page/index'
import Tab from '../../components/tab/tab'
import Order from '../../components/order/order'
import LoadStyle from '../../components/loadStyle/index'
import './order.scss'

@connect(state => {return {order: state.order, cart: state.cart}}, { ...actions })
export default class Index extends Component {

  config = {
    navigationBarTitleText: '订单列表',
    backgroundColor: '#ab2b2b',
    navigationBarBackgroundColor: '#ab2b2b',
    enablePullDownRefresh: true,
    navigationBarTextStyle: 'white'
  }
  // Taro.$globalData.type 存储订单状态
  constructor(props) {
    super(props)
    this.state = {
      type: 100,
      tabBarList: [100, 2, 1, 3, 4, 5],
      tabBarListMean: ['全部', '待支付', '待发货', '待收货', '待评价', '已完成'],
      list: [],
      pageNumber: 0,
      pageSize: 10
    }
  }
  componentWillMount() {
    Taro.$page['orderList'] = this
    let type = this.$router.params.type || 100
    // TODO 把所有状态都显示
    this.setState({
      type: type
    })
    this.changeList(type)
    if (this.props.cart.count > 0) {
      Taro.setTabBarBadge({
        index: 3,
        text: `${this.props.cart.count}`
      })
    } else {
      Taro.removeTabBarBadge({
        index: 3
      })
    }
  }

  onPullDownRefresh() {
    this.changeList(this.state.type)
  }

  componentWillUnmount() {
    delete Taro.$page['orderList']
  }

  // 获取列表
  getList() {
    return new Promise(resolve => {
      const nextPage = this.state.pageNumber + 1
      this.setState({
        pageNumber: nextPage
      }, () => {
        this.props.dispatchOrderList({
          pageNumber: this.state.pageNumber,
          pageSize: this.state.pageSize,
          query: {
            orderStatus: this.state.type == 100 ? '' : this.state.type
          }
        }).then( el => {
          let e = el.list
          resolve(e)
        })
      })
    })
  }

  loadMore() {
    if ([3].includes(this.state.loadStyle)) {
      return null
    }
    this.setState({
      loadStyle: 2
    })
    this.getList().then(list => {
      this.setState({
        list: this.state.list.concat(list),
        loadStyle: list && list.length < this.state.pageSize
            ? 3
            : 4
      })
    })
  }

  changeList(key) {
    this.setState({
      loadStyle: 2,
      list: [],
      type: key,
      pageNumber: 0,
      pageSize: 10
    }, () => {
      this.loadMore()
    })
  }

  onReachBottom() {
    this.loadMore()
  }

  getProduct(key) {
    Taro.showModal({
      title: '确认收货',
      content: '请确认你是否收到你的商品',
      cancelText: '取消',
      success: (res) => {
        if(res.confirm) {
          this.props.dispatchConfirmGoods({
            orderId: key
          }).then(() => {
            this.setState({
              list: []
            }, () => {
              this.changeList(this.state.type)
            })
          })
        }
      }
    })
  }

  toPay(id) {
    Taro.showToast({
      title: '支付请求中',
      icon: 'loading',
      mask: true
    })
    if (Taro.$lock['pay']) {
      console.log('锁住了,支付中')
      return
    }
    Taro.$lock['pay'] = true
    this.props.dispatchOrderPay({
      orderId: id
    }).then(res => {
      if (Object.keys(res).length > 0) {
          res.package = res.prepayId
          Taro.requestPayment(res).then(() => {
              this.props.dispatchOrderCallback({
                  orderId: id,
                  status: true
              }).then(() => {
                  this.delLock()
                  Taro.showToast({
                      title: '支付成功',
                      icon: 'success',
                      duration: 1000
                  })
                  this.changeList(this.state.type)
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

  cancel(id) {
    Taro.showModal({
      title: '取消订单',
      content: '是否确定取消订单',
      cancelText: '取消',
      success: res => {
        if (res.confirm) {
          this.props.dispatchCancelOrder({
            orderId: id
          }).then(() => {
            Taro.showToast({
              title: '取消成功',
              icon: 'success',
              duration: 1000
            })
            this.changeList(this.state.type)
          })
        }
      }
    })
  }

  delLock() {
    Taro.hideToast()
    delete Taro.$lock['pay']
  }

  calcLoadStyle () {
    const { loadStyle, list } = this.state

    return loadStyle == 3 && !list.length
      ? 'none'
      : loadStyle
  }

  render () {
      const {list} = this.state

      return (
        <MyPage onReload={this.changeList.bind(this, '')}>
          <Tab
            tabBarList={this.state.tabBarList}
            active={this.state.type}
            onChangeTab={this.changeList.bind(this)}
            tabBarMean={this.state.tabBarListMean}
          />
          <View className='fsc-c mt90'>
            {
              list.map(e => {
                return (
                  <View className='mt15' key={e.id}>
                    <Order
                      order={e}
                      onGetProduct={this.getProduct.bind(this)}
                      onToPay={this.toPay.bind(this)}
                      onCancel={this.cancel.bind(this)}
                    />
                  </View>
                )
              })
            }
          </View>
          <LoadStyle
            loadStyle={this.calcLoadStyle()}
            noneLoad='暂无数据'
          />
        </MyPage>
      )
  }
}

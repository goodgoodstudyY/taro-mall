import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/order'
import MyPage from '../../components/my-page/index'
import Tab from '../../components/tab/tab'
import Order from '../../components/order/order'
import './orderList.scss'

@connect(state => state.order, { ...actions })
export default class Index extends Component {

  config = {
    navigationBarTitleText: '订单列表',
    backgroundColor: '#edeef5',
    navigationBarBackgroundColor: '#f9de1a',
    enablePullDownRefresh: true
  }
  // Taro.$globalData.type 存储订单状态
  constructor(props) {
    super(props)
    this.state = {
      type: 0,
      tabBarList: ['', 0, 1, 3, '4, 5', 6],
      tabBarListMean: ['全部', '待发货', '待收货', '待评价', '已完成'],
      list: [],
      pageNumber: 0,
      pageSize: 10
    }
  }
  componentWillMount() {
    Taro.$page['orderList'] = this
    let type = this.$router.params.type || ''
    if(type == 4) {
      type = '4,5'
    }
    this.setState({
      type: type
    })
    this.changeList(type)
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
        this.props.dispatchOrderList().then( el => {
          let e = el.data.data
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
        list: this.state.list.concat(list)
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
          Taro.$api(this, {
            url: '/customer/order/confirmOrderFinish',
            data: {
              order_id: key
            }
          }, 'GET').then(() => {
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

  calcLoadStyle () {
    const { loadStyle, list } = this.state

    return loadStyle == 3 && !list.length
      ? 'none'
      : loadStyle
  }

  render () {
      const {list} = this.state

      return (
        <MyPage loadStyle={this.calcLoadStyle()} noTab oninit={this.changeList.bind(this, 0)}>
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
                    />
                  </View>
                )
              })
            }
          </View>
        </MyPage>
      )
  }
}

import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { ButtonItem, Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/cart'
import { dispatchOrderList } from '@actions/order'
import { login, getUserToken } from '@utils/request'
import { getWindowHeight } from '@utils/style'
import MyPage from '../../components/my-page/index'
import Empty from './empty'
import List from './list'
import Footer from './footer/index'
import './cart.scss'

@connect(state => state.cart, {...actions, dispatchOrderList})
class Index extends Component {
  config = {
    navigationBarTitleText: '购物车'
  }

  state = {
    loaded: false,
    login: false
  }

  componentDidShow() {
    this.onInit()
    this.getOrderList()
    if (this.props.count > 0) {
      Taro.setTabBarBadge({
        index: 3,
        text: `${this.props.count}`
      })
    } else {
      Taro.removeTabBarBadge({
        index: 3
      })
    }
  }

  onInit() {
    if (Taro.$globalData.token) {
      this.setState({ loaded: true, login: true })
    } else {
      login()
      this.setState({ loaded: true, login: false })
    }
  }

  toLogin = () => {
    Taro.navigateTo({
      url: '/pages/user-login/user-login'
    })
  }

  getPhoneNumber(e) {
    if (e.detail.encryptedData) {
      getUserToken({
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      }).then(() => {
        this.onInit()
      })
    }
  }

  getOrderList() {
    this.props.dispatchOrderList({
      pageNumber: 1,
      pageSize: 10,
      query: {
        orderStatus: 2
      }
    }).then(data => {
      if (data.total > 0) {
        Taro.showToast({
          title: '您还存在待支付订单哦',
          icon: 'none',
          duration: 800
        })
      }
    })
  }

  handleUpdateCart(item) {
    this.props.dispatchCartNum({
      countCornerMark: item.num
    })
    this.props.dispatchAdd(item)
    // this.imputePrice()
  }

  handleUpdateCheck(item) {
    this.props.dispatchUpdateCheck(item)
    // this.imputePrice()
  }

  imputePrice() {
    const cart = this.props.cartInfo
    const checkedCart = cart.filter(x => x.checked == true)
    let num = 0

    console.log(checkedCart, 111111)
  }

  handleCheckedAll(haveChecked) {
    if (haveChecked) {
      this.props.cartInfo.map(x => {
        this.props.dispatchUpdateCheck({
          ...x,
          checked: false
        })
      })
    } else {
      this.props.cartInfo.map(x => {
        this.props.dispatchUpdateCheck({
          ...x,
          checked: true
        })
      })
    }
  }

  render () {
    const { cartInfo, showPageError } = this.props
    // const { cartGroupList = [] } = cartInfo
    // const cartList = cartGroupList.filter(i => !i.promType)
    const isEmpty = !cartInfo.length
    const isShowFooter = !isEmpty

    if (!this.state.loaded) {
      return <Loading />
    }

    if (!this.state.login) {
      return (
        <View className='cart cart--not-login'>
          <Empty text='未登陆' />
          <View className='cart__login'>
            <ButtonItem
              type='primary'
              text='登录'
              // onClick={this.toLogin}
              openType='getPhoneNumber'
              onGetPhoneNumber={this.getPhoneNumber.bind(this)}
              compStyle={{
                background: '#b59f7b',
                borderRadius: Taro.pxTransform(4)
              }}
            />
          </View>
        </View>
      )
    }

    return (
      <MyPage showPageError={showPageError} onReload={this.onInit.bind(this)}>
        <View className='cart'>
          <ScrollView
            scrollY
            className='cart__wrap'
            style={{ height: getWindowHeight() }}
          >
            {isEmpty && <Empty />}

            {/* {!isEmpty && cartInfo.map((group, index) => (
              <List
                key={`${group.promId}_${index}`}
                promId={group.promId}
                promType={group.promType}
                list={group.cartItemList}
                onUpdate={this.props.dispatchUpdate}
                onUpdateCheck={this.props.dispatchUpdateCheck}
              />
            ))} */}
            {
              !isEmpty
              ? (
                <List 
                  list={cartInfo}
                  onUpdate={this.handleUpdateCart.bind(this)}
                  onUpdateCheck={this.handleUpdateCheck.bind(this)}
                />
              )
              : <View></View>
            }

            {isShowFooter &&
              <View className='cart__footer--placeholder' />
            }
          </ScrollView>

          {isShowFooter &&
            <View className='cart__footer'>
              <Footer
                cartInfo={cartInfo}
                onUpdateCheck={this.handleCheckedAll.bind(this)}
              />
            </View>
          }
        </View>
      </MyPage>
    )
  }
}

export default Index

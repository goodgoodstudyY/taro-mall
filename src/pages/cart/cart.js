import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { ButtonItem, ItemList, Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/cart'
import { getWindowHeight } from '@utils/style'
import MyPage from '../../components/my-page/index'
import { login, getUserToken } from '@utils/request'
import Empty from './empty'
import List from './list'
import Footer from './footer'
import './cart.scss'

@connect(state => state.cart, actions)
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
  }

  onInit() {
    // fetch({ url: API_CHECK_LOGIN, showToast: false, autoLogin: false }).then((res) => {
    //   if (res) {
    //     this.setState({ loaded: true, login: true })
    //     this.props.dispatchCart()
    //     this.props.dispatchCartNum()
    //     this.props.dispatchRecommend()
    //   } else {
    //     this.setState({ loaded: true, login: false })
    //   }
    // })
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

  render () {
    const { cartInfo, showPageError } = this.props
    const { cartGroupList = [] } = cartInfo
    const cartList = cartGroupList.filter(i => !i.promType)
    const isEmpty = !cartList.length
    const isShowFooter = !isEmpty || true

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

            {!isEmpty && cartList.map((group, index) => (
              <List
                key={`${group.promId}_${index}`}
                promId={group.promId}
                promType={group.promType}
                list={group.cartItemList}
                onUpdate={this.props.dispatchUpdate}
                onUpdateCheck={this.props.dispatchUpdateCheck}
              />
            ))}

            {/* 相关推荐 */}
            {/* {extList.map((ext, index) => (
              <ItemList key={`${ext.id}_${index}`} list={ext.itemList}>
                <View className='cart__ext'>
                  {!!ext.picUrl && <Image className='cart__ext-img' src={ext.picUrl} />}
                  <Text className='cart__ext-txt'>{ext.desc}</Text>
                </View>
              </ItemList>
            ))} */}

            {isShowFooter &&
              <View className='cart__footer--placeholder' />
            }
          </ScrollView>

          {isShowFooter &&
            <View className='cart__footer'>
              <Footer
                cartInfo={cartInfo}
                onUpdateCheck={this.props.dispatchUpdateCheck}
              />
            </View>
          }
        </View>
      </MyPage>
    )
  }
}

export default Index

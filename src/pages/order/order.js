import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/order'
import { getWindowHeight } from '@utils/style'
import MyPage from '../../components/my-page/index'
import './order.scss'

@connect(state => state.order, { ...actions })
class Order extends Component {
  config = {
    navigationBarTitleText: '我的订单'
  }

  componentDidShow() {
    this.onInit()
  }
  
  onInit() {
    this.props.dispatchOrderList()
  }

  handleLogin = () => {
    Taro.navigateTo({
      url: '/pages/user-login/user-login'
    })
  }

  render () {
    const { userInfo, showPageError } = this.props

    return (
      <MyPage showPageError={showPageError} onReload={this.onInit.bind(this)}>
        <View className='user'>
          <ScrollView
            scrollY
            className='user__wrap'
            style={{ height: getWindowHeight() }}
          >
            {/* <Profile userInfo={userInfo} /> */}
            {/* <Menu /> */}
            {userInfo.login &&
              <View className='user__logout' onClick={this.handleLogin}>
                <Text className='user__logout-txt'>切换账号</Text>
              </View>
            }
            <View className='user__empty' />
          </ScrollView>
          {/* <View className='user__activity'>
            <Activity />
          </View> */}
        </View>
      </MyPage>
    )
  }
}

export default Order

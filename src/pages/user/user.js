import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/user'
import { dispatchCartNum } from '@actions/cart'
import { getWindowHeight } from '@utils/style'
import ListShapeButton from '@components/listShapeButton/index'
import PersonalBlock from '@components/personalBlock/index'
import MyPage from '../../components/my-page/index'
import Profile from './profile'
import './user.scss'

@connect(state => state.user, { ...actions, dispatchCartNum })
class User extends Component {
  config = {
    navigationBarTitleText: '个人中心'
  }

  componentDidShow() {
    this.onInit()
  }

  onInit() {
  }

  handleLogin = () => {
    Taro.navigateTo({
      url: '/pages/user-login/user-login'
    })
  }

  goOrderList(type) {
    Taro.reLaunch({
      url: '/pages/order/order?type=' + type
    })
  }

  toNewPage(page) {
    Taro.navigateTo ({
      url: `/pages/${page}/${page}`
    })
  }

  callPhone () {
    Taro.makePhoneCall ({
      phoneNumber: '18300681922',
    })
  }

  handleContact(e) {
    console.log(e)
  }

  render () {
    const { showPageError } = this.props

    return (
      <MyPage showPageError={showPageError} onReload={this.onInit.bind(this)}>
        <View className='user'>
          <ScrollView
            scrollY
            className='user__wrap'
            style={{ height: getWindowHeight() }}
          >
            <Profile onHaveToken={this.onInit.bind(this)} />
            <View className='order bgc-w'>
              <ListShapeButton
                layout={['border-bottom', 'h100']}
                norenderHeaderIcon='true'
                renderContent={<Text className='fs32 c222 bold'>我的订单</Text>}
                renderTail={<Text className='mr10 fs24 ca9'>全部订单</Text>}
                onClick={this.goOrderList.bind(this, '')}
              />
              <View className='fsc order-bottom'>
                <PersonalBlock
                  layout='order'
                  name='待支付'
                  floatNum='1'
                  onClick={this.goOrderList.bind(this, 0)}
                  renderIcon={<View className='order-icon iconfont'>&#xe709;</View>}
                />
                <PersonalBlock
                  layout='order'
                  name='待发货'
                  floatNum='1'
                  onClick={this.goOrderList.bind(this, 1)}
                  renderIcon={<View className='order-icon iconfont'>&#xe649;</View>}
                />
                <PersonalBlock
                  layout='order'
                  name='待收货'
                  floatNum='1'
                  onClick={this.goOrderList.bind(this, 3)}
                  renderIcon={<View className='order-icon iconfont'>&#xe70a;</View>}
                />
                <PersonalBlock
                  layout='order'
                  name='待评价'
                  floatNum='1'
                  onClick={this.goOrderList.bind(this, 4)}
                  renderIcon={<View className='order-icon iconfont'>&#xe614;</View>}
                />
                <PersonalBlock
                  layout='order'
                  name='已完成'
                  floatNum='1'
                  onClick={this.goOrderList.bind(this, 6)}
                  renderIcon={<View className='order-icon iconfont'>&#xe60f;</View>}
                />
                {/* <PersonalBlock
                  layout='order'
                  name='售后'
                  floatNum='1'
                  onClick={this.goOrderList.bind(this, 0)}
                  renderIcon={<View className='order-icon iconfont'>&#xe604;</View>}
                /> */}
              </View>
            </View>
            
            <View className='order bgc-w'>
                <ListShapeButton
                  layout={['border-bottom', 'h100', 'noTail']}
                  norenderHeaderIcon
                  renderContent={<Text className='fs32 c222 bold'>客户服务</Text>}
                />
                <View className='fsc order-bottom'>
                  <Button openType='contact' onContact={this.handleContact.bind(this)}>
                    <PersonalBlock
                      layout='discount'
                      name='在线客服'
                      // onClick={this.goOrderList.bind(this, 0)}
                      renderIcon={<View className='order-icon iconfont'>&#xe62b;</View>}
                    />
                  </Button>
                  
                  <PersonalBlock
                    layout='discount'
                    name='联系商家'
                    onClick={this.callPhone.bind(this)}
                    renderIcon={<View className='order-icon iconfont'>&#xe628;</View>}
                  />
                  <Button openType='contact' onContact={this.handleContact.bind(this)}>
                    <PersonalBlock
                      layout='discount'
                      name='批量订货咨询'
                      renderIcon={<View className='order-icon iconfont'>&#xe60a;</View>}
                    />
                  </Button>
                  <PersonalBlock
                    layout='discount'
                    name='意见反馈'
                    onClick={this.goOrderList.bind(this, 0)}
                    renderIcon={<View className='order-icon iconfont'>&#xe685;</View>}
                  />
                </View>
              </View>

              <View className='order bgc-w'>
                <ListShapeButton
                  layout={['border-bottom', 'h100', 'noTail']}
                  norenderHeaderIcon
                  renderContent={<Text className='fs32 c222 bold'>常用功能</Text>}
                />
                <View className='more-oneline'>
                  <View className='w25 fcc'>
                    <PersonalBlock
                      name='地址管理'
                      onClick={this.toNewPage.bind(this, 'addressList')}
                      renderIcon={<View className='order-icon iconfont'>&#xe602;</View>}
                    />
                  </View>
                  <View className='w25 fcc'>
                    <PersonalBlock
                      name='关于我们'
                      onClick={this.toNewPage.bind(this, 'shopInfo')}
                      renderIcon={<View className='order-icon iconfont'>&#xe654;</View>}
                    />
                  </View>
                  <View className='w25 fcc'>
                    <PersonalBlock
                      name='切换账号'
                      onClick={this.toNewPage.bind(this, 'user-login-email')}
                      renderIcon={<View className='order-icon iconfont'>&#xe653;</View>}
                    />
                  </View>
                </View>
              </View>
            <View className='user__empty' />
          </ScrollView>
        </View>
      </MyPage>
    )
  }
}

export default User

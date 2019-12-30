import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image, OpenData } from '@tarojs/components'
import { login, getUserToken } from '../../../utils/request'
import Vip from './vip'
import bg from './assets/bg.png'
import './index.scss'

export default class Profile extends Component {
  static defaultProps = {
    userInfo: {},
    onHaveToken: () => {}
  }

  static state = {
    token: ''
  }

  componentWillMount() {
    this.needLogin()
  }

  needLogin() {
    if (!Taro.$globalData.token) {
      login()
    } else {
      this.setState({
        token: Taro.$globalData.token
      })
    }
  }

  handleLogin(e) {
    if (e.detail.encryptedData) {
      getUserToken({
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
      }).then(() => {
        this.props.onHaveToken()
        this.needLogin()
      })
    }
  }

  render () {
    const { token } = this.state

    return (
      <View className='user-profile'>
        <Image
          className='user-profile__bg'
          src={bg}
          mode='widthFix'
        />

        <View className='user-profile__wrap'>
          <View className='user-profile__avatar'>
            <OpenData type='userAvatarUrl' onClick={this.handleLogin} />
            {/* <Image
              className='user-profile__avatar-img'
              src={userInfo.avatar || defaultAvatar}
              onClick={this.handleLogin}
            /> */}
          </View>

          <View className='user-profile__info'>
            <OpenData type='userNickName' />
            {token ?
              <View className='user-profile__info-wrap'>
                {/* XXX 没有全部 level 对应的图标，暂时都用 v1 */}
                {/* <Image className='user-profile__info-level' src={level01} />
                <Text className='user-profile__info-uid'>
                  {this.getUid(userInfo.uid)}
                </Text> */}
              </View> :
              <Button className='user-profile__info-tip' openType='getPhoneNumber' onGetPhoneNumber={this.handleLogin}>点击登录账号</Button>
            }
          </View>

          <Vip />
        </View>
      </View>
    )
  }
}

import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, OpenData } from '@tarojs/components'
import defaultAvatar from '@assets/default-avatar.png'
import Vip from './vip'
import bg from './assets/bg.png'
import qrCode from './assets/qr-code.png'
import level01 from './assets/level-01.png'
import './index.scss'

export default class Profile extends Component {
  static defaultProps = {
    userInfo: {}
  }

  handleLogin = () => {
    if (!this.props.userInfo.login) {
      Taro.navigateTo({
        url: '/pages/user-login/user-login'
      })
    }
  }

  getUid = (uid) => {
    if (!uid || !/@/.test(uid)) {
      return ''
    }
    const [username, suffix] = uid.split('@')
    const firstLetter = username[0]
    const lastLetter = username[username.length - 1]
    return `${firstLetter}****${lastLetter}@${suffix}`
  }

  render () {
    const { userInfo } = this.props

    return (
      <View className='user-profile'>
        {/* // NOTE 背景图片：Image 标签 + position absolute 实现 */}
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

          <View className='user-profile__info' onClick={this.handleLogin}>
            <OpenData type='userNickName' />
            {/* <Text className='user-profile__info-name'>
              {userInfo.login ? userInfo.nickname : '未登录'}
            </Text> */}
            {userInfo.login ?
              <View className='user-profile__info-wrap'>
                {/* XXX 没有全部 level 对应的图标，暂时都用 v1 */}
                {/* <Image className='user-profile__info-level' src={level01} />
                <Text className='user-profile__info-uid'>
                  {this.getUid(userInfo.uid)}
                </Text> */}
              </View> :
              <Text className='user-profile__info-tip'>点击登录账号</Text>
            }
          </View>

          <Vip />
        </View>
      </View>
    )
  }
}

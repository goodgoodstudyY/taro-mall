import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import gift from './assets/gift.png'
import right from './assets/right.png'
import './index.scss'

export default class Vip extends Component {
  state = {
    x: 0
  }
  timer = null
  count = 0

  static options = {
    addGlobalClass: true
  }
  componentDidMount() {
    this.animate()
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  animate = () => {
    this.timer = setTimeout(() => {
      if (this.state.x === 0 || this.state.x === -15) {
        this.count += 1
      }
      this.setState({ x: this.state.x + (this.count % 2 ? -1 : 1) })
      if (this.count <= 6) {
        this.animate()
      }
    }, 20)
  }

  getAnimateStyle = () => {
    if (process.env.TARO_ENV === 'rn') {
      return { transform: [{ translateX: this.state.x }] }
    }
    return { transform: `translateX(${Taro.pxTransform(this.state.x)})` }
  }

  goAddressList() {
    Taro.navigateTo({
      url: '/pages/addressList/addressList'
    })
  }

  render () {
    return (
      <View
        className='user-profile-vip'
        style={this.getAnimateStyle()}
        onClick={this.goAddressList}
      >
        <View className='iconfont ml20 cd3c'>&#xe75c;</View>
        <View className='user-profile-vip__desc'>
          <Text className='user-profile-vip__desc-txt'>收货地址</Text>
        </View>
      </View>
    )
  }
}

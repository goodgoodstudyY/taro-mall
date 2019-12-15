import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image, Text, OpenData} from '@tarojs/components'

import './index.scss'

export default class  LoginTemplate extends Component{
  constructor(props){
    super(props)
  }

  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    layout: '',
    onGetPhoneNumber: () => {},
    onCloseMark: () => {}
  }

  componentWillMount () {
  }

  stopPropagation (e) {
    e.stopPropagation()
  }

  calcelScroll (e) {
    e.stopPropagation()
    e.preventDefault()
  }

  getPhoneEncryption(e){
    if(e.detail.encryptedData){
      this.props.onGetPhoneNumber && this.props.onGetPhoneNumber(e)
    }
  }

  closeMark (e) {
    e.stopPropagation()
    if (this.props.layout.includes('closeMark')) {
      this.props.onCloseMark()
    } else {
      this.props.onGetPhoneNumber()
    }
  }
  render () {

    return (
      <View>
        <View class='mark' onTouchMove={this.calcelScroll} onClick={this.closeMark.bind(this)}>
          <View className='main'>
              <View className='main_title'>授权申请</View>
              <View className='main_icon'>
                <Image src='https://weapp-1253522117.image.myqcloud.com//image/20190311/9c29961c6910dc02.png' className='img'></Image>
                <Text class='iconfont fs34'>&#xe73e;</Text>
                <View class='img'>
                  <OpenData type='userAvatarUrl' />
                </View>
              </View>
              <View className='main_word'>
                <View>小程序申请获得您的手机号</View>
                <View>获取后可查看更多功能</View>
              </View>
              <View className='main_bottom'>
                <Button className='no-login'>暂不授权</Button>
                <Button
                  className='login'
                  openType='getPhoneNumber'
                  lang='zh_CN'
                  onGetPhoneNumber={this.getPhoneEncryption}
                  onClick={this.stopPropagation}
                >
                  立即授权
                </Button>
              </View>
          </View>
          </View>
      </View>
    )
  }
}
 
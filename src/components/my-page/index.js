import Taro, { Component } from '@tarojs/taro'
import { Block, View, Image, Text } from '@tarojs/components'
import loadFail from '@assets/load_fail.png'

import './index.scss'

export default class MyPage extends Component {

  constructor(props) {
    super(props);
  }
  static options = {
    addGlobalClass: true
  }
  static defaultProps = {
    homeback: false,
    showPageError: false
  }

  componentWillMount(){
  }
  componentDidMount () {
  }
  componentWillReceiveProps () {
  }

  goBack() {
    Taro.reLaunch({
      url: '/pages/home/home'
    })
  }
  render () {
    const { homeback, showPageError } = this.props

    return (
      <Block>
        <View className='buttonForGettingFormId'>
          {
            homeback == true ? (
              <View className='fixed home-button mt14' onClick={this.goBack}>
                <View className='mt14'>
                  <Image className='home-icon' src='https://weapp-1253522117.image.myqcloud.com//image/20190314/4db5ed3691928df8.png' />
                </View>
                <View className='cfff fs19 lh21'>
                  <Text>首页</Text>
                </View>
              </View>
            ) : null
          }
        </View>

        {/** 请求关键数据接口报错时, 页面需要重新加载 */}
        {
          showPageError ? (
            <View className='page covered fsc-c'>
              <View className='mt160'>
                <Image src={loadFail} className='img' />
              </View>
              <View className='c999 fs28 mt80'>加载失败啦，点击重新加载吧！</View>
              <View className='btn mt100' onClick={this.reload.bind(this)}>重新加载</View>
              {
                homeback == true &&
                <View className='fixed home-button' onClick={this.goBack}>
                  <View className='mt14'>
                    <Image className='home-icon' src='https://weapp-1253522117.image.myqcloud.com//image/20190314/4db5ed3691928df8.png' />
                  </View>
                  <View className='cf f18 lh21'>
                    <Text>店铺</Text>
                  </View>
                </View>
              }
            </View>
          ) : this.props.children
        }
      </Block>
    )
  }

  reload () {
    this.props.onReload && this.props.onReload()
  }

}

import Taro, { Component } from '@tarojs/taro'
// eslint-disable-next-line no-unused-vars
import { View, Text, Image } from '@tarojs/components'

/** 页面组件, 组件, 装饰器引入 */
import MyPage from '../../components/my-page/index'

/** 样式引入 */
import './shopInfo.scss'

/** 资源文件, 配置引入 */

export default class xPage extends Component {

  config = {
    navigationBarTitleText: '关于我们'
  }

  state = {
  }
  store = {
  }

  componentWillMount () {
  }
  render () {
    return (
      <MyPage>
        <View className='fs36 c222 title'>包装公司简介</View>
        <View className='fs30 c333'>我也不知道介绍什么 随便说 我们公司非常nb 包装便宜质量好 最重要的是什么都好商量 买商品呀 快来呀</View>
        <View className='fcc'>
        <Image src='https://weapp-1253522117.image.myqcloud.com//image/20191212/761dd8438b4a5dff.png?imageView2/1/w/500/h/500' className='img' />
        </View>
      </MyPage>
    )
  }

}

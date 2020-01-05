import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import './index.scss'

export default class LoadStyle extends Component {

  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    fixed: false,
    styles: {},
    imageUrl: '',
    loadingIcon: 'https://weapp-1253522117.image.myqcloud.com//image/20190125/b2f9b58dac6c0819.gif',
    loadStyle: 'hide',    // loading / loadMore / loadOver / none
    noneLoad: '暂无数据'
  }

  state = {
    localLoadStyle: ''
  }

  componentWillMount () {
    if (this.props) {
      this.resetLoadStyle(this.props.loadStyle)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { loadStyle } = nextProps

    this.resetLoadStyle(loadStyle)
  }
  resetLoadStyle (loadStyle) {
    const numberStateReflex = {
      0: 'hide',
      1: 'hide',
      2: 'loading',
      3: 'loadOver',
      4: 'loadMore',
      5: 'none'
    }
    const state = numberStateReflex[loadStyle]

    this.setState({
      localLoadStyle: state || loadStyle
    })
  }

  render () {
    const { localLoadStyle } = this.state
    const { styles, loadingIcon, fixed, noneLoad, goodsType } = this.props // goodsType ? 什么玩意儿

    return (
      <View
        className='component loading-info-component fcc pdc'
        style={{...styles}}
      >

        {
          localLoadStyle === 'loadMore' && (
            <View className='fs24 c999'>- 加载更多 -</View>
          )
        }
        {
          localLoadStyle === 'loadOver' && (
            <View className='fs24 c999'>- 没有更多咯 -</View>
          )
        }
        {
          ['loading', 'none'].includes(localLoadStyle) && (
            <View className='fcc-c'>
              <Image className={`image-default image-${localLoadStyle}`} mode='widthFix' src='https://weapp-1253522117.image.myqcloud.com//image/20190118/9fc3e61416a0f41c.png' />
              {
                localLoadStyle === 'loading' && (
                  <Image className='load-icon' mode='aspectFill' src={loadingIcon} />
                )
              }
              <View className={'text-default fs24 c999 fcc-c' + ` text-${localLoadStyle}`}>
                {
                  noneLoad.split('\n').map((x) => {
                    return (
                      <Text className='info-text-inner' key={x}>{x}</Text>
                    )
                  })
                }
              </View>
            </View>
          )
        }
      </View>
    )
  }
}

import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { crop } from '../../../utils/util'
import './index.scss'

export default class Spec extends Component {

  constructor(props) {
    super(props);
    this.state = {
        num: 1,
        goodsInfo: {},
        show: false
    }
  }

  static defaultProps = {
    goodsInfo: null,
    mode: '',
    onAddToCart: () => {}
  }

  static options = {
    addGlobalClass: true
  }

  componentWillReceiveProps(nextProps) {
    const { showSpec, mode, data } = nextProps;
    
    this.setState({
        goodsInfo: data,
        show: showSpec,
        mode
    });
  }

  handleHide() {
    this.setState({
        show: false,
        num: 1
    });
}

  discrement() {
    this.setState({
      num: this.state.num > 1 ? this.state.num - 1 : 1
    })
  }

  increment() {
    this.setState({
      num: this.state.num + 1
    })
  }

  addToCart() {
    const item = {
      ...this.state.goodsInfo,
      num: this.state.num
    }
    this.props.onAddToCart(item)
  }

  render() {
    const { num, goodsInfo, mode, show } = this.state;

    return (
      <View>
        {
          show && (
            <View className='spec-cover' onClick={this.handleHide.bind(this)}></View>
          )
        }
        <View className={`spec-form bgc-w ${show ? '' : 'spec-form-hidden'}`}>
        <View className='spec-goods-item bgc-w fsc'>
            <Image mode='aspectFill' className='spec-goods-thumb f-s-0' src={crop(goodsInfo.smallPic, 140)}></Image>
            <View className='spec-goods-info f1'>
            <View className='spec-goods-title fs30 c1a ellipsis2'>{goodsInfo.name}</View>
                <View className='spec-goods-salesVolume fs24 c999'>销量{goodsInfo.sales || 0}</View>
                <View className='spec-goods-price'>
                    <Text className='fs20 c-red'>￥</Text>
                    <Text className='fs30 c-red'>{goodsInfo.price}</Text>
                </View>
            </View>
            <View className='spec-form-close fcc iconfont' onClick={this.handleHide.bind(this)}>&#xe652;</View>
        </View>
        <View className='spec-num fsbc'>
            <View className=''>购买数量</View>
            <View className='spec-numCtrl fcc'>
                <View className='spec-discrement-layout' onClick={this.discrement.bind(this)}>
                    <View className='spec-discrement-bg fcc'>
                        <Image className='spec-discrement' mode='aspectFill' src='https://weapp-1253522117.image.myqcloud.com//image/20190318/9b4ee6ca0bd7fafb.png'></Image>
                    </View>
                </View>
                <View className='fs36 c000'>{num}</View>
                <View className='spec-increment-layout' onClick={this.increment.bind(this)}>
                    <View className='spec-increment-bg'>
                        <Image className='spec-increment' mode='aspectFill' src='https://weapp-1253522117.image.myqcloud.com//image/20190318/d490bd5578fc447b.png'></Image>
                    </View>
                </View>
            </View>
        </View>
        <View className='spec-button-layout fcc'>
            {
                goodsInfo.all_total < 1 ? (
                    <View className='spec-button-disabled fcc fs32 cfff'>商品已售罄</View>
                ) : mode === 'cart' ? (
                    <View className='spec-button fcc fs32 cfff' onClick={this.addToCart.bind(this)}>加入购物车</View>
                ) : mode === 'spec' ? (
                    <View className='spec-buttonGroup-layout fsbc'>
                        <View className='spec-button-cart-slim' onClick={this.addToCart.bind(this)}>加入购物车</View>
                        <View className='spec-button-create-slim' onClick={this.createOrder.bind(this)}>立即购买</View>
                    </View>
                ) : (
                        <View className='spec-button fcc fs32 cfff' onClick={this.createOrder.bind(this)}>立即购买</View>
                    )
            }
        </View>
    </View>
      </View>
    )
  }
}
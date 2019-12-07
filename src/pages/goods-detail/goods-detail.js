import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image, Button, Text } from '@tarojs/components'
import { Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/cate'
import MyPage from '../../components/my-page/index'
import { crop } from '../../utils/util'
import './cate.scss'

@connect(state => state.cate, { ...actions })
class Cate extends Component {
  config = {
    navigationBarTitleText: '商品详情'
  }

  state = {
    goodsId: 0,
    loaded: false,
    loading: false
  }

  componentDidMount() {
    this.setState({
      goodsId: this.$router.params.id
    }, () => {
      this.onInit()
    })
  }

  onInit() {
    this.props.dispatchGoodsDetail(this.state.goodsId).then((res) => {
      res.descPic = res.descPic.split(',')
      res.smallPic = res.smallPic.split(',')
      this.setState({
        loaded: true,
        goodsDetail: res
      })
    })
  }

  handleMenu = (index) => {
    this.setState({ loading: true }, () => {
      this.setState({ loading: false })
    })
  }

  render () {
    const { showPageError } = this.props
    const { loading, goodsDetail } = this.state

    if (!this.state.loaded) {
      return <Loading />
    }

    return (
      <MyPage showPageError={showPageError} onReload={this.onInit.bind(this)}>
        <View className='goods-swiper-layout'>
          <Swiper className='goods-swiper' interval={2600} circular autoplay>
              {
                  goodsDetail.smallPic.map((i, n) => {
                      return (
                          <SwiperItem key={n}>
                              <View className='goods-swiper-item fcc'>
                                  <Image className='goods-swiper-item-image' mode='aspectFill' src={crop(i, 702, 690)} onClick={this.handlePreviewImage.bind(this, n)}></Image>
                              </View>
                          </SwiperItem>
                      )
                  })
              }
          </Swiper>
        </View>
        <View className='goods-info-layout fcc-c'>
            <View className='goods-info flex r'>
                <View className='goods-title flex fs42 c1a bold ellipsis2'>{goodsDetail.name}</View>
                <Button openType='share' className='goods-share iconfont' hoverClass='none'>&#xe657;</Button>
            </View>
            {/* {
                data.goods_detail_decode[0].data && data.goods_detail_decode[0].type == 'text'
                && (
                    <View className='goods-info flex r mt30'>
                        <Text className='flex c9 f24 w506'>{data.goods_detail_decode[0].data}</Text>
                    </View>
                )
            } */}
            <View className='goods-info flex r mt22'>
                <View className='flex c999 fs24'>销量{goodsDetail.sales}</View>
            </View>
            <View className='goods-info flex r spb mt26'>
                <View className='flex c-r base l44'>
                    <Text className='fs24'>¥</Text>
                    <Text className='fs44'>{goodsDetail.price}</Text>
                </View>
                <View className='flex cf fs28 btn mr30' onClick={this.handleSubmit.bind(this, 'cart')}><View className='iconfont cf f28'>&#xe604;加入购物车</View></View>
            </View>
        </View>
      </MyPage>
    )
  }
}

export default Cate

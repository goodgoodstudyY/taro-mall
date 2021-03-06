import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image, Text, ScrollView, Button } from '@tarojs/components'
import { Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/cate'
import { dispatchAdd, dispatchCartNum } from '@actions/cart'
import MyPage from '../../components/my-page/index'
import SpecComponent from './spec'
import { crop, shareAppMessage } from '../../utils/util'
import './goods-detail.scss'

@connect(state => state.cate, { ...actions, dispatchAdd, dispatchCartNum })
class Cate extends Component {
  config = {
    navigationBarTitleText: '商品详情'
  }

  state = {
    goodsId: 0,
    loaded: false,
    loading: false,
    showParams: false,
    addToCart: {},
    showSpec: false
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
      let picture = []
      res.descPic = res.descPic && res.descPic.split(',')
      picture.push(res.smallPic)
      res.picture = picture.concat(res.descPic)
      this.setState({
        loaded: true,
        goodsDetail: res
      })
    })
  }

  handleOpenParams(e) {
    e.stopPropagation()
    this.setState({
      showParams: !this.state.showParams
    })
  }

  handleSubmit(mode = '') {
    this.setState({
      addToCart: mode,
      showSpec: true
    });
  }

  addToCart(item) {
    this.props.dispatchAdd(item)
    this.props.dispatchCartNum({
      countCornerMark: item.num,
      notUpdateNum: true
    })
    Taro.showToast({
      title: '添加成功',
      duration: 1000,
      icon: 'success'
    })
    this.setState({
      showSpec: false
    })
  }

  closeSpec() {
    this.setState({
      showSpec: false
    })
  }

  goHome() {
    Taro.reLaunch({
      url: '/pages/home/home'
    })
  }

  onShareAppMessage() {
    const {
      id,
      name
    } = this.state.goodsDetail;
    return shareAppMessage(`/pages/goods-detail/goods-detail?id=${id}`, name);
  }

  render () {
    const { showPageError } = this.props
    const { goodsDetail, showParams, showSpec, addToCart } = this.state
    if (!this.state.loaded) {
      return <Loading />
    }

    return (
      <MyPage showPageError={showPageError} onReload={this.onInit.bind(this)}>
        <View className='fsc-c bgc-f5 min-h100'>
          <View className='goods-swiper-layout'>
            <Swiper className='goods-swiper' interval={2600} circular autoplay>
                {
                    goodsDetail.picture.map((i, n) => {
                        return (
                            <SwiperItem key={i}>
                                <View className='goods-swiper-item fcc'>
                                    <Image className='goods-swiper-item-image' mode='aspectFill' src={crop(i, 702, 690)} onClick={this.handlePreviewImage.bind(this, n)}></Image>
                                </View>
                            </SwiperItem>
                        )
                    })
                }
            </Swiper>
          </View>
          <View className='goods-info-layout fss'>
            <View className='goods-info f1'>
              <View className='goods-title fs38 c1a bold ellipsis2'>{goodsDetail.name}</View>
              <View className='fs24 c999 marginBottom26'>销量{goodsDetail.fakeSale || 0}</View>
              <View className='goods-price fs40 c-red'>
                <Text className='fs24'>￥</Text>
                {goodsDetail.realPrice || goodsDetail.price}
                {
                  goodsDetail.realPrice < goodsDetail.price
                  ? <Text className='ml30 line-through c999 fs24'>¥{goodsDetail.price}</Text>
                  : <Text></Text>
                }
              </View>
              <View className='fs28 mt14 c1a'>{goodsDetail.description}</View>
            </View>
            <Button openType='share' className='goods-share iconfont fs28' hoverClass='none'>&#xe657;</Button>
          </View>
          <View className='goods-detail bgc-w goods-params fsbc' onClick={this.handleOpenParams}>
            <Text className='fs32 c1a'>产品参数</Text>
            <View className='iconfont fs28'>&#xe662;</View>
          </View>
          {
            goodsDetail.descPic.length > 0 && (
              <View className='goods-detail mb100 bgc-w'>
                  <View className='goods-detail-title fs32 c1a'>商品详情</View>
                  <View className='fs28 c666 ml24 lh40 mb20'>{goodsDetail.descriptionDetails || ''}</View>
                  {
                    goodsDetail.descPic.map((i, n) => {
                        return (
                          <Image key={i} src={'http://122.51.167.221:8001' + i} mode='widthFix' className='goods-detail-image' />
                        )
                    })
                  }
              </View>
            )
          }
        </View>
        {
          showParams
          ? (
            <View className='mark fce' onClick={this.handleOpenParams}>
              <View className='params'>
                <View className='fs36 fcc c1a bold params-title'>产品参数</View>
                <ScrollView className='params-content' scrollY>
                  <View className='fsbc params-item'>
                    <Text className='fs30 c1a'>商品体积（立方）</Text>
                    <Text className='c999 fs30'>{goodsDetail.size || 0}</Text>
                  </View>
                  {/* <View className='fsbc params-item'>
                    <Text className='fs30 c1a'>规格说明</Text>
                    <Text className='c999 fs30'>{goodsDetail.standard || ''}</Text>
                  </View> */}
                  <View className='fsbc params-item'>
                    <Text className='fs30 c1a'>单位</Text>
                    <Text className='c999 fs30'>{goodsDetail.unit || ''}</Text>
                  </View>
                  <View className='fsbc params-item'>
                    <Text className='fs30 c1a'>商品质量（千克）</Text>
                    <Text className='c999 fs30'>{goodsDetail.weight || 0}</Text>
                  </View>
                </ScrollView>
                <View className='params-button fcc cfff fs34' onClick={this.handleOpenParams}>完成</View>
              </View>
            </View>
          )
          : <View></View>
        }
        <View className='goods-buttons-layout fsbc'>
          <View className='fsc-c ml20' onClick={this.goHome}>
            <Text className='iconfont fs46'>&#xe609;</Text>
            <Text className='fs20'>首页</Text>
          </View>
          <View className='fsc'>
            <View className='goods-button-1 c-red fcc fs32' onClick={this.handleSubmit.bind(this, 'cart')}>加入购物车</View>
            <View className='goods-button-2 cfff fcc fs32' onClick={this.handleSubmit.bind(this)}>立即购买</View>
          </View>
        </View>
        <SpecComponent data={goodsDetail} mode={addToCart} showSpec={showSpec} onAddToCart={this.addToCart.bind(this)} onClosePop={this.closeSpec.bind(this)} />
      </MyPage>
    )
  }
}

export default Cate

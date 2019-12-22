import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Button } from '@tarojs/components'
import { Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/home'
import { dispatchCartNum } from '@actions/cart'
import { getWindowHeight } from '@utils/style'
import { login, getToken, getUserToken } from '@utils/request'
import Banner from './banner'
import MyPage from '../../components/my-page/index'
import GetPhone from '../../components/getPhone/index'
import searchIcon from '../../assets/search.png'
import './home.scss'

@connect(state => {return {home: state.home, user: state.user}}, { ...actions, dispatchCartNum })
class Home extends Component {
  config = {
    navigationBarTitleText: '包装定制'
  }

  state = {
    loaded: false,
    loading: false,
    lastItemId: 0,
    hasMore: true,
    getPhone: true,
    banner: [
      'https://weapp-1253522117.image.myqcloud.com//image/20190828/099b702e00c4b94a.png',
      'https://weapp-1253522117.image.myqcloud.com//image/20190828/099b702e00c4b94a.png',
      'https://weapp-1253522117.image.myqcloud.com//image/20190828/099b702e00c4b94a.png',
    ]
  }

  componentDidMount() {
    getToken().then(() => {
      if (Taro.$globalData.token) {
        this.setState({
          getPhone: false
        })
      } else {
        login()
      }
    })
    
    this.onInit()
  }

  onInit() {
    this.setState({ loaded: true })
    // this.props.dispatchHome().then(() => {
    //   this.setState({ loaded: true })
    // })
    // this.props.dispatchCartNum()
    // this.props.dispatchSearchCount()
    // this.props.dispatchPin({ orderType: 4, size: 12 })
    // this.loadRecommend()
  }

  loadRecommend = () => {
    if (!this.state.hasMore || this.state.loading) {
      return
    }

    const payload = {
      lastItemId: this.state.lastItemId,
      size: RECOMMEND_SIZE
    }
    this.setState({ loading: true })
    this.props.dispatchRecommend(payload).then((res) => {
      const lastItem = res.rcmdItemList[res.rcmdItemList.length - 1]
      this.setState({
        loading: false,
        hasMore: res.hasMore,
        lastItemId: lastItem && lastItem.id
      })
    }).catch(() => {
      this.setState({ loading: false })
    })
  }

  handlePrevent = () => {
    Taro.navigateTo({
      url: '/pages/search-goods/search-goods'
    })
  }

  handleCloseMark() {
    this.setState({
      getPhone: false
    })
  }

  handleGetPhone(e) {
    getUserToken({
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
    })
    this.setState({
      getPhone: false
    })
  }

  callPhone () {
    Taro.makePhoneCall ({
      phoneNumber: '18300681922',
    })
  }

  handleContact(e) {
    console.log(e)
  }

  render () {
    if (!this.state.loaded) {
      return <Loading />
    }

    const { showPageError } = this.props.home
    const { getPhone, banner } = this.state

    return (
      <MyPage showPageError={showPageError} onReload={this.onInit.bind(this)}>
        <View className='home'>
          <View className='home__search'>
            <View className='home__search-wrap' onClick={this.handlePrevent}>
              <Image className='home__search-img' src={searchIcon} />
              <Text className='home__search-txt'>搜索商品</Text>
            </View>
          </View>
          <ScrollView
            scrollY
            className='home__wrap'
            // onScrollToLower={this.loadRecommend}
            style={{ height: getWindowHeight() }}
          >
            <View onClick={this.handlePrevent}>
              <Banner list={banner} />
            </View>

            <View className='fcs fw mt20'>
              <Image src='https://weapp-1253522117.image.myqcloud.com//image/20191202/508bd76cf5e61581.png?imageView2/1/w/200/h/200' className='img' />
              <Image src='https://weapp-1253522117.image.myqcloud.com//image/20191202/508bd76cf5e61581.png?imageView2/1/w/200/h/200' className='ml20 img' />
              <Image src='https://weapp-1253522117.image.myqcloud.com//image/20191202/508bd76cf5e61581.png?imageView2/1/w/200/h/200' className='ml20 img' />
              <Image src='https://weapp-1253522117.image.myqcloud.com//image/20191202/508bd76cf5e61581.png?imageView2/1/w/200/h/200' className='img' />
              <Image src='https://weapp-1253522117.image.myqcloud.com//image/20191202/508bd76cf5e61581.png?imageView2/1/w/200/h/200' className='ml20 img' />
              <Image src='https://weapp-1253522117.image.myqcloud.com//image/20191202/508bd76cf5e61581.png?imageView2/1/w/200/h/200' className='ml20 img' />
            </View>

            <View className='footer'>
              <Image src='https://weapp-1253522117.image.myqcloud.com//image/20190828/099b702e00c4b94a.png?imageView2/1/w/750/h/200' className='footer-img' />
            </View>

            {/* {this.state.loading &&
              <View className='home__loading'>
                <Text className='home__loading-txt'>正在加载中...</Text>
              </View>
            }
            {!this.state.hasMore &&
              <View className='home__loading home__loading--not-more'>
                <Text className='home__loading-txt'>更多内容，敬请期待</Text>
              </View>
            } */}
          </ScrollView>
        </View>
        {
          getPhone
          ? (
            <GetPhone layout='closeMark' onCloseMark={this.handleCloseMark.bind(this)} onGetPhoneNumber={this.handleGetPhone.bind(this)} />
          )
          : <View></View>
        }

        <Button className='fixed-button contact-service fcc' openType='contact' onContact={this.handleContact.bind(this)}>
          <View className='iconfont cfff fs56'>&#xe62b;</View>
        </Button>
        <View className='fixed-button call-business fcc' onClick={this.callPhone.bind(this)}>
          <View className='iconfont cfff fs56'>&#xe628;</View>
        </View>
      </MyPage>
    )
  }
}

export default Home

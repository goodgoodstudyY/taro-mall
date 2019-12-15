import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/home'
import { dispatchCartNum } from '@actions/cart'
import { dispatchLogin } from '@actions/user'
import { getWindowHeight } from '@utils/style'
import Banner from './banner'
import MyPage from '../../components/my-page/index'
import GetPhone from '../../components/getPhone/index'
import Recommend from './recommend'
import searchIcon from '../../assets/search.png'
import './home.scss'

const RECOMMEND_SIZE = 20

@connect(state => {return {home: state.home, user: state.user}}, { ...actions, dispatchLogin, dispatchCartNum })
class Home extends Component {
  config = {
    navigationBarTitleText: '包装定制'
  }

  state = {
    loaded: false,
    loading: false,
    lastItemId: 0,
    hasMore: true,
    getPhone: true
  }

  componentDidMount() {
    this.onInit()
  }

  onInit() {
    this.props.dispatchHome().then(() => {
      this.setState({ loaded: true })
    })
    this.props.dispatchCartNum()
    this.props.dispatchSearchCount()
    this.props.dispatchPin({ orderType: 4, size: 12 })
    this.loadRecommend()
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
    this.props.dispatchLogin({
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      sessionKey: Taro.$globalData.sessionKey
    }).then((res) => {
      this.setState({
        getPhone: false
      })
      Taro.$globalData.token = res
      Taro.setStorageSync('loginInfo', {
        'sessionKey': Taro.$globalData.sessionKey,
        'token': res,
        'expire_time': Date.parse(new Date()) + 4.5 * 24 * 60 * 60 * 1000,
      })
    })
  }

  render () {
    if (!this.state.loaded) {
      return <Loading />
    }

    const { homeInfo, recommend, showPageError } = this.props.home
    const { getPhone } = this.state

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
            onScrollToLower={this.loadRecommend}
            style={{ height: getWindowHeight() }}
          >
            <View onClick={this.handlePrevent}>
              <Banner list={homeInfo.focus} />
            </View>

            {/* 为你推荐 */}
            <Recommend list={recommend} />

            {this.state.loading &&
              <View className='home__loading'>
                <Text className='home__loading-txt'>正在加载中...</Text>
              </View>
            }
            {!this.state.hasMore &&
              <View className='home__loading home__loading--not-more'>
                <Text className='home__loading-txt'>更多内容，敬请期待</Text>
              </View>
            }
          </ScrollView>
        </View>
        {
          getPhone
          ? (
            <GetPhone layout='closeMark' onCloseMark={this.handleCloseMark.bind(this)} onGetPhoneNumber={this.handleGetPhone.bind(this)} />
          )
          : <View></View>
        }
      </MyPage>
    )
  }
}

export default Home

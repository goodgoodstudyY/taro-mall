import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/home'
import { dispatchCartNum } from '@actions/cart'
import { getWindowHeight } from '@utils/style'
import Banner from './banner'
import MyPage from '../../components/my-page/index'
import Recommend from './recommend'
import searchIcon from '../../assets/search.png'
import './home.scss'

const RECOMMEND_SIZE = 20

@connect(state => state.home, { ...actions, dispatchCartNum })
class Home extends Component {
  config = {
    navigationBarTitleText: '包装定制'
  }

  state = {
    loaded: false,
    loading: false,
    lastItemId: 0,
    hasMore: true
  }

  componentDidMount() {
    Taro.login().then(res => {
      console.log(res, 1111)
    })
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

  render () {
    if (!this.state.loaded) {
      return <Loading />
    }

    const { homeInfo, recommend, showPageError } = this.props
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
      </MyPage>
    )
  }
}

export default Home

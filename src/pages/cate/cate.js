import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/cate'
import { getWindowHeight } from '@utils/style'
import MyPage from '../../components/my-page/index'
import Menu from './menu'
import List from './list'
import Banner from './banner'
import searchIcon from '../../assets/search.png'
import './cate.scss'

@connect(state => state.cate, { ...actions })
class Cate extends Component {
  config = {
    navigationBarTitleText: '分类'
  }

  state = {
    current: 0,
    loaded: false,
    loading: false
  }

  componentDidMount() {
    this.onInit()
  }

  onInit() {
    this.props.dispatchMenu()
    this.props.dispatchTagMenu().then((res) => {
      this.setState({
        loaded: true
      })
    })
  }

  handleMenu = (index) => {
    this.setState({ loading: true }, () => {
      this.setState({ current: index, loading: false })
    })
  }

  render () {
    const { menu, category, showPageError, tagMenu } = this.props
    const { current, loading } = this.state
    const currentCategory = category.find(item => item.id === current) || {}
    const banner = currentCategory.focusBannerList || []
    const list = currentCategory.categoryGroupList || []
    const height = getWindowHeight()
    const allMenu = tagMenu.concat(menu)

    if (!this.state.loaded) {
      return <Loading />
    }

    return (
      <MyPage showPageError={showPageError} onReload={this.onInit.bind(this)}>
        <View className='cate'>
          <View className='home__search'>
            <View className='home__search-wrap' onClick={this.handlePrevent}>
              <Image className='home__search-img' src={searchIcon} />
              <Text className='home__search-txt'>
                {`搜索商品`}
              </Text>
            </View>
          </View>
          <ScrollView
            scrollY
            className='cate__menu'
            style={{ height: `calc(${height} - ${Taro.pxTransform(76)})` }}
          >
            <Menu
              current={current}
              list={allMenu}
              onClick={this.handleMenu}
            />
          </ScrollView>
          {/* 通过切换元素实现重置 ScrollView 的 scrollTop */}
          {loading ?
            <View /> :
            <ScrollView
              scrollY
              className='cate__list'
              style={{ height }}
            >
              <View className='cate__list-wrap'>
                <Banner banner={banner} />
                <List list={list} />
              </View>
            </ScrollView>
          }
        </View>
      </MyPage>
    )
  }
}

export default Cate

import Taro, { Component } from '@tarojs/taro'
// eslint-disable-next-line no-unused-vars
import { Block, View, Text, Image } from '@tarojs/components'

/** 页面组件, 组件, 装饰器引入 */
import MyPage from '../../components/my-page/index'
import searchIcon from '../../assets/search.png'

/** 样式引入 */
import './search-goods.scss'

export default class PlatformShopSearchPage extends Component {

  /** 页面配置 */

  config = {
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '搜索',
  }

  /** 页面存储 */

  state = {
    loadStyle: 1,
    search: '',
    history: [],
    shops: [],
    active: {
      selectedHistory: '',
    }
  }
  store = {
  }

  /** 生命周期 */

  componentWillMount () {
    this.initSearchItem()
  }
  componentDidShow () {}
  onPullDownRefresh (){}
  onReachBottom() {
    this.loadMore()
  }

  /** 事件响应 */

  search (e) {
    const history = Taro.getStorageSync('PLATFORM_SEARCH_SHOP_LABEL') || []
    this.setState({
      search: e,
      history
    }, () => {
      e && this.getSearchedShop()
      Taro.setStorage({
        key: 'PLATFORM_SEARCH_SHOP_LABEL',
        data: history
      })
    })
  }

  selectHistory (item) {
    const { active } = this.state
    this.setState({
      active: (
        active.selectedHistory =
          active.selectedHistory === item ? '' : item,
        active
      )
    })
  }

  clearOneHistory (item, e) {
    e.stopPropagation()
    const history = Taro.getStorageSync('PLATFORM_SEARCH_SHOP_LABEL') || []
    if (history.includes(item)) {
      history.splice(history.findIndex(x => x === item), 1)
    }
    this.setState({
      history
    }, () => {
      Taro.setStorage({
        key: 'PLATFORM_SEARCH_SHOP_LABEL',
        data: history
      })
    })
  }
  clearHistory () {
    Taro.showModal({
      title: '提示',
      content: '确认清空历史记录?',
      cancelText: '取消',
    }).then((resConfirm) => {
      if (resConfirm.confirm) {
        this.setState({
          history: []
        }, () => {
          Taro.setStorage({
            key: 'PLATFORM_SEARCH_SHOP_LABEL',
            data: []
          })
        })
      }
    })
  }

  /** 页面跳转 */

  goBack () {
    Taro.navigateBack()
  }

  /** Computed */

  render () {
    const { loadStyle, search, history, shops, active } = this.state

    return (
      <MyPage my-class='page' oninit={this.initSearchItem.bind(this)} loadStyle={loadStyle == 3 ? 0 : loadStyle}>

        <View className='sticky z10'>
          <View className='home__search'>
            <View className='home__search-wrap' onClick={this.handlePrevent}>
              <Image className='home__search-img' src={searchIcon} />
              <Text className='home__search-txt'>
                搜索商品
              </Text>
            </View>
          </View>
        </View>

        <View className={'segment history-segment fss-c ' + (search ? 'dead' : 'active')}>
          {/* header */}
          <View className='segment-title-con fsbc'>
            <View className='segment-title fs28'>历史搜索</View>
            <View className='sort-con fcc c999 fs26' onClick={this.clearHistory}>
              <Text className='iconfont fs34 mr10'>&#xe9e1;</Text>
              <Text>清空</Text>
            </View>
          </View>
          {/* history-con */}
          <View className='history-block-con fss fw'>
            {
              (history.length ? history : []).map((item, idx) => {
                return (
                  <Block key={'' + item + idx}>
                    <View
                      className='history-block fs26 c999'
                      onClick={this.search.bind(this, item)}
                      onLongPress={this.selectHistory.bind(this, item)}
                    >
                      <Text>{item}</Text>
                      {
                        active.selectedHistory === item && (
                          <View className='delete-icon-con' onClick={this.clearOneHistory.bind(this, item)}>
                            <Text className='iconfont c999 fs24'>&#xe652;</Text>
                          </View>
                        )
                      }
                    </View>
                  </Block>
                )
              })
            }
          </View>
        </View>
        {
          (loadStyle == 3 && !shops.length) && (
            <View className='fsc-c '>
              <Image className='empty-image' src='https://weapp-1253522117.image.myqcloud.com//image/20190710/b166bd6ca055c38d.png' mode='aspectFill' />
              <Text className='mt60 fs28 c999'>未找到相关店铺哦~ 换个关键字看看?</Text>
            </View>
          )
        }

        <View className='shop-list-con w100'>
          {
            shops.map((s, idx) => {
              return (
                <Block key={'' + s.id + idx}>
                  <Shop shop={s} styleControl={idx === shops.length - 1 ? 'no-border' : ''} />
                </Block>
              )
            })
          }
        </View>

      </MyPage>
    )
  }

  /** 复杂的逻辑/业务处理 */

  initSearchItem () {
    const history = Taro.getStorageSync('PLATFORM_SEARCH_SHOP_LABEL') || []
    this.setState({
      history
    })
  }

  resetList () {
    return new Promise(resolve => {
      this.setState({
        loadStyle: 0,
        search: '',
        shops: [],
        ...Taro.$const.pageInfo(),
      }, resolve)
    })
  }

  getSearchedShop () {
    this.setState({
      loadStyle: 0,
      shops: [],
      ...Taro.$const.pageInfo(),
    }, () => {
      this.loadMore()
    })
  }

  // TODO 封装高阶组件
  getData () {
    return new Promise(resolve => {
      const nextPage = this.state.pageInfo.pageIndex + 1
      this.setState({
        pageInfo: {
          pageSize: this.state.pageInfo.pageSize,
          pageIndex: nextPage
        }
      }, () => {
        Taro.$apiRenderData(this, {
          url: '/customer/center/getShopList',
          data: Object.assign({
            popularity: 'desc',
            keyword: this.state.search,
            area_id: Taro.$globalData.platData.area.id,
            pageIndex: this.state.pageInfo.pageIndex,
            pageSize: this.state.pageInfo.pageSize,
          })
        }).then(res => {
          const data = res.data.data
          resolve(data.list)
        }, resolve)
      })
    })
  }

  loadMore (config = {}) {
    if ([2,3].includes(this.state.loadStyle)) {
      return null
    }
    this.setState({
      loadStyle: 2
    })
    this.getData().then(list => {
      this.setState({
        shops: config.overwrite
          ? list
          : this.state.shops.concat(list),
        loadStyle: list && list.length < this.state.pageInfo.pageSize
          ? 3
          : 1
      })
    })
  }

}

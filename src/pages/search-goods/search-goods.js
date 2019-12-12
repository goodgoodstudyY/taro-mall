import Taro, { Component } from '@tarojs/taro'
// eslint-disable-next-line no-unused-vars
import { Block, View, Text, Image, Input } from '@tarojs/components'
import { Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/cate'
import MyPage from '../../components/my-page/index'
import { crop } from '../../utils/util'

import './search-goods.scss'

const PLATFORM_SEARCH_SHOP_LABEL_MAX_LENGTH = 10
@connect(state => state.cate, { ...actions })
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
    },
    pageInfo: {
      pageSize: 20,
      pageNumer: 0
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
    e = e.detail ? e.detail.value : e
    const history = Taro.getStorageSync('PLATFORM_SEARCH_SHOP_LABEL') || []
    if (e) {
      if (!history.includes(e)) {
        if (history.length >= PLATFORM_SEARCH_SHOP_LABEL_MAX_LENGTH) {
          history.pop()
        }
        history.unshift(e)
      }
    }
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

  changeSearchValue(e) {
    this.setState({
      search: e.detail.value
    })
  }

  goBack () {
    Taro.navigateBack()
  }

  handleGoDetail(id) {
    Taro.navigateTo({
      url: `/pages/goods-detail/goods-detail?id=${id}`
    })
  }

  render () {
    const { search, history, shops, active, loadStyle } = this.state

    if (this.state.loadStyle == 2) {
      return <Loading />
    }

    return (
      <MyPage my-class='page' oninit={this.initSearchItem.bind(this)}>

        <View className='sticky z10'>
          <View className='segment-bs-cb p-r search-con fsbc c999 dark'>
            <Input
              className='search-input dark'
              type='text'
              value={search}
              placeholder='请输入商品名称'
              placeholderClass='fs24 c888'
              onInput={this.changeSearchValue}
              onConfirm={this.search}
            />
            {/* search button */}
            <View className='fcc' onClick={this.search}>
              <Text className='iconfont icon-search c999 fs30 dark'>&#xe64d;</Text>
            </View>
            <View className='fcc' onClick={this.resetList}>
              <Text className={'iconfont icon-clear c999 fs30 ' + (search ? 'active' : '')}>&#xe652;</Text>
            </View>
            <Text className='fs32 c999' onClick={this.goBack}>取消</Text>
          </View>
        </View>

        <View className={'segment history-segment fss-c ' + (search || shops.length ? 'dead' : 'active')}>
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
              <Text className='mt60 fs28 c999'>未找到相关商品哦~ 换个关键字看看?</Text>
            </View>
          )
        }

        <View className='shop-list-con w100'>
          {
            shops.map((s, idx) => {
              return (
                <Block key={'' + s.id + idx}>
                  <View
                    className='shop'
                    onClick={this.handleGoDetail.bind(this, s.id)}
                  >
                    <View className={'shop-content-con fsbc ' + (idx === shops.length - 1 ? 'no-border' : '')}>

                      <View className='fcc h100'>
                        <Image
                          className='shop-image'
                          src={crop(s.smallPic, 150)}
                          mode='aspectFill'
                        />
                      </View>
                      <View className='shop-body-con ml20 f1 fsbs-c'>
                        {/* 商户名称行 */}
                        <View className='fsbc w100'>
                          <Text className='shop-name fs32 ls1 c1a bold ellipsis2'>{s.name}</Text>
                        </View>

                        {/* 商户优惠券行 */}
                        <View className='mt18 f'>
                          <View className='fs24 c999 hl24 mt10'>销量{s.sales || 0}</View>
                        </View>

                        {/* 商户信息行 */}
                        <View className='shop-info f mt20 ellipsis1'>
                        <View className='fsbs w100'>
                          <View className='price fsc'>
                            <Text className='fs20'>¥</Text>
                            <Text className='fs30'>{s.price}</Text>
                            <Text className='fs24'>/{s.unit}</Text>
                          </View>
                          <View className='fcc'>
                            {
                              s.num && s.num > 0 &&
                                <View className='fsc'>
                                  <View onClick={this.discrement.bind (this, s)} className='discrement-layout'>
                                    <Image
                                      className='discrement fcc'
                                      mode='aspectFill'
                                      src='https://weapp-1253522117.image.myqcloud.com//image/20190318/9b4ee6ca0bd7fafb.png'
                                    />
                                  </View>
                                  <View className='f36 c000'>{s.num || 0}</View>
                                </View>
                            }
                            <View className='increment-layout' onClick={this.increment.bind (this, s)}>
                              <View className='increment-bg'>
                                <Image
                                  className='increment fcc'
                                  mode='aspectFill'
                                  src='https://weapp-1253522117.image.myqcloud.com//image/20190318/d490bd5578fc447b.png'
                                />
                              </View>
                            </View>
                          </View>
                        </View>
                        </View>

                      </View>
                    </View>
                  </View>
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
        pageInfo: {
          pageNumer: 0,
          pageSize: 20
        },
      }, resolve)
    })
  }

  getSearchedShop () {
    this.setState({
      loadStyle: 0,
      shops: [],
      pageInfo: {
        pageNumer: 0,
        pageSize: 20
      }
    }, () => {
      this.loadMore()
    })
  }

  // TODO 封装高阶组件
  getData () {
    return new Promise(resolve => {
      const nextPage = this.state.pageInfo.pageNumber + 1
      this.setState({
        pageInfo: {
          pageSize: this.state.pageInfo.pageSize,
          pageNumber: nextPage
        }
      }, () => {
        this.props.dispatchSubList({
          pageNumer: this.state.pageInfo.pageNumer,
          pageSize: this.state.pageInfo.pageSize,
          query: {
            name: this.state.search,
            status: 1
          }
        }).then(res => {
          console.log(res)
          resolve(res.list)
        })
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

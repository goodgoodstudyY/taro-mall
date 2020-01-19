import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Image, Text, Button, Input } from '@tarojs/components'
import { Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/cate'
import { dispatchAdd, dispatchCartNum } from '@actions/cart'
import { getWindowHeight } from '@utils/style'
import { login } from '@utils/request'
import MyPage from '../../components/my-page/index'
import Menu from './menu'
import List from './list'
import searchIcon from '../../assets/search.png'
import './cate.scss'

@connect(state => {return {cate: state.cate, cart: state.cart}}, { ...actions, dispatchAdd, dispatchCartNum })
class Cate extends Component {
  config = {
    navigationBarTitleText: '商品列表'
  }

  state = {
    current: 0,
    loaded: false,
    loading: false,
    currentOrderBy: 0,
    currentOrder: 'desc',
    filterOpen: false,
    selectedTag: 0,
    pageNumber: 0,
    pageSize: 20,
    minPrice: '',
    maxPrice: '',
    goodsList: [],
    loadStyle: 0
  }

  store = {
    screen: [
      {
        name: '综合',
        orderBy: ''
      },
      {
        name: '价格',
        orderBy: 'price'
      },
      {
        name: '商品编码',
        orderBy: 'code'
      },
      {
        name: '筛选',
        orderBy: ''
      }
    ],
    goodsStatus: ['下架', '上架', '待上架', '全部']
  }

  componentWillMount() {
    if (!Taro.$globalData.token) {
      login()
    }
  }

  componentDidShow() {
    this.setState({
      current: 0,
      currentOrderBy: 0,
      currentOrder: 'desc',
      filterOpen: false,
      selectedTag: 0,
      pageNumber: 0,
      pageSize: 20,
      minPrice: '',
      maxPrice: '',
      goodsList: [],
      loadStyle: 0
    }, () => {
      this.onInit()
    })
    if (this.props.cart.count > 0) {
      Taro.setTabBarBadge({
        index: 3,
        text: `${this.props.cart.count}`
      })
    }
  }

  onInit() {
    this.props.dispatchTagMenu().then(() => {
      this.props.dispatchMenu().then(data => {
        this.setState({
          loaded: true,
          allMenu: this.props.cate.tagMenu.concat(data)
        })
      })
    })
    this.getData()
  }

  getData() {
    if (this.state.loadStyle == 4) return
    const nextPage = this.state.pageNumber + 1
    this.setState({
      pageNumber: nextPage,
      pageSize: this.state.pageSize
    }, () => {
      let params = {
        pageNumber: this.state.pageNumber,
        pageSize: this.state.pageSize,
        query: {
          minPrice: this.state.minPrice,
          maxPrice: this.state.maxPrice,
          status: 1
        }
      }
      if (this.state.currentOrderBy != 0) {
        params.q_orderBy = this.store.screen[this.state.currentOrderBy].orderBy
        params.q_order = this.state.currentOrder
      }
      if (this.state.selectedTag != 0) {
        params.query.tagId = this.state.selectedTag
      } else if(this.state.current) {
        if (this.state.allMenu[this.state.current].tagId) {
          params.query.tagId = this.state.allMenu[this.state.current].tagId
        } else {
          params.query.typeId = this.state.allMenu[this.state.current].typeId
        }
      }
      this.props.dispatchSubList(params).then(res => {
        this.setState({
          loading: false,
          goodsList: this.state.goodsList.concat(res.list),
          loadStyle: res.total < 10 ? 4 : 0
        })
      })
    })
  }

  handleMenu = (index) => {
    this.setState({
      loading: true,
      currentOrderBy: 0,
      currentOrder: 'desc',
      selectedTag: 0,
      pageNumber: 0,
      pageSize: 20,
      minPrice: '',
      maxPrice: '',
      goodsList: [],
      loadStyle: 0
    }, () => {
      let query = {
        status: 1
      }
      if (this.state.allMenu[index].tagId) {
        query.tagId = this.state.allMenu[index].tagId
      } else {
        query.typeId = this.state.allMenu[index].typeId
      }
      this.props.dispatchSubList({
        pageNumber: 1,
        pageSize: 20,
        query
      }).then(res => {
        this.setState({ 
          current: index,
          loading: false,
          goodsList: this.state.goodsList.concat(res.list)
        })
      })
    })
  }

  cancelMove(e) {
    e.stopPropagation()
    e.preventDefault()
  }

  togggleFilterOpen() {
    const { filterOpen } = this.state

    this.setState({
      filterOpen: !filterOpen
    })
  }

  selectTag(id, e) {
    e.stopPropagation()
    this.setState({
      selectedTag: id
    })
  }

  resetFilter(e) {
    e.stopPropagation()
    this.setState({
      selectedTag: 0,
      minPrice: '',
      maxPrice: ''
    })
  }

  getPageData() {
    this.setState({
      pageNumber: 0,
      pageSize: 20,
      goodsList: [],
      loadStyle: 0
    }, () => {
      this.getData()
    })
  }

  handleSetPrice(val, e) {
    e.stopPropagation()
    if (val == 'minPrice') {
      this.setState({
        minPrice: e.detail.value
      })
    } else {
      this.setState({
        maxPrice: e.detail.value
      })
    }
  }

  handleFiltrateGoods(index) {
    if ((index + 1) == this.store.screen.length) {
      this.setState({
        filterOpen: true
      })
    } else {
      this.setState({
        currentOrderBy: index,
        currentOrder: this.state.currentOrder == 'desc' ? 'asc' : 'desc',
        pageNumber: 0,
        pageSize: 20,
        loading: true,
        goodsList: [],
        loadStyle: 0
      }, () => {
        this.getData()
      })
    }
  }

  handlePrevent() {
    Taro.navigateTo({
      url: '/pages/search-goods/search-goods'
    })
  }

  addToCart(item) {
    item = {
      ...item,
      num: 1,
      checked: true
    }
    this.props.dispatchAdd(item)
    this.props.dispatchCartNum({
      countCornerMark: 1
    })
  }

  reduceToCart(item) {
    item.num = -1
    this.props.dispatchAdd(item)
    this.props.dispatchCartNum({
      countCornerMark: -1
    })
  }

  syncGoods() {
    const cart = this.props.cart.cartInfo
    const list = this.state.goodsList
      const idInCart = cart.map (i => i.id);
      const goodsInCart = list.filter (i => idInCart.includes (i.id));
      const goodsHasDeleted = list.filter (
        i => !idInCart.includes (i.id) && i.num && i.num > 0
      )
      goodsInCart.map (i => {
        const goodsInCardWithSameId = cart.filter (x => x.id == i.id);
        i.num = this.sum (goodsInCardWithSameId.map (x => x.num));
        // goodsInCardWithSameId.map(x => {
        //   i.sku.map(res => {
        //     if (res.id == x.specSelected.id && res.takeout_price != x.specSelected.price) {
        //       Cart.syncPrice('dishesCart', res)
        //     }
        //   })
        // })
        // const index = list.findIndex (x => x.id == i.id)
        // if (index >= 0) {
        //   i.allowDelete = goodsInCardWithSameId.length < 2;
        // }
      });
      goodsHasDeleted.map (i => {
        i.num = 0;
      })
      
      // this.setState({
      //   list: list
      // })
    return list
  }

  sum (list = []) {
    let sum = 0;
    list.map (i => (sum = sum + i));
    return sum;
  }

  render () {
    const { showPageError, tagMenu } = this.props.cate
    const { current, loading, currentOrderBy, currentOrder, filterOpen, allMenu, minPrice, maxPrice, goodsList } = this.state
    const height = getWindowHeight()

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
                搜索商品
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
            <View
              className='fss-c f1 goods-list-right'
              style={{ height: `calc(${height} - ${Taro.pxTransform(76)})` }}
            >
              <View className='goods-screen fsac fs28'>
                {
                  this.store.screen.map((x, i) => {
                    return (
                      <View className='fsc' key={x.name} onClick={this.handleFiltrateGoods.bind(this, i)}>
                        <Text className={i == currentOrderBy ? 'cab' : 'c333'}>{x.name}</Text>
                        {
                          i != 0
                          ? (i + 1) == this.store.screen.length
                            ? (
                              <View className='fcc-c ml6'>
                                <View className='iconfont c333 fs28 mt6'>&#xe613;</View>
                              </View>
                            )
                            : (
                              <View className='fcc-c ml6'>
                                <View className={'iconfont c333 fs14 mt6' + (i == currentOrderBy && currentOrder == 'desc' ? ' cab' : '')}>&#xe606;</View>
                                <View className={'iconfont c333 fs14' + (i == currentOrderBy && currentOrder == 'asc' ? ' cab' : '')}>&#xe607;</View>
                              </View>
                            )
                          : <View></View>
                        }
                      </View>
                    )
                  })
                }
              </View>
              <ScrollView
                scrollY
                className='cate__list'
                onScrollToLower={this.getData.bind(this)}
                style={{ height: `calc(${height} - ${Taro.pxTransform(176)})` }}
              >
                <View className='cate__list-wrap'>
                  {/* <Banner banner={banner} /> */}
                  <List list={this.syncGoods()} onAdd={this.addToCart.bind(this)} onReduce={this.reduceToCart.bind(this)} />
                </View>
              </ScrollView>
            </View>
          }
        </View>

        <View
          className={'filter-mask ' + (filterOpen ? 'active' : '')}
          onClick={this.togggleFilterOpen}
          onTouchMove={this.cancelMove}
          style={{
            height: '100vh',
          }}
        >
          <View
            className={'filter-con fsbs-c bgc-w ' + (filterOpen ? 'filter-con-active' : '')}
            style={{
              boxSizing: 'border-box'
            }}
          >
            <View className='filter-item-block'>
              <View className='filter-item-block'>
                <View className='block-title'>
                  <Text className='fs28 bold ls1'>标签</Text>
                </View>
                <View className='block-content-con fss fw'>
                  {
                    tagMenu.map((x) => {
                      return (
                        <View
                          className={'block-item order ' + (this.state.selectedTag == (x.id || 0) ? 'block-item-active' : '')}
                          onClick={this.selectTag.bind(this, x.id || 0)}
                          key={x.id}
                        >
                          <Text
                            className={'fs24 thin ' + (this.state.selectedTag == (x.id || 0) ? 'cab' : '')}
                          >{x.name}</Text>
                        </View>
                      )
                    })
                  }
                </View>
              </View>
              <View className='filter-item-block'>
                <View className='block-title'>
                  <Text className='fs28 bold ls1'>价格区间(元)</Text>
                </View>
                <View className='block-content-con fsc fw'>
                  <Input
                    className='min-price price-input fs26'
                    placeholder='最低价'
                    type='number'
                    placeholderClass='c999 fs26 fcc'
                    onClick={this.cancelMove}
                    value={minPrice}
                    onChange={this.handleSetPrice.bind(this, 'minPrice')}
                  />
                  <Text className='ml10'>——</Text>
                  <Input
                    className='max-price price-input fs26'
                    placeholder='最高价'
                    type='number'
                    onClick={this.cancelMove}
                    value={maxPrice}
                    placeholderClass='c999 fs26 fcc'
                    onChange={this.handleSetPrice.bind(this, 'maxPrice')}
                  />
                </View>
              </View>
            </View>
            <View className='filter-buttons-area fsbc'>
              <Button
                plain
                className='filter-button reset-button'
                hoverClass='main-button-hover-class'
                onClick={this.resetFilter}
              >
                <Text className='fs30 cab'>重置</Text>
              </Button>
              <Button
                plain
                className='filter-button confirm-button'
                hoverClass='main-button-hover-class'
                onClick={this.getPageData}
              >
                <Text className='fs30 cfff'>确定</Text>
              </Button>
            </View>
          </View>
        </View>
      </MyPage>
    )
  }
}

export default Cate

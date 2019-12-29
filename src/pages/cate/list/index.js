import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { crop } from '../../../utils/util'
import { getUserToken } from '../../../utils/request'
import GetPhone from '../../../components/getPhone/index'
import './index.scss'

export default class List extends Component {
  static defaultProps = {
    list: [],
    onAdd: () => {}
  }

  static state = {
    getPhone: false,
    listItem: {},
    handleItem: ''
  }

  static options = {
    addGlobalClass: true
  }

  handleClick = (item) => {
    Taro.navigateTo({
      url: `/pages/goods-detail/goods-detail?id=${item}`
    })
  }

  increment(item, e) {
    e.stopPropagation()
    this.setState({
      listItem: item,
      handleItem: 'add'
    })
    if (!Taro.$globalData.token) {
      this.setState({
        getPhone: true
      })
    } else {
      this.props.onAdd(item)
    }
  }

  discrement(item, e) {
    e.stopPropagation()
    this.setState({
      listItem: item,
      handleItem: 'reduce'
    })
    if (!Taro.$globalData.token) {
      this.setState({
        getPhone: true
      })
    } else {
      this.props.onReduce(item)
    }
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
    }).then(() => {
      if (this.state.handleItem == 'add') {
        this.props.onAdd(this.state.listItem)
      } else {
        this.props.onReduce(this.state.listItem)
      }
    })
    this.setState({
      getPhone: false
    })
  }

  render () {
    const { list } = this.props
    const { getPhone } = this.state
    return (
      <View className='cate-list'>
        {list.length > 0 && list.map(val => (
          <View className='dish-item' key={val.id} onClick={this.handleClick.bind(this, val.id)}>
          <View className='dish-info fss'>
            <View className='dish-info-img f-s-0'>
              <Image className='dish-info-img'  mode='aspectFill' src={crop(val.smallPic, 180)}></Image>
            </View>
            <View className='f1 ml20 fsbs-c item-h100'>
              <View className='fs30 bold dish-info-detail ellipsis2'>{val.name}</View>
              <View className='fs24 c999 hl24 mt10'>销量{val.fakeSale || 0}</View>
              <View className='fsbc w100'>
                <View className='price fsc'>
                  <Text className='fs20'>¥</Text>
                  <Text className='fs30'>{val.realPrice || val.price}</Text>
                  <Text className='fs24'>/{val.unit}</Text>
                </View>
                <View className='fcc'>
                  {
                    val.num && val.num > 0 &&
                      <View className='fsc'>
                        <View onClick={this.discrement.bind(this, val)} className='discrement-layout'>
                          {/* <Image
                            className='discrement fcc iconfont'
                            mode='aspectFill'
                            src='https://weapp-1253522117.image.myqcloud.com//image/20190318/9b4ee6ca0bd7fafb.png'
                          /> */}
                          <View className='discrement fcc iconfont fs24'>&#xe62a;</View>
                        </View>
                        <View className='f36 c000'>{val.num || 0}</View>
                      </View>
                  }
                  <View className='increment-layout' onClick={this.increment.bind (this, val)}>
                    <View className='increment-bg'>
                      {/* <Image
                        className='increment fcc'
                        mode='aspectFill'
                        src='https://weapp-1253522117.image.myqcloud.com//image/20190318/d490bd5578fc447b.png'
                      /> */}
                      <View className='iconfont increment fcc fs24 cfff'>&#xe608;</View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        ))}

{
          getPhone
          ? (
            <GetPhone layout='closeMark' onCloseMark={this.handleCloseMark.bind(this)} onGetPhoneNumber={this.handleGetPhone.bind(this)} />
          )
          : <View></View>
        }
      </View>
    )
  }
}

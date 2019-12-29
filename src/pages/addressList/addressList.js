import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/address'
import MyPage from '../../components/my-page'

import './addressList.scss'

@connect(state => state.address, actions)
export default class addressList extends Component {
  config = {
    navigationBarTitleText: '地址选择',
    navigationBarBackgroundColor: '#fff',
    onReachBottomDistance: 50
  }
  constructor (s) {
    super(s)
    this.state = {
      loaded: false
    }
  }

  componentWillMount() {
    this.init()
  }

  init() {
    this.props.dispatchAddressList().then(() => {
      this.setState({
        loaded: true
      })
    })
  }

  goAddressEdit () {
    Taro.$page['addressList'] = this;
    Taro.navigateTo({
      url: '/pages/addressEdit/addressEdit',
    })
  }

  render () {
    const { loaded } = this.state
    const { addressList } = this.props

    if (!this.state.loaded) {
      return <Loading />
    }

    return (
      <MyPage onReload={this.init.bind(this)}>
        <View className='page fsc-c'>
        {addressList.map((e, id) => {
          return (<View key={id} className={e.disabled == true ? 'default address-item bgc-w' : 'address-item bgc-w'} >
            {/* 地址详细信息 */}
            <View className='row box' onClick={this.checkAddress.bind(this, e, id)}>
              <View className='icon-box'>
                <View className='icondingwei icon iconfont'></View>
              </View>
              <View className='address-info mt50'>
                <View className='row mr185'>
                  <Text className='c1a fs36 bold'>{e.receiver}</Text>
                  <Text className='c1a fs36 bold'>{e.phone}</Text>
                </View>
                <View className='mt30 mb40 mr40'>
                  <Text className='fs28 c666'>{e.province + e.city + e.area + e.address}</Text>
                </View>
              </View>
            </View>
            {/* 地址操作 */}
            {(e.isDefault == '1') ? <View className='rowc'>
              <View className='around f1 ml40'>
                <View className='my-default row center'>
                  <View className='fs24 c1a ml20'>已默认</View>
                  <View className='my-default-icon mr10'></View>
                </View>
              </View>
              <View className='row f100 f1 center'>
                <View className='c666 fs28' onClick={this.delete.bind(this, e)}><Text className='iconfont small-icon mr10'>&#xe9e2;</Text><Text>删除</Text></View>
                <View className='divide'></View>
                <View className='c-red f28 mr40' onClick={this.edit.bind(this, e)}><Text className='iconfont small-icon mr10'>&#xe9e3;</Text><Text>编辑</Text></View>
              </View>
            </View> :
              <View className='rowc'>
                <View className='around f1 ml40'>
                  <View className='my-nodefault row center' onClick={this.change.bind(this, e)}>
                    <View className='my-default-icon ml10'></View>
                    <View className='fs24 c1a mr20'>设为默认</View>
                  </View>
                </View>
                <View className='row f100 f1 center'>
                  <View className='c666 fs28 ' onClick={this.delete.bind(this, e)}><Text className='iconfont small-icon mr10'>&#xe9e2;</Text><Text>删除</Text></View>
                  <View className='divide'></View>
                  <View className='c-red fs28 mr40' onClick={this.edit.bind(this, e)}><Text className='iconfont small-icon mr10'>&#xe9e3;</Text><Text>编辑</Text></View>
                </View>
              </View>}
          </View>)
        })}
        {
          (loaded && addressList.length == 0) && (
            <View className='fsc-c'>
              <View className='no-list iconfont'>&#xe67b;</View>
              <Text className='fs28 c999 mt30'>你居然还没有地址</Text>
              <Button className='btn' onClick={this.goAddressEdit}>添加地址</Button>
            </View>
          )
        }
        {
          (loaded && addressList.length != 0) && (
            <Button className='bottom-btn' onClick={this.goAddressEdit}>添加地址</Button>
          )
        }
        </View>
        
      </MyPage>
    )
  }
}

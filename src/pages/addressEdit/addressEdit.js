import Taro, { Component } from '@tarojs/taro'
import { View, Input, Text, Form, Button, Textarea, Picker } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/address'
import MyPage from '../../components/my-page'
import './addressEdit.scss'

@connect(state => state.address, actions)
export default class myCoupon extends Component {
  config = {
    navigationBarTitleText: '编辑地址',
    navigationBarBackgroundColor: '#fff',
    onReachBottomDistance: 50
  }
  constructor(s) {
    super(s)
    this.state = {
      detail: {
        address: '',
        receiver: '',
        phone: '',
        city: '',
        province: '',
        area: ''
      }
    }
  }

  componentWillMount() {
    if (this.$router.params.item) {
      this.setState({
        detail: JSON.parse(this.$router.params.item)
      })
    }
  }

  inputHandler(key, e) {
    console.log(e)
    const newParamObj = {}
    if (key == 'addressPCA') {
      newParamObj['province'] = e.target.value[0]
      newParamObj['city'] = e.target.value[1]
      newParamObj['area'] = e.target.value[2]
    } else {
      newParamObj[key] = e.target ? e.target.value : e
    }
    this.setState(
      Object.assign(
        this.state.detail,
        newParamObj
      )
    )
  }

  submit() {
    if (Object.values(this.state.detail).every(_ => _)) {
      if (this.props.addressList.length == 0) {
        this.state.detail.isDefault = 1
      } else {
        this.state.detail.isDefault = this.state.detail.isDefault || 0
      }
      if (this.$router.params.item) {
        this.props.dispatchEditAddress(this.state.detail).then(() => {
          Taro.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 800
          })
          Taro.$page['addressList'].init()
          setTimeout(() => {
            Taro.navigateBack()
          }, 800)
        })
      } else {
        this.props.dispatchAddAddress(this.state.detail).then(() => {
          Taro.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 800
          })
          Taro.$page['addressList'].init()
          setTimeout(() => {
            Taro.navigateBack()
          }, 800)
        })
      }
    } else {
      Taro.showToast({
        title: '请将信息填写完整',
        icon: 'none',
        duration: 1000
      })
    }
  }
  
  render() {
    let { detail } = this.state

    return (
      <MyPage>
        <Form className='form'>
          <View className='f1 fsbc item top-item'>
            <Text className='title fs32'>收件人</Text>
            <Input className='fs32' placeholder='请输入收货人姓名' placeholder-class='c999' value={detail.receiver} onInput={this.inputHandler.bind(this, 'receiver')} />
          </View>
          <View className='f1 fsbc item'>
            <Text className='title fs32'>手机号</Text>
            <Input className='fs32' placeholder='请输入收货人手机号' placeholder-class='c999' maxLength='11' value={detail.phone} type='number' onInput={this.inputHandler.bind(this, 'phone')} />
          </View>
          <View className='f1 fsbc item'>
            <Text className='title fs32'>省/市/区</Text>
            <Picker
              mode='region'
              value={detail.province + '/' + detail.city + '/' + detail.area}
              className='fs32'
              onChange={this.inputHandler.bind(this, 'addressPCA')}
            >
              {
                detail.province
                ? <Text className='fs32'>{detail.province + '/' + detail.city + '/' + detail.area}</Text>
                : <Text className='fs32 c999'>省/市/区</Text>
              }
              
            </Picker>
          </View>
          <View className='f1 item'>
            <View className='row mt45'>
              <Text className='title fs32'>详细地址</Text>
              <Textarea className={detail.address ? 'fs32' : 'fs32 c999'} value={detail.address} onInput={this.inputHandler.bind(this, 'address')}>{detail.address ? '' : '请填写详细地址'}</Textarea>
            </View>
          </View>
          <Button onClick={this.submit} className='submit'>保存</Button>
        </Form>
      </MyPage>
    )
  }
}

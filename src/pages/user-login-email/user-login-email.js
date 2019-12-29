import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Button } from '@tarojs/components'
import md5 from 'blueimp-md5'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/user'
import './user-login-email.scss'

@connect(state => state.user, actions)
class UserLoginEmail extends Component {
  config = {
    navigationBarTitleText: '切换账号'
  }

  state = {
    loading: false,
    activeGetValidCode: true,
    getValidCodeText: '获取验证码',
    infoForm: {
      mobile: '',
      code: ''
    }
  }

  store = {
    validCodeTick: null,
    validCodeCount: 60,
    goLoginPageText: '立即登录'
  }

  componentDidMount() {
  }

  componentWillUnmount () {
    this.clearValidCodeTick()
  }

  changeInfoFormParam (key, e) {
    const newParamObj = {}
    newParamObj[key] = e.detail.value

    this.setState(
      Object.assign(
        this.state.infoForm,
        newParamObj
      )
    )
  }

  onGetValidCode() {
    if (this.state.activeGetValidCode) {
      if (/[0-9]{11}/.test(this.state.infoForm.mobile)) {
        this.getValidCode()
        this.setValidCodeText()
      } else {
        Taro.showModal({
          title: '提示',
          content: '手机号格式错误'
        })
      }
    }
  }

  clearValidCodeTick () {
    this.store.validCodeTick && clearInterval(this.store.validCodeTick)
  }

  getValidCode() {
    this.props.dispatchGetCode({
      phone: this.state.infoForm.mobile,
      loginFlag: 2
    }).then(() => {
      Taro.showToast({
        title:'发送成功',
        icon: 'success'
      })
    }).catch(() => {
      this.clearValidCodeTick()
    })
  }

  setValidCodeText () {
    this.setState({
      getValidCodeText: '60 s'
    })
    this.store.validCodeTick = setInterval(() => {
      if (this.store.validCodeCount > 0) {
        this.store.validCodeCount -= 1
        this.setState({
          getValidCodeText: this.store.validCodeCount + ' s'
        })
      } else {
        this.setState({
          activeGetValidCode: true,
          getValidCodeText: '获取验证码'
        })
        this.store.validCodeCount = 60
        this.clearValidCodeTick()
      }
    }, 1000)
    this.setState({
      activeGetValidCode: false
    })
  }

  handleChangePassword() {
    if (/[0-9]{11}/.test(this.state.infoForm.mobile) && /[0-9]{4}/.test(this.state.infoForm.code)) {
      this.props.dispatchMobileLogin({
        loginFlag: '2',
        phone: this.state.infoForm.mobile,
        code: this.state.infoForm.code
      }).then(() => {
        Taro.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(() => {
          Taro.reLaunch({
            url: '/pages/home/home'
          })
        }, 1000)
      })
    }
  }

  render () {
    const { activeGetValidCode } = this.state
    // const isBtnDisabled = !username || !password

    return (
      <View className='page'>
        {/* form segment */}
        <View className='segment form-info-segment fcc-c bgc-w'>
          <View className='input-view fsc fs26 input-view-first'>
            <Text className='iconfont fs34 c999'>&#xe65f;</Text>
            <Input
              className='form-input input fs26'
              type='digit'
              placeholder='请输入手机号'
              onInput={this.changeInfoFormParam.bind(this, 'mobile')}
            />
          </View>
          <View className='input-view fsc fs26'>
            <Text className='iconfont fs36 c999'>&#xe63d;</Text>
            <Input
              className='form-input input fs26'
              type='digit'
              placeholder='请输入验证码'
              onInput={this.changeInfoFormParam.bind(this, 'code')}
            />
            <Button
              className={
                'get-valid-code-button br6 cfff fs26' + ' ' +
                (
                  activeGetValidCode ? 'bgc-m-o' : 'bgc-m-o-d'
                )
              }
              onClick={this.onGetValidCode}
            >
              <Text>{this.state.getValidCodeText}</Text>
            </Button>
          </View>
          <Button
            className='change-password-button br6 bgc-m-o cfff fcc'
            onClick={this.handleChangePassword}
          >
            <Text>立即登录</Text>
          </Button>
        </View>

      </View>
    )
  }
}

export default UserLoginEmail

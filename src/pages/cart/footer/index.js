import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { CheckboxItem, ButtonItem } from '@components'
import './index.scss'

export default class Footer extends Component {
  static defaultProps = {
    cartInfo: {},
    onToggle: () => {}
  }

  static state = {
    checkedNum: 0,
    totalPrice: 0
  }

  componentWillReceiveProps(prop) {
    const cart = prop.cartInfo
    const checkedCart = cart.filter(x => x.checked)
    let checkedNum = checkedCart.length
    let totalPrice = 0
    checkedCart.map(x => {
      totalPrice = totalPrice + x.num * (x.realPrice || x.price)
    })
    this.setState({
      checkedNum,
      totalPrice
    })
  }

  handleUpdateCheck = () => {
    this.props.onUpdateCheck(this.state.checkedNum)
  }

  handleOrder = () => {
    Taro.navigateTo({
      url: '/pages/goodsPayment/goodsPayment'
    })
  }

  render () {
    const { cartInfo } = this.props
    const { checkedNum, totalPrice } = this.state
    return (
      <View className='cart-footer'>
        <View className='cart-footer__select'>
          <CheckboxItem
            checked={checkedNum}
            onClick={this.handleUpdateCheck}
          >
            <Text className='cart-footer__select-txt'>
              {!checkedNum ? '全选' : `已选(${checkedNum})`}
            </Text>
          </CheckboxItem>
        </View>
        <View className='cart-footer__amount'>
          <Text className='cart-footer__amount-txt'>
            ¥{Number(totalPrice || 0).toFixed(2)}
          </Text>
        </View>
        <View className='cart-footer__btn'>
          <ButtonItem
            type='primary'
            text='下单'
            onClick={this.handleOrder}
          />
        </View>
      </View>
    )
  }
}

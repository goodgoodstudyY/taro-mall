import Taro, { Component } from '@tarojs/taro'
// eslint-disable-next-line no-unused-vars
import { View, Text, Image, Block } from '@tarojs/components'

import './index.scss'

export default class PersonalBlock extends Component {

  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    floatNum: {},
    imgUrl: '',
    name: '',
    onClick: () => {},
    layout: ''
  }

  handleGoPage () {
    this.props.onClick()
  }

  render () {
    const { floatNum, imgUrl, name, layout } = this.props

    return (
      <View
        className={
          'fcc-c order-item ' +
          (
            layout.includes('order')
            ? 'w5'
            : layout.includes('discount')
              ? 'w4'
              : ''
          )
        }
        onClick={this.handleGoPage.bind(this)}
      >
        {this.props.renderIcon}
        <Text className='fs26 mt12 c5f'>{name}</Text>
        {
          floatNum && Number(floatNum)
          ? (
            <View className='tip fs22'>
              <Text>{floatNum}</Text>
            </View>
          )
          : null
        }
      </View>
    )
  }
}

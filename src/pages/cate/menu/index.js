import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'

export default class Menu extends Component {
  static defaultProps = {
    list: []
  }

  handleClick = (id) => {
    this.props.onClick(id)
  }

  render () {
    const { current, list } = this.props
    return (
      <View className='cate-menu'>
        {list.map((item, index) => {
          const active = index === current
          return (
            <View
              key={item.id}
              className={classNames('cate-menu__item', active && 'cate-menu__item--active')}
              onClick={this.handleClick.bind(this, index)}
            >
              <Text
                className={classNames('cate-menu__item-name', active && 'cate-menu__item-name--active')}
              >
                {item.name}
              </Text>
            </View>
          )
        })}
      </View>
    )
  }
}

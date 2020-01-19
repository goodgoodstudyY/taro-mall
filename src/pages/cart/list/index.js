import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { CheckboxItem, InputNumber } from '@components'
import { crop } from '../../../utils/util'
import './index.scss'

export default class List extends Component {
  static defaultProps = {
    list: [],
    onUpdate: () => {},
    onUpdateCheck: () => {}
  }

  getBaseItem = (item) => ({
    skuId: item.skuId,
    type: item.type,
    extId: item.extId,
    cnt: item.cnt,
    checked: item.checked,
    canCheck: true,
    promId: this.props.promId,
    promType: this.props.promType
  })

  handleUpdate = (item, cnt) => {
    // const payload = {
    //   skuList: [{ ...this.getBaseItem(item), cnt }]
    // }
    const payload = {
      ...item,
      num: cnt - item.num
    }
    this.props.onUpdate(payload)
  }

  handleUpdateCheck = (item, e) => {
    e.stopPropagation()
    // const payload = {
    //   skuList: [{ ...this.getBaseItem(item), checked: !item.checked }]
    // }
    const payload = {
      ...item,
      checked: !item.checked
    }
    this.props.onUpdateCheck(payload)
  }

  handleRemove = () => {
    // XXX 暂未实现左滑删除
  }

  render () {
    const { list } = this.props
    return (
      <View className='cart-list'>
        {list.map(item => (
          <View
            key={item.id}
            className='cart-list__item'
            onClick={this.handleUpdateCheck.bind(this, item)}
          >
            <CheckboxItem
              checked={item.checked}
              onClick={this.handleUpdateCheck.bind(this, item)}
            />
            <Image
              className='cart-list__item-img'
              src={crop(item.smallPic, 160)}
              mode='aspectFill'
            />
            <View className='cart-list__item-info'>
              <View className='cart-list__item-title'>
                {!!item.prefix &&
                  <Text className='cart-list__item-title-tag'>{item.prefix}</Text>
                }
                <Text className='cart-list__item-title-name' numberOfLines={1}>
                  {item.name}
                </Text>
              </View>

              {/* <View className='cart-list__item-spec'>
                <Text className='cart-list__item-spec-txt'>
                  {item.specList.map(sepc => sepc.specValue).join(' ')}
                </Text>
              </View> */}

              <View className='cart-list__item-wrap'>
                <Text className='cart-list__item-price'>
                  ¥{item.realPrice || item.price}
                </Text>
                <View className='cart-list__item-num'>
                  <InputNumber
                    num={item.num}
                    onChange={this.handleUpdate.bind(this, item)}
                  />
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    )
  }
}

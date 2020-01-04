import Taro, { Component } from '@tarojs/taro'
// eslint-disable-next-line no-unused-vars
import { View, Text } from '@tarojs/components'
import './index.scss'

/**
 * 使用方法 (ps: 在isOutBorder = false 时 小border默认为128px 暂无修改接口)
 * <Tab
 *  tabBarList = {this.state.tabBarList}(必传)            tabBar名称: ['全部', '已完成', '未完成']
 *  active = {this.state.active}(必传)                    当前选中TabBar名称: '全部'
 *  onChangeTab = {this.changeTabBar.bind(this)}(必传)    tabBar切换事件
 *  isOutBorder = { true }                                点击态下border显示为外部box大border,反之为字体下小border
 *  tabBarMean = [0, 1, -1]                               大多数情况无用! tabBar名称: ['全部', '已完成', '未完成']对应的另一种含义[0, 1, -1] 为适应orderList页面所写 
 * />
 */

export default class Tab extends Component {

  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    tabBarList: [],
    active: '',
    onChangeTab: () => {},
    isOutBorder: true,
    tabBarMean: undefined
  }

  changeTab (x) {
    const { onChangeTab } = this.props
    onChangeTab(x)
  }

  render () {
    const { active, tabBarList, isOutBorder, tabBarMean } = this.props
    return (
      <View className='row90 bcf status-list'>
          {tabBarList.map( (item, index) => { 
              return (
                active == item?<View className={isOutBorder ? 'fl f26 bold r' : 'fl f26 bold'}><Text className={isOutBorder ? '' : 'smallBox'}>{tabBarMean ? tabBarMean[index] : item}</Text></View>:
                <View key={index} className='fl f26 c6' onClick={this.changeTab.bind(this, item)}><Text>{tabBarMean ? tabBarMean[index] : item}</Text></View>
              )
            })}
      </View>
    )
  }
}

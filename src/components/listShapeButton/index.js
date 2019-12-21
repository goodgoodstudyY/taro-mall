import Taro, { Component } from '@tarojs/taro'
// eslint-disable-next-line no-unused-vars
import { View, Text, Button, Block } from '@tarojs/components'

import './index.scss'

export default class ListShapeButton extends Component {

  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    go: '',
    goParams: '',
    norenderHeaderIcon: false,
    layout: [],
    onClick: () => {}
  }

  handleButtonClick () {
    const { go, goParams } = this.props

    if (go) {
      Taro.navigateTo({
        url: `../${go}/${go}${goParams}`
      })
    } else {
      this.props.onClick()
    }
  }

  render () {
    const { layout, norenderHeaderIcon } = this.props

    return (
      <View
        className={
          'component list-shape-button ' +
          (layout.includes('border-top') ? 'border-top ' : '') +
          (layout.includes('border-bottom') ? 'border-bottom ' : '')
        }
      >
        <Button
          plain
          className={
            layout.includes('h100')
              ? 'h100-button fsbc'
              : 'segment void-button'
          }
          hoverClass='main-button-hover'
          onClick={this.handleButtonClick.bind(this)}
        >
          <View className='w100 fcc'>
            <View className='void-button-content-wrapper w100 fsbc'>
              <View className='content-con w100 fsc'>
                {
                  !norenderHeaderIcon ? (
                    <Block>
                      {this.props.renderHeader}
                      <View className='header-content-padding'></View>
                      {this.props.renderContent}
                      <View className='header-content-padding'></View>
                      {this.props.children}
                    </Block>
                  ) : (
                    <Block>
                      {this.props.renderContent}
                      {this.props.children}
                    </Block>
                  )
                }
              </View>
              <View className='tail fec'>
                {this.props.renderTail}
                {
                  layout.includes('noTail')
                  ? null
                  : <Text className='iconfont c999 fs24'>&#xe662;</Text>
                }
              </View>
            </View>
          </View>
        </Button>
      </View>
    )
  }
}

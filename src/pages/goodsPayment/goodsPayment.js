import Taro, { Component } from '@tarojs/taro';

import { View, Text, Textarea, Image, Checkbox } from '@tarojs/components';
import { connect } from '@tarojs/redux'
import * as actions from '@actions/cart'
import { dispatchAddressList } from '@actions/address'
import MyPage from '../../components/my-page'
import './goodsPayment.scss';
import { crop } from '../../utils/util';

@connect(state => state.cart, {...actions, dispatchAddressList})
export default class goodsPayment extends Component {

    config = {
        navigationBarTitleText: '',
        navigationBarBackgroundColor: '#ab2b2b',
        backgroundColor: '#ab2b2b',
    }

    constructor(props) {
        super(props)
        this.state = {
            addressInfo: {},
            handleGoodsInfo: [],
            showTextarea: false,
            remarks: '',
            textareaFocus: false,
            canCreateOrder: false
        }
    }

    componentWillMount() {
        this.getInit()
    }

    getInit() {
        this.props.dispatchAddressList()
    }

    chooseAddress() {
        const { addressInfo } = this.state;
        Taro.navigateTo({
            url: '/pages/addressList/addressList?id=' + (addressInfo && addressInfo.id ? addressInfo.id : '') + '&type=2',
        })
        Taro.$page['goodsPayment'] = this;
    }

    render() {
        const { addressInfo, handleGoodsInfo, showTextarea, remarks, textareaFocus, canCreateOrder } = this.state
        
        return (
            <MyPage onReload={this.getInit.bind(this)}>
                <View className='page fsc-c'>
                <View className='address-layout fsc w100'>
                    <View className='address-bg w100'></View>
                    <View className='address bgc-w'>
                        {
                            addressInfo && Object.keys(addressInfo).length > 0
                            ? (
                                <View className='address-content-icon address-content iconfont w100' onClick={this.chooseAddress.bind(this)}>
                                    <View className='address-provinceAndCity fs24 c999'>上海市上海市闵行区</View>
                                    <View className='address-address fs38 c1a'>{addressInfo.address}</View>
                                    <View className='address-consignee fs26 c1a'>{ `收货人：${addressInfo.realname} (${addressInfo.mobile})`}</View>
                                </View>
                            )
                            : 
                                <View className='address-none w100 fcc c-red fs36' onClick={this.chooseAddress.bind(this)}>
                                    <View className='iconfont icondizhi'>&#xe75c;</View>添加配送地址
                                </View>
                        }
                    </View>
                </View>
                <View className='goodsAndMoney bgc-w border-radius-bottom marginTop10'>
                    {
                        handleGoodsInfo.map((i, n) => {
                            return (
                                <View key={i.name}>
                                    <View className='goods-item fsc'>
                                        <Image className='goods-thumb' src={crop(i.smallPic, 110)} mode='aspectFill'></Image>
                                        <View className='goods-content f1'>
                                            <View className='w100 fsbc fs28 c1a'>
                                                <View className='maxWidth ellipsis2'>{i.name}</View>
                                                <View>￥{i.specSelected.price}</View>
                                            </View>
                                            <View className='fsbc fs26 c999'>
                                                <View className='ellipsis2'>
                                                    {i.specSelected.name + ' ' + (i.attribute ? i.attribute.map(item => item.item.name).join(' ') : '')}                                                </View>
                                                <View>x{i.num}</View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }



                    <View className='line marginTop20'></View>

                    <View className='amount fsbc fs30'>
                        <View className='c000'>
                            {takePrice > 0 ? `配送费 ${takePrice}元` : canUseTake ? '免配送费' : '配送费 --'}
                        </View>
                        <View className='c333'>
                            <Text>已优惠￥{totalCount}{' '}</Text>
                            <Text>小计：</Text>
                            <Text className='c-red'>￥{totalPrice}</Text>
                        </View>
                    </View>
                </View>

                <View className='comments bgc-w fs30 c000' onClick={this.showTextarea.bind(this)}>
                    <View className='c000 marginBottom30'>订单留言</View>
                    {
                        showTextarea ? (
                            <Textarea className='w100 c666 textarea' placeholderClass='cb3' placeholder='如果有什么特殊说明，可以留言给我哦！' value={remarks} focus={textareaFocus} onBlur={this.hideTextarea.bind(this)} onInput={this.handleRemarksInput.bind(this)}></Textarea>
                        ) : (
                                <Text className={`${remarks.length < 1 ? 'cb3' : 'c666'} w100 textarea`} placeholderClass='cb3' >{remarks || '如果有什么特殊说明，可以留言给我哦！'}</Text>
                            )
                    }
                </View>

                <View className='totalCount bgc-w fsbc'>
                    {
                        canCreateOrder ? (
                            <View className='totalCount-count fs32 c333 fsc'>
                                总计：
                                <Text className='c-red'>￥{totalPrice}</Text>
                                <Text className='totalCount-discount f24 c9'>共优惠{totalCount}元</Text>
                            </View>
                        ) : addressInfo && addressInfo.id && !canUseTake ? (
                            <View className='totalCount-count f32 c3 flex'>{canUseTakeErrorMsg ? canUseTakeErrorMsg : '订单不满足配送条件'}</View>
                        ) : (
                            <View></View>
                        )
                    }
                    <View className={`pay cfff fcc fs30 ${canCreateOrder ? '' : 'pay-disabled'}`} onClick={this.preCreateOrder.bind(this)}>立即支付</View>
                </View>
                </View>
                
            </MyPage>
        )
    }
    
}

import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Textarea } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/order'
import { crop } from '../../utils/util'
import './index.scss'

@connect(state => state.order, { ...actions })
export default class Index extends Component {

  config = {
    navigationBarTitleText: '发表评价',
    backgroundColor: '#f2f3f7',
    navigationBarBackgroundColor: '#f2f3f7',
  }

  constructor() {
    super(...arguments);
    this.state = {
      comment: [],
      images: []
    }
}

  componentWillMount() {
    this.setState({
      order: JSON.parse(this.$router.params.item)
    }, () => {
      let comment = []
      this.state.order.goodsInfo.map((x, i) => {
        comment.push({
          topicId: x.goodsId,
          commentLevel: 1
        })
      })
      this.setState({
        comment
      })
    })
  }

  handleSetContent(index, e) {
    this.state.comment.map((x, i) => {
      if (i == index) {
        x.commentContent = e.detail.value
      }
    })
    this.setState({
      comment: this.state.comment
    })
  }

  closeImageEdit = () => {
    this.setState({
        editMode: false
    });
  }

  openImageEdit = () => {
    this.setState({
        editMode: true
    });
  }

  deleteImage = (index, e) => {
    e.stopPropagation();
    if (index < 0) return;
    let { images } = this.state;
    images.splice(index, 1);
    this.setState({ images });
    if (this.state.images.length < 1) {
        this.setState({
            editMode: false
        });
    }
  }


  previewImages = (index) => {
    if (this.state.editMode) {
        this.closeImageEdit();
        return;
    }
    let current = this.state.images[parseInt(index || 0)];
    if (current.status !== 2) return;
    let params = {
        urls: [],
        current: current.url,
    }
    this.state.images.map(i => {
        if (i.status !== 2) return;
        params.urls.push(i.url);
    });
    console.log(params)
    Taro.previewImage(params);
  }

  chooseImages = () => {
    let count = 3 - this.state.images.length;
    if (count < 1) return;
    Taro.chooseImage({
        count: count,
    }).then(res => {
        this.uploadImages(res.tempFilePaths);

    });
  }

  uploadImages = (paths = []) => {
    paths.map((url, index) => {
        let id = Number(new Date()) + index;
        let image = {
            id: id,
            url: url,
            progress: 0,    // 上传进度
            status: 0,      // 0 待上传（也有可能正在上传但是没有uploadTask, 反正就是个样式）  1 正在上传  2 上传完成  -1 上传失败
        }

        this.state.images.push(image);
        this.setState({
            images: this.state.images
        });

        let realIndex = this.state.images.length - 1;

        let uploadTask = Taro.uploadFile({
            url: `http://122.51.167.221:8000/mall/mgr/file/upload`,
            filePath: url,
            header: {
              token: Taro.$globalData.token
            },
            formData: {
              modules: 'order'
            },
            fileType: 'image',
            name: "file"
        }).then(res => {
            res = JSON.parse(res.data || "{}");
            let code = res.code;
            let data = res.data;
            let { images } = this.state;
            if (images[realIndex].id !== id) {
                realIndex = this.state.images.findIndex(i => i.id === id);
            }
            if (realIndex < 0) return;
            if (code < 0) {
                images[realIndex].status = -1;
                images[realIndex].errorMessage = data || "上传失败";
            } else {
                images[realIndex].status = 2;
                images[realIndex].onlineUrl = data.url;
                images[realIndex].id = data.id;
            }
            this.setState({
                images: this.state.images
            });
        }).catch(res => {
            console.log("error: ", res);
            let { images } = this.state;
            if (images[realIndex].id !== id) {
                realIndex = this.state.images.findIndex(i => i.id === id);
            }
            if (realIndex < 0) return;
            images[realIndex].status = -1;
            images[realIndex].errorMessage = res.errMsg;
            this.setState({
                images: this.state.images
            });
        });

        // 上传进度
        uploadTask && uploadTask.onProgressUpdate && uploadTask.onProgressUpdate(res => {
            if (res.progress >= 100 || res.progress <= 0) return;
            let { images } = this.state;
            if (images[realIndex].id !== id) {
                realIndex = this.state.images.findIndex(i => i.id === id);
            }
            if (realIndex < 0) return;
            images[realIndex].status = 1;
            images[realIndex].progress = res.progress;
            this.setState({
                images: this.state.images
            });
        });
    });
  }

  setcommentLevel(level, index) {
    this.state.comment.map((x, i) => {
      if (i == index) {
        x.commentLevel = level
      }
      return x
    })
    this.setState({
      comment: this.state.comment
    })
  }

  submit() {
    console.log(this.state.comment)
    if (this.state.comment.filter(x => !x.commentLevel).length > 0) {
      Taro.showModal({
        title: '提示',
        content: '请选择描述相符等级'
      })
    } else {
      this.props.dispatchCommentOrder({
        commentModels: this.state.comment,
        orderId: this.state.order.id
      }).then(() => {
        Taro.showToast({
          title: '评论成功',
          icon: 'success',
          duration: 800
        })
        Taro.$page['orderList'].changeList('')
        setTimeout(() => {
          Taro.navigateBack()
        }, 800)
      })
    }
  }

  render() {
    const { order, images, editMode } = this.state
    let canUpload = this.state.images.length < 3;

    return (
      <View className='page'>
        {
          order && order.goodsInfo.map((x, i) => {
            return (
              <View className={'goods-item' + (i > 0 ? ' mt20' : '')} key={x.goodsId}>
                <View className='title fsc'>
                  <Image src={crop(x.picture, 100)} className='goods-pic' />
                  <Text className='f1 ml30 ellipsis fs30 c666'>{x.name}</Text>
                </View>
                <View className='des-level fsbc'>
                  <Text className='fs36 c000 bold'>描述相符</Text>
                  <View className='fss'>
                    <View className={'iconfont fs66 c666' + (comment[i].commentLevel == 1 ? ' active' : '')} onClick={this.setcommentLevel.bind(this, 1, i)}>&#xe643;</View>
                    <View className={'iconfont fs66 c666 ml20' + (comment[i].commentLevel == 2 ? ' active' : '')} onClick={this.setcommentLevel.bind(this, 2, i)}>&#xe63e;</View>
                    <View className={'iconfont fs66 c666 ml20' + (comment[i].commentLevel == 3 ? ' active' : '')} onClick={this.setcommentLevel.bind(this, 3, i)}>&#xe63f;</View>
                  </View>
                </View>
                <View className='content'>
                  <Textarea
                    value={comment[i].commentContent}
                    placeholder='商品满足你的期待吗？说说你的心得，分享给想买的他们吧'
                    onInput={this.handleSetContent.bind(this, i)}
                    autoHeight
                    placeholderClass='c999 fs32'
                    className='c333 fs32 textarea'
                  >
                  </Textarea>
                  <View className='images-layout'>
                      {images.map((i, index) => {
                        return (
                          <View className='image-size image-border' key={index}>
                            <Image className='image-size' mode='aspectFill' src={i.url} onClick={this.previewImages.bind(this, index)} onLongPress={this.openImageEdit} />
                            {
                              i.status === 2 && !editMode ? "" : (
                                <View className='image-inner'>
                                  {
                                    i.status === 0 ? (
                                        <Image className='image-loading' mode='aspectFill' src='https://weapp-1253522117.image.myqcloud.com//image/20180919/7324accfe8e20358.gif' />
                                    ) : i.status === 1 ? (
                                        <Progress className='image-progress' percent={60} strokeWidth={3} backgroundColor='#c1c1c1' activeColor='#ffffff' />
                                    ) : i.status === -1 ? (
                                        i.errorMessage || "上传失败"
                                    ) : ""
                                  }
                                  {
                                    editMode && <View className='image-delete fcc' onClick={this.deleteImage.bind(this, index)}>x</View>
                                  }
                                </View>
                              )
                            }
                          </View>
                        );
                      })}
                      {canUpload && <View className='add image-size image-border' onClick={this.chooseImages}>+</View>}
                  </View>
                </View>
              </View>
            )
          })
        }
        <View className='fixed-button fec'>
          <View className='submit fs34' onClick={this.submit}>确认提交</View>
        </View>
      </View>
    )
  }
}
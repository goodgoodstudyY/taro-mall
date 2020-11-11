# taro-mall

![overview](https://qit-team.github.io/public/images/taro-yanxuan/overview.png)

[Taro](https://github.com/NervJS/taro) 多端统一实例（小程序 + H5 + React Native）。

## 效果预览

如下是 **React Native** 的运行截图：

| 首页、分类 | 详情、加购物车 | 购物车、个人 |
| :--------: | :--------:| :--------: |
| ![首页、分类](https://qit-team.github.io/public/images/taro-yanxuan/video-01.gif) | ![二级分类、详情](https://qit-team.github.io/public/images/taro-yanxuan/video-02.gif) | ![购物车、个人](https://qit-team.github.io/public/images/taro-yanxuan/video-03.gif) |

## 本地运行

``` bash
# 安装依赖，或 npm i
yarn

# 运行小程序，编译后的文件位于项目下的 dist 文件夹
# （微信 dev:weapp，支付宝 dev:alipay）
npm run dev:weapp

# 运行 H5
npm run dev:h5

# 运行 React Native，请务必查阅文档：https://nervjs.github.io/taro/docs/react-native.html
npm run dev:rn
```

## 项目说明

本项目的主要目的是阐述多端开发思路、技巧，力求直观、方便阅读，因此是在 `taro init` 的基础上开发的，没有去做太多封装。诸如是用 Redux 还是 Mobx，网络请求怎么封装比较完美并不是本项目的重点。

本项目不会去实现一个完整的商城，但也实现了足够多的功能、细节进行踩坑，具体涉及的踩坑点、注意事项都在代码中以注释 `// TODO`（Taro 还未支持的）、`// NOTE`（开发技巧、注意事项）注明了。

最后，有一点很遗憾，就是一开始没有保留一份 mock 数据。

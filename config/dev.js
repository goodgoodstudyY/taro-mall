// NOTE H5 端使用 devServer 实现跨域，需要修改 package.json 的运行命令，加入环境变量
const HOST = '"http://122.51.167.221:8000/mall"'
const HOST_M = '"http://122.51.167.221:8000/mall"'

module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
    HOST: HOST,
    HOST_M: HOST_M
  },
  weapp: {}
}

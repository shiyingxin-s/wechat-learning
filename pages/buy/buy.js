//index.js
//获取应用实例
const app = getApp()
// const util = require('../../utils/util.js')
Page({
  data: {
    viewHeight:app.globalData.navHeight,
    userData: null, // 获取缓存用户信息
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '购买课程', //导航栏 中间的标题,
      isBackPer: true, //显示返回按钮,
      bgColor:'#ffffff' //导航背景色
    }
  },
 
  onLoad: function () {
   
  },
  onShow:function(){
    let wxs = this
  }
 
})

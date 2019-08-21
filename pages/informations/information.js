//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
     viewHeight:app.globalData.navHeight,
     // 组件所需的参数
     nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '资讯', //导航栏 中间的标题,
      isBackPer: false, //不显示返回按钮,
      bgColor:'#ffffff' //导航背景色
    },
  },
  onLoad: function () {
    
  },
  // 切换tab
  onClick(event) {
    wx.showToast({
      title: `点击标签 ${event.detail.index + 1}`,
      icon: 'none'
    });
  },
  buy:function(){
    let wxs = this
    wx.navigateTo({
      url: '../buy/buy'
    })
  }
})

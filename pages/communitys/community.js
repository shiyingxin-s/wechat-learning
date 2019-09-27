//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    viewHeight:app.globalData.navHeight,
    userData: null, // 获取缓存用户信息
    imgalist:[ 
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496287851&di=0a26048f586b852193cb5026d60c4fad&imgtype=jpg&er=1&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F12%2F74%2F05%2F99C58PICYck.jpg',
      'https://res.wx.qq.com/wxdoc/dist/assets/img/1.d0a16186.png', 
      ],
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '社区', //导航栏 中间的标题,
      isBackPer: false //不显示返回按钮,
    },
  },
 
  onLoad: function () {
   
  },
  onShow:function(){
    let wxs = this
  },
  previewImage:function(e) {
    var current='../../images/common/2.png';
    wx.previewImage({
          current: current, // 当前显示图片的http链接
          urls: this.data.imgalist // 需要预览的图片http链接列表
    })
  },
  create:function(){
    let wxs = this
    wx.navigateTo({
      url: '../communitys/create/create'
    })
  }
})

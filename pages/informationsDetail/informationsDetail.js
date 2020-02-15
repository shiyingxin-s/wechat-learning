//index.js
//获取应用实例
const app = getApp()

const common = require('../../utils/common.js');
const util = require('../../utils/util.js')
Page({
  data: {
     viewHeight:app.globalData.navHeight,
     // 组件所需的参数
     nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '资讯', //导航栏 中间的标题,
      isBackPer: true, //不显示返回按钮,
      bgColor:'#ffffff' //导航背景色
    },
    showLoading: true,
    detailData: '',
    newsNo: '',
  },
  onLoad: function (options) {
    let wxs = this
    wx.getSystemInfo({
      success: function (res) {
        wxs.setData({
          scrollHeight: res.windowHeight - 108
        })
      },
    })
    wxs.setData({
      newsNo: options.id
    })
  
  },
  onShow:function(){
    this.setData({
      showLoading:true,
      informationList: []
    })
    this.getInformationInfo()
    // this.getCopybookList()
  },
  //资讯列表
  getInformationInfo:function(){
    let wxs = this
    app.httpRequest({
      api: '/xbg-api/api/news/info',
      method: "POST",
      data: {
        newsNo: wxs.data.newsNo
      },
      success: function (res) {
        if (res.code === 0) {
          wxs.setData({
            detailData: res.news
          })
        } else {
          common.showToast(res.msg, 3000)
        }
      },
      fail: function (res) {
        common.showToast(res.msg, 3000)
      },
      complete: () => {
        wxs.setData({
          showLoading:false
        })
        //complete接口执行后的回调函数，无论成功失败都会调用
      }
    })
  }
   
})

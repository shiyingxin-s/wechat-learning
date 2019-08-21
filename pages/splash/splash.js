//index.js
//获取应用实例
const app = getApp()
const common = require('../../utils/common.js');
Page({
  data: {
    userData: null // 获取缓存用户信息
  },

  onLoad: function () {
    wx.switchTab({
      url: '../communitys/community',
    })
  },
  onShow: function(){
    let wxs = this
    // 获取缓存
    wxs.setData({
      userData: common.getStorageSync('userData'),
      page:1
    })
    // 无缓存时
    if (!wxs.data.userData || !wxs.data.userData.token){
      wxs.loginFun()
    } else {
      if (wxs.data.userData.avatarUrl) {
        wxs.goUrl();
      }
    }
  },
  // 欢迎页消失
  goUrl: function(){
    setTimeout(function () {
      wx.switchTab({
        url: '../communitys/community',
      })
    }, 1000)
  },
  getUserInfo: function(e) {
    var wxs = this
    wxs.goUrl()
  },
  // 登录
  loginFun(){
    var wxs = this
    app.wxLogin().then(res => {
      if (res.code === 200) {
        // 成功
        wxs.setData({
          userData: app.userData
        })
      }
    })
  }
})

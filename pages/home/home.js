// pages/home/home.js

const app = getApp()

const common = require('../../utils/common.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    viewHeight:app.globalData.navHeight,
    // 组件所需的参数
    nvabarData: {
     showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
     title: '首页', //导航栏 中间的标题,
     isBackPer: false, //不显示返回按钮,
     bgColor:'#ffffff' //导航背景色
    },
    background: ['demo-bg-1', 'demo-bg-2', 'demo-bg-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 最新 方法

  // 功能区 模块跳转
  goPath:function(e){
    let path = e.currentTarget.dataset.route
    wx.navigateTo({
      url: path
    })
  }
})
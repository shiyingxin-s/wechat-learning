// pages/personals/myStudy/myStudy.js

const app = getApp()
import Toast from '../../../dist/toast/toast';
const common = require('../../../utils/common.js');
const commonServe = require('../../../utils/commServe.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.navHeight * 2 + 20 ,
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的学习', //导航栏 中间的标题,
      isBackPer: true, //不显示返回按钮,
      bgColor:'#ffffff' //导航背景色
    },
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

  }
})
// pages/search/search.js
//index.js
//获取应用实例
const app = getApp()

const common = require('../../utils/common.js');
import Toast from '../../dist/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.navHeight * 2,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '习字格', //导航栏 中间的标题,
      isBackPer: true, //不显示返回按钮,
      bgColor: '#5773fd', //导航背景色
      textcolor: '#ffffff'
    },

    //扫码图标
    scanPic: '../../images/common/scan.png',
    //搜索课程
    searchValue: '',
    //消息图标
    messagePic: '../../images/common/message.png',
    //搜索图标
    searchIcon: '../../images/common/search.png',
    //录音图标
    recordIcon: '../../images/common/record.png',

    //搜索内容
    searchTxt: "",

    searchList: [],

    words: [],
  },

  bindKeyInput: function (e) {
    console.log("e", e)
    this.setData({
      searchTxt: e.detail
    })

    if (e.detail == "") {
      this.setData({
        words: {},
        searchList: []
      })
    }
  },

  searchFun: function () {
    this.setData({
      searchList: "",

    })
    console.log("searchTxt", this.data.searchTxt)
    this.searchSbujectList()
  },

  //课程检索
  searchSbujectList() {
    let wxs = this

    app.httpRequest({
      api: '/xbg-api/api/course/search',
      method: "POST",
      data: {
        page: "1",
        limit: "999",
        keyWord: wxs.data.searchTxt
      },
      success: function (res) {
        console.log("res", res)
        if (res.code === 0) {
          if (res.page || res.words) {
            wxs.setData({
              searchList: res.page.list,
              words: res.words,
              page: res.page.currPage,
              totalPage: res.page.totalPage,
              total: res.page.total
            })
          }


        } else {

          common.showToast(res.msg, 3000)
        }
      },
      fail: function (res) {

        common.showToast(res.msg, 3000)
      },
      complete: () => {
        //complete接口执行后的回调函数，无论成功失败都会调用
      }
    })
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
  //进入视频课堂页面
  goStudentDetail: function (e) {
    console.log("e", e.currentTarget.dataset.item.hasBuy)
    if (e.currentTarget.dataset.item.hasBuy == 0) {
      wx.navigateTo({
        url: '../learningClassrom/learningClassrom?courseno=' + e.currentTarget.dataset.item.courseno + "&learnstatus=" + e.currentTarget.dataset.item.learnStatus,
      })
    } else {
      Toast.fail('未购买该课件,无法学习')
    }

  },

  //进入学字详情
  goWordsDetail: function (e) {
    console.log("e", e.currentTarget.dataset.item.hasBuy)
    if (e.currentTarget.dataset.item.hasBuy == 0) {
      wx.navigateTo({
        url: '../learningClassrom/learningClassrom?character=' + e.currentTarget.dataset.item.character,
      })
    } else {
      Toast.fail('未购买该课件,无法学习')
    }
  },
})
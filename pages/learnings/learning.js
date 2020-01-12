//index.js
//获取应用实例
const app = getApp()

const common = require('../../utils/common.js');

Page({
  data: {
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.navHeight * 2,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的', //导航栏 中间的标题,
      isBackPer: false, //不显示返回按钮,
      bgColor: 'none' //导航背景色
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
    //学习图标
    studyIcon: '../../images/common/study.png',
    //知识超市图标
    knowledgeIcon: '../../images/common/knowledge.png',
    activeNames:"",
    //我的学习数据集合
    studyList: [],
    courseList: [],
    //知识超市的数据集合
    marketList: [],

    //分页参数
    //当前页
    page: "1",
    //总页数
    pageSize: 1,
    //总记录数
    total: 1,
    //每页记录数
    pageSize: "10",
    //总页数
    totalPage: "10",
    //搜索内容
    searchTxt: ""

  },
  //进入搜索页面
  goSearch: function () {
    wx.navigateTo({
      url: '../search/search',
    })
  },

  //进入视频课堂页面
  goStudentDetail: function () {
    wx.navigateTo({
      url: '../learningClassrom/learningClassrom',
    })
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  //上拉加载我的学习课程列表
  lowerGetMySbujectList: function (e) {
    console.log("加载我的学习课程列表 ", e)
  },

  bindKeyInput: function (e) {
    console.log("e", e)
    this.setData({
      searchTxt: e.detail
    })
  },

  onChangeCourse: function (event) {
    console.log("event", event)
    this.setData({
      activeNames:event.detail
    })
    let wxs = this

    app.httpRequest({
      api: '/xbg-api/api/user/getMyCourseList',
      method: "POST",
      data: {
        gradeNo: event.detail[0],
        page: "1",
        limit: "999"
      },
      success: function (res) {
        console.log("查询课程响应", res)
        if (res.code == 0) {
          wxs.setData({
            courseList: res.page.list,
            // page: res.page.currPage,
            // totalPage: res.page.totalPage,
            // total: res.page.total
          })

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



  //查询我的学习课程列表
  getMySbujectList: function () {
    let wxs = this

    app.httpRequest({
      api: '/xbg-api/api/user/getMyGradeList',
      method: "POST",
      data: {
        // userId: 8,
        // page: wxs.data.page,
        // limit: wxs.data.pageSize
      },
      success: function (res) {
        console.log("查询我的学习响应", res)
        if (res.code == 0) {
          wxs.setData({
            studyList: res.page,
            // page: res.page.currPage,
            // totalPage: res.page.totalPage,
            // total: res.page.total
          })

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

  //查询知识超市列表数据
  getSbujectList: function () {

    let wxs = this

    app.httpRequest({
      api: '/xbg-api/api/course/all',
      method: "POST",
      data: {
        page: wxs.data.page,
        limit: "5"
      },
      success: function (res) {
        console.log("查询知识超市", res)
        if (res.code == 0) {
          wxs.setData({
            marketList: wxs.data.marketList.concat(res.page.list),
            page: res.page.currPage,
            totalPage: res.page.totalPage,
            total: res.page.total
          })

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

  //上拉加载知识超市列表数据
  lowerGetSbujectList: function (e) {
    let wxs = this
    console.log("知识超市列表数据", e)
    console.log("wxs.data.page", wxs.data.page)
    console.log("wxs.data.totalPage", wxs.data.totalPage)
    if (wxs.data.page < wxs.data.totalPage) {
      wxs.setData({
        page: (wxs.data.page + 1).toString()
      })
      wxs.getSbujectList()
    }
  },

  searchFun: function () {
    console.log("searchTxt", this.data.searchTxt)
    this.searchSbujectList()
  },



  onLoad: function () {
    this.getMySbujectList()
    this.getSbujectList()
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //跳转到详情页
  goDetails: function (e) {
    console.log("e", e)
    if (e.currentTarget.dataset.hasbuy == 1) {
      wx.navigateTo({
        url: '/pages/buy/buy',
      })
    } else {
      wx.navigateTo({
        url: '../learningClassrom/learningClassrom?sbujectId=' + e.currentTarget.dataset.courseno,
      })
    }

  },
  upper: function (e) {
    console.log(e)
  },
  lower: function (e) {
    console.log(e)
  },
  scroll: function (e) {
    console.log(e)
  },

})
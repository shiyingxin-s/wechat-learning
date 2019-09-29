//index.js
//获取应用实例
const app = getApp()

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
      bgColor: '#ffffff' //导航背景色
    },

    //扫码图标
    scanPic:'../../images/common/scan.png',
    //搜索课程
    searchValue:'',
    //消息图标
    messagePic:'../../images/common/message.png',
    //搜索图标
    searchIcon:'../../images/common/search.png',
    //录音图标
    recordIcon:'../../images/common/record.png',
    //学习图标
    studyIcon:'../../images/common/study.png',
    //知识超市图标
    knowledgeIcon:'../../images/common/knowledge.png',

    //我的学习数据集合
    studyList:[
      {
        name:'三年级(下)',
        value:'学习中'
      },
      {
        name: '三年级(下)',
        value: '学习中'
      },
      {
        name: '三年级(下)',
        value: '学习中'
      },
      {
        name: '三年级(下)',
        value: '学习中'
      },
      {
        name: '三年级(下)',
        value: '学习中'
      },
      {
        name: '三年级(下)',
        value: '学习中'
      }
    ],

    //知识超市的数据集合
    marketList: [
      {
        name: '三年级(下)',
        value: '学习中'
      },
      {
        name: '三年级(下)',
        value: '学习中'
      },
      {
        name: '三年级(下)',
        value: '学习中'
      },
      {
        name: '三年级(下)',
        value: '学习中'
      },
      {
        name: '三年级(下)',
        value: '学习中'
      },
      {
        name: '三年级(下)',
        value: '学习中'
      },
      {
        name: '三年级(下)',
        value: '学习中'
      },    
      {
        name: '三年级(下)',
        value: '学习中'
      },
      {
        name: '三年级(下)',
        value: '学习中'
      },
      {
        name: '三年级(下)',
        value: '学习中'
      },
      {
        name: '三年级(下)',
        value: '学习中'
      },
      {
        name: '三年级(下)',
        value: '学习中'
      },
      {
        name: '三年级(下)',
        value: '学习中'
      },
      {
        name: '三年级(下)',
        value: '学习中'
      },   
    ],    
    
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //跳转到详情页
  goDetails:function(e){
    wx.navigateTo({
      url: '/pages/learningClassrom/learningClassrom',
    })
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

  upper2: function (e) {
    console.log(e)
  },
  lower2: function (e) {
    console.log(e)
  },
  scroll2: function (e) {
    console.log(e)
  },
})

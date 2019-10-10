//index.js
//获取应用实例
const app = getApp()

const common = require('../../utils/common.js');

// pages/learnings/learningClassrom/learningClassrom.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.navHeight * 2,
    //视频demo
    videoDemo:'http://gsxcxbucket-1254282420.coscd.myqcloud.com/staticResource/video/index/show.mp4',
    //课程标题信息
    courseTitle:"第十二课 生字",
    //生字数据
    newWordList:[
      {
        //生字名称
        newWord:'美',
        //偏旁
        component:'羊',
        //结构
        structure:'上下结构',
        //读音
        pronunciation:'mei',
        //词组
        wordGroup:[
          '美丽',
          '美好',
          '完美',
          '美丑',
          '美术',
          '美工'
        ],

        sbujectId:''

      }
    ],


    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '视频课堂', //导航栏 中间的标题,
      isBackPer: true, //不显示返回按钮,
      bgColor: 'none' //导航背景色
    },

  },

  //视频课堂
  getVoideos:function(){
    let wxs = this


    app.httpRequest({
      api: '/xbg-api/api/course/all',
      method: "POST",
      data: {
        token: common.getStorageSync('userData').token,
        sbujectId: wxs.data.sbujectId
      },
      success: function (res) {
        console.log("获取视频课堂数据的响应", res)
        if (res.code === 0) {
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options){
      
      this.setData({
        sbujectId: options.sbujectId
      })
      this.getVoideos();
    }
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
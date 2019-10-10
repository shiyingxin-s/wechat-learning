//index.js
//获取应用实例
const app = getApp()

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
        ]

      }
    ]

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
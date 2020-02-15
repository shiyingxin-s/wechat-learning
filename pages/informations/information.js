//index.js
//获取应用实例
const app = getApp()

const common = require('../../utils/common.js');

Page({
  data: {
     viewHeight:app.globalData.navHeight,
     // 组件所需的参数
     nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '资讯', //导航栏 中间的标题,
      isBackPer: false, //不显示返回按钮,
      bgColor:'#ffffff' //导航背景色
    },
    showLoading: true,
    //informationList
    informationList:[],
    copyBookList:[],
    

    //分页参数
    //当前页
    page: "1",
    //总页数
    pageSize: 1,
    //总记录数
    total: 1,
    //每页记录数
    pageSize: "5",
    //总页数
    totalPage: "10",

    scrollHeight:''

  },
  onLoad: function () {
    let wxs = this
    wx.getSystemInfo({
      success: function (res) {
        wxs.setData({
          scrollHeight: res.windowHeight - 108
        })
      },
    })
  
  },
  onShow:function(){
    this.setData({
      showLoading:true,
      informationList: []
    })
    this.getInformationList()
    // this.getCopybookList()
  },
  //资讯列表
  getInformationList:function(){
    let wxs = this
    app.httpRequest({
      api: '/xbg-api/api/news/list',
      method: "POST",
      data: {
        page: wxs.data.page + '',
        limit: wxs.data.pageSize
      },
      success: function (res) {
        console.log("资讯列表的响应", res)
        if (res.code === 0) {

          wxs.setData({
            informationList: wxs.data.informationList.concat(res.page.list),
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
        wxs.setData({
          showLoading:false
        })
        //complete接口执行后的回调函数，无论成功失败都会调用
      }
    })
  },

  //成人字帖列表
  getCopybookList:function(){
    let wxs = this
    app.httpRequest({
      api: '/xbg-api/api/course/list',
      method: "POST",
      data: {
        page: wxs.data.page +'',
        limit: wxs.data.pageSize,
        gradeNo:0
      },
      success: function (res) {
        console.log("成人字帖列表数据响应", res)
        if (res.code === 0) {
          wxs.setData({
            copyBookList: res.page.list,
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
   //上拉加载社区列表数据
   lowerGetInformationList: function (e) {
    let wxs = this
    if (wxs.data.page < wxs.data.totalPage) {
      wxs.setData({
        page: (wxs.data.page + 1).toString()
      })
      wxs.getInformationList()
    }
  },
  // 切换tab
  onClick(event) {
    let wxs = this
    if(event.detail.index === 0){
      wxs.getInformationList()
    }else{
      wxs.getCopybookList()
    }
    // wx.showToast({
    //   title: `点击标签 ${event.detail.index + 1}`,
    //   icon: 'none'
    // });
  },
  goBuy:function(e){
    debugger
    if (e.currentTarget.dataset.hasbuy === 0) {
      wx.navigateTo({
        url: '/pages/buy/buy?id='+ e.currentTarget.dataset.id,
      })
    } 
  }
})

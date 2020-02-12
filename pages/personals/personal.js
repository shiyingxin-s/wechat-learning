//index.js
//获取应用实例
const app = getApp()
import Toast from '../../dist/toast/toast';
const common = require('../../utils/common.js');

Page({
  data: {
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.navHeight * 2 + 25 ,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的', //导航栏 中间的标题,
      isBackPer: false, //不显示返回按钮,
      bgColor:'#ffffff' //导航背景色
    },
    scrollHeight:'',
    //折叠面板名称
    activeNames:'1',

    //个人信息
    userInfo:{},

    //收货地址
    address:{},
    page: "1",
    //总记录数
    total: 1,
    //每页记录数
    pageSize: "10",
    //总页数
    totalPage: 0,
    orderList: [],

    show: false,

    nikiname:"",
    age:"",
    grade:""

  },

  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },

  inputNikiname(e){
    console.log("e",e)
    this.setData({
      nikiname:e.detail
    })
  },

  inputAge(e){
    console.log("e",e)
    this.setData({
      age:e.detail
    })
  },

  inputGrade(e){
    console.log("e",e)
    this.setData({
      grade:e.detail
    })
  },

  //修改个人信息
  updateUserInfo:function(){
    let wxs = this
    if(wxs.data.nikiname == ""){
      Toast.fail("昵称不能为空")
      return false
    }
    if(wxs.data.age == ""){
      Toast.fail("年龄不能为空")
      return false
    }
    if(wxs.data.grade == ""){
      Toast.fail("年级不能为空")
      return false
    }

    console.log("wxs.data.userInfo.grade",wxs.data.userInfo.grade)
    

      app.httpRequest({
        api: '/xbg-api/api/user/editUserInfo',
        method: "POST",
        data: {
          "userno":wxs.data.userInfo.userno,
          "nikiname":wxs.data.nikiname,
          "phoneno":wxs.data.userInfo.phoneno,
          "age": wxs.data.age,
          "grade":wxs.data.grade,
          "openid":wxs.data.userInfo.openid,
        },
        success: function (res) {
          console.log("修改个人信息的相应", res)
          if (res.code === 0) {
            Toast.success('修改成功');
            wxs.setData({ show: false });
            wxs.getUserInfoApi()
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

  //获取个人信息
  getUserInfoApi:function(){
    let wxs = this

    app.httpRequest({
      api: '/xbg-api/api/user/getUserInfo',
      method: "POST",
      data: {},
      success: function (res) {
        console.log("获取个人信息的响应", res)
        if (res.code === 0) {
          wxs.setData({
            userInfo: res.data,
            nikiname:res.data.nikiname,
            age:res.data.age,
            grade:res.data.grade
          })
          if(!wxs.data.userInfo.address){
            wxs.getAddress()

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
  getOrderList(){
    let wxs = this

    app.httpRequest({
      api: '/xbg-api/api/orderinfo/list',
      method: "POST",
      data: {
        page: wxs.data.page +'',
        limit: wxs.data.pageSize
      },
      success: function (res) {
        if (res.code === 0) {
          let list = res.page.list.filter(item=> item.paystatus)
          wxs.setData({
            orderList: wxs.data.orderList.concat(list),
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
    wx.getSystemInfo({
      success: res=> {
        this.setData({
          scrollHeight: res.windowHeight - 108
        })
      },
    })
    this.getUserInfoApi()

  },
  onShow:function(){
    this.getOrderList()
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //onchange
  onChange:function(event){
    console.log("onChange event",event)
    this.setData({
      activeNames: event.detail
    });
  },
 //上拉加载社区列表数据
 lowerGetOrderList: function (e) {
  let wxs = this
  console.log("加载社区列表数据", e)
  if (wxs.data.page < wxs.data.totalPage) {
    wxs.setData({
      page: (wxs.data.page + 1).toString()
    })
    wxs.getOrderList()
  }
},
  //获取用户收货地址
  getAddress:function(){
    let wxs = this
    wx.chooseAddress({
      success(res) {
        console.log("获取用户收货地址",res)
        wxs.setData({
          address:res
        })

        app.httpRequest({
          api: '/xbg-api/api/user/editUserInfo',
          method: "POST",
          data: {
            "userno":wxs.data.userInfo.userno,
            "address":wxs.data.address.provinceName + wxs.data.address.cityName + wxs.data.address.countyName + wxs.data.address.detailInfo,
            "openid":wxs.data.userInfo.openid,
          },
          success: function (res) {
            console.log("修改个人信息的相应", res)
            if (res.code === 0) {
              Toast.success('修改成功');
              wxs.setData({ show: false });
              wxs.getUserInfoApi()
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
      }
    })
  },
})

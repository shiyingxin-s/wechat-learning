//index.js
//获取应用实例
const app = getApp()
const common = require('../../utils/common.js');
// const util = require('../../utils/util.js')
Page({
  data: {
    viewHeight:app.globalData.navHeight,
    userData: null, // 获取缓存用户信息
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '购买课程', //导航栏 中间的标题,
      isBackPer: true, //显示返回按钮,
      bgColor:'#ffffff' //导航背景色
    },
    id: 0,
    course: {},
    //收货地址
    address: null,
    openId: common.getStorageSync('userData').openId,
    phone: common.getStorageSync('userData').telephone,
    remarks: '',
    orderNo: null
  },
 
  onLoad: function (options) {
    if(options.id){
      this.setData({
        id:options.id
      })
      this.getInfo()
    }
  },
  onShow:function(){
    let wxs = this
  },
  //获取用户收货地址
  getAddress:function(){
    let wxs = this
    wx.chooseAddress({
      success(res) {
        wxs.setData({
          address: res.provinceName + res.cityName + res.countyName + res.detailInfo
        })
      }
    })
  },
  bindPhone: function(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  bindAddress: function(e) {
    this.setData({
      address: e.detail.value
    });
  },
  bindRemark: function(e) {
    this.setData({
      remarks: e.detail.value
    });
  },
  //获取购买信息
  getInfo:function(){
    let wxs = this
    app.httpRequest({
      api: '/xbg-api/api/grade/info/'+ wxs.data.id,
      method: "POST",
      data: {},
      success: function(res) {
        if (res.code == 0) {
          wxs.setData({
            course:res.grade
          })
        } else {
          common.showToast(res.msg, 3000)
        }
      },
      fail: function(res) {
        common.showToast(res.msg, 3000)
      },
      complete: () => {
        //complete接口执行后的回调函数，无论成功失败都会调用
      }
    })
  },
  // 订单生成 去支付
  toPayBtn(){
    const wxs = this
    let datas ={
      openId: wxs.data.openId,
      orderNo: wxs.data.orderNo
    }
    wxs.getWXPay(datas)
  },
  // 购买事件
  payBtn() {
    const wxs = this
    let data = {
      openId: wxs.data.openId,
      gradeId: wxs.data.course.id,  //购买课程必须以年级为单位
      phone: wxs.data.phone, //如果是赠送就填受赠人的电话
      address: wxs.data.address, //收货地址
      remarks: wxs.data.remarks //0.自购，1.赠送
    }
    const reg = /^1\d{10}$/
    if(!data.phone){
      common.showToast('请填写手机号码', 3000)
      return
    } 
    if(!reg.test(data.phone)){
      common.showToast('请输入正确的手机号码', 3000)
      return
    }
    if(!data.address && wxs.data.course.type === 1){
      common.showToast('请选择收货地址', 3000)
      return
    }
    wxs.createOrder(data)
  },
  // 生成订单
  createOrder(data) {
    const wxs = this
    app.httpRequest({
      api: '/xbg-api/api/orderinfo/save',
      method: "POST",
      data: data,
      success: function(res) {
        if (res.code == 0) {
          wxs.setData({
            orderNo:res.orderNo
          })
          let datas ={
            openId: wxs.data.openId,
            orderNo:wxs.data.orderNo
          }
          wxs.getWXPay(datas)
        } else {
          common.showToast(res.msg, 3000)
        }
      },
      fail: function(res) {
        common.showToast(res.msg, 3000)
      },
      complete: () => {
        //complete接口执行后的回调函数，无论成功失败都会调用
      }
    })
  },
  //  获取支付体
  getWXPay(data) {
    const wxs = this
    app.httpRequest({
      api: '/xbg-api/api/pay/wxPay',
      method: "POST",
      data: data,
      success: function(res) {
        if (res.code == 0) {
          wxs.requestPayment(res.resp)
        } else {
          common.showToast(res.msg, 3000)
        }
      },
      fail: function(res) {
        common.showToast(res.msg, 3000)
      },
      complete: () => {
        //complete接口执行后的回调函数，无论成功失败都会调用
      }
    })
  }, 
   //调用微信支付接口
   requestPayment:function(res){
    var wxs = this
    wx.requestPayment({
      timeStamp: res.timeStamp,
      nonceStr: res.nonceStr,
      package: res.package,
      paySign: res.paySign,
      signType: res.signType,
      success:res=>{
        wx.switchTab({
          url: '/pages/learnings/learning',
        })
      },
      fail:function(res){
        common.showToast('支付失败', 3000)
      },
      complete: function(){
       
      }
    })
   }
  
})

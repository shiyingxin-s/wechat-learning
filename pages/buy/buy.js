//index.js
//获取应用实例
const app = getApp()
const common = require('../../utils/common.js');
const commonServe = require('../../utils/commServe.js');
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
    show: false,
    id: 0,
    course: {},
    //收货地址
    name: null,
    address: null,
    openId: common.getStorageSync('userData').openId,
    phone: '',
    remarks: '',
    orderNo: null,
    count: 1
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
    wxs.setData({
      userData: common.getStorageSync('userData')
    })
    if(!common.getStorageSync('userData').telephone){
      this.setData({
        show: true
      })
    } else{
      this.setData({
        phone: wxs.data.userData.telephone
      })
    }
  },
  /**
   * 获取用户手机号
   * @param {} e 
   */
  getPhoneNumber: function (e){
    var wxs = this
    var detail = e.detail
    // 获取用户手机号
    app.httpRequest({
      api: '/xbg-api/api/parsePhoneNo',
      method: "POST",
      data: {
        openId: wxs.data.userData.openId,
        encrypted: detail.encryptedData,
        iv: detail.iv
      },
      complete: function(res){
        if (res.code == 0 ){
          wxs.setData({
            phone: res.data.phoneno,
            'userData.telephone': res.data.phoneno
          })
          common.setStorageSync('userData', wxs.data.userData)
          var userInfo = {
            nickName: wxs.data.userData.nickName,
            openId: wxs.data.userData.openId,
            grade: wxs.data.userData.grade,
            telephone: wxs.data.userData.telephone,
            address: wxs.data.userData.address,
            avatarUrl: wxs.data.userData.avatarUrl,
            userNo: wxs.data.userData.userNo +''
          }
          commonServe.saveUserInfo(userInfo).then(res => {
            if (res.code === 0) {
            }
          })
        } else {
          common.showToast(res.msg)
        }
      }
    })
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
  bindName: function(e) {
    this.setData({
      name: e.detail.value
    });
  },
  bindCount: function(e) {
    this.setData({
      count: e.detail.value
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
      name: wxs.data.name,
      gradeId: wxs.data.course.id,  //购买课程必须以年级为单位
      phone: wxs.data.phone, //如果是赠送就填受赠人的电话
      address: wxs.data.address, //收货地址
      remarks: wxs.data.remarks ,//0.自购，1.赠送
      count: parseInt(wxs.data.count)
    }
    const reg = /^1\d{10}$/
    if(!data.phone){
      common.showToast('请填写手机号码', 3000)
      return
    } 
    if(!data.name){
      common.showToast('请填写收货人姓名', 3000)
      return
    }     
    if(!parseInt(data.count) && wxs.data.course.type === 1){
      common.showToast('购买数量必须大于0', 3000)
      return
    } 
    if(!reg.test(data.phone)){
      common.showToast('请输入正确的手机号码', 3000)
      return
    }
    if(!data.address){
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

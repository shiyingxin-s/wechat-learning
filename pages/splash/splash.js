const app = getApp()
const common = require('../../utils/common.js');
const commonServe = require('../../utils/commServe.js');
Page({
  data: {
    userData: null, // 获取缓存用户信息
  },

  onLoad: function () {
    common.removeStorageSync('userData')
  },
  onShow: function(){
    let wxs = this
    // 获取缓存
    wxs.setData({
      userData: common.getStorageSync('userData')
    })
    // 无缓存时
    if (!wxs.data.userData || !wxs.data.userData.token){
      wxs.loginFun()
    } else {
      wxs.goUrl()
    }
  },
  // 登录
  loginFun(){
    var wxs = this
    app.wxLogin().then(res => {
      if (res.code === 0) {
        // 成功
        // wxs.setData({
        //   userData: common.getStorageSync('userData')
        // })
        wxs.goUrl()
      }
    })
  },
  // 欢迎页消失
  goUrl: function(){
    var wxs = this
    // if(wxs.data.userData.avatarUrl && wxs.data.userData.telephone){
      setTimeout(function () {
        wx.switchTab({
          url: '/pages/home/home',
        })
      }, 1000)
    // }
  },
  /**
   * 获取用户 -- 头像、昵称、手机号 数据处理
   * @param {number} type, 1 -- 昵称，头像；2 -- 手机号(2暂时废弃)
   * 
   */
  userInfoHandle(type,user) {
    var wxs = this
    let nickName,avatarUrl,tel
    if (type === 1){
      [nickName,avatarUrl,tel] = [user.nickName,user.avatarUrl, wxs.data.userData.telephone]
    }
    if (type === 2){
      [nickName,avatarUrl,tel] = [wxs.data.userData.nickName,wxs.data.userData.avatarUrl,user.telephone]
    }
    let userInfo= {
      nickName: nickName,
      openId: wxs.data.userData.openId,
      grade: wxs.data.userData.grade,
      telephone: tel,
      address: wxs.data.userData.address,
      avatarUrl: avatarUrl,
      userNo: wxs.data.userData.userNo +''
    }
    return userInfo
  },
  /**
   * 获取用户 -- 昵称、头像
   * @param {*} e 
   */
  getUserInfo: function(e) {
    var wxs = this
    let userInfo = wxs.userInfoHandle(1,e.detail.userInfo)
    commonServe.saveUserInfo(userInfo).then(res => {
      if (res.code === 0) {
        wxs.setData({
          'userData.nickName': userInfo.nickName,
          'userData.avatarUrl': userInfo.avatarUrl
        })
        common.setStorageSync('userData', wxs.data.userData)
        wxs.goUrl()
        
      }
    })
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
            'userData.telephone': res.data.phoneno
          })
          common.setStorageSync('userData', wxs.data.userData)
          wxs.goUrl()
        } else {
          common.showToast(res.msg)
        }
      }
    })
  }
})

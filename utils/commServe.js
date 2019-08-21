const common = require('../utils/common.js');
const app = getApp();

let commonServe = {
  // 保存 -- 用户 （头像，昵称）信息接口
  saveUserInfo:function (userInfo) {
    app.httpRequest({
      api: '/consumer/loginMsg',
      method: "post",
      data: {
        openId: userInfo.openId,
        unionId: userInfo.unionId,
        appId: app.appId,
        nickname: userInfo.nickName,
        headImgUrl: userInfo.avatarUrl,
      },
      success: function (res) {
        if (res.error === 0) {
          var userData = common.getStorageSync('userData')
          userData.nickName = userInfo.nickName
          userData.avatarUrl = userInfo.avatarUrl
          common.setStorageSync('userData', userData)
        } else {
          common.showToast('服务器异常,请稍后重试')
        }
      },
      fail: function(err){
        common.showToast('服务器异常,请稍后重试')
      }
    })
  },
  /**
   * 微信支付体方法
   * tradeNo 订单号
   */
  payBody: function (openId, tradeNo) {
    return new Promise(function(resolve, reject) {
      app.httpRequest({
        api: '/order/order/payBody',
        method: "post",
        data: {
          openId: openId,
          tradeNo: tradeNo,
          appId: app.appId
        },
        success: res => {
          if (res.code == 200) {
            //promise机制放回成功数据
            resolve(res);
          } else {
            reject(res)
            common.showToast(res.mesages)
          }
        },
        fail: function(res) {
          reject(res);
          common.showToast(res.mesages)
        },
        complete: () => {
          //complete接口执行后的回调函数，无论成功失败都会调用
        }
      })
    })
  },
  getNewUserInfo:function(cid){
    return new Promise(function(resolve, reject) {
      app.httpRequest({
        api: '/consumer/customer/getUserInfor/' + cid,
        success: res => {
          if (res.code == 0) {
            //promise机制放回成功数据
            resolve(res);
          } else {
            reject(res)
            common.showToast(res.mesages)
          }
        },
        fail: function(res) {
          reject(res);
          common.showToast(res.mesages)
        },
        complete: () => {
          //complete接口执行后的回调函数，无论成功失败都会调用
        }
      })
    })
  },
  checkToken:function(params){
    return new Promise(function(resolve, reject) {
      app.httpRequest({
        api: '/authentication/checkToken',
        method: "post",
        data: {
          openId: params.openId,
          token: params.token
        },
        success: res => {
          if (res.code == 200) {
            //promise机制放回成功数据
            resolve(res);
          } else {
            reject(res)
            common.showToast(res.mesages)
          }
        },
        fail: function(res) {
          reject(res);
          common.showToast(res.mesages)
        },
        complete: () => {
          //complete接口执行后的回调函数，无论成功失败都会调用
        }
      })
    })
  },
   /**
   * 检查订单服务
   * orderId 订单号
   */
  checkOrder:function (orderId){
    return new Promise(function(resolve, reject) {
      app.httpRequest({
        api: '/order/order/isOrderExpire/' + orderId,
        method: "put",
        data: {},
        success: function (res) {
          if (res.code === 200) {
             //promise机制放回成功数据
             resolve(res);
          }else {
            reject(res)
            common.showToast(res.mesages)
          }
        },fail:function(res){
          //失败
        }, complete: function(res){
          reject(res)
        }
      })
    })
  }
}
module.exports = commonServe;
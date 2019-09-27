const common = require('../utils/common.js');
const app = getApp();

let commonServe = {
  /**
   * 新增/编辑 --- 个人信息
   * @param {*} userInfo 
   * @param  userNo is not null (编辑) else （新增）
   */
  saveUserInfo: function(userInfo){
    let apiUrl = '/xbg-api/api/user/addUserInfo'
    if (userInfo.userNo) {
      apiUrl = '/xbg-api/api/user/editUserInfo'
    }
    return new Promise(function(resolve, reject) {
      app.httpRequest({
        api: apiUrl,
        method: "post",
        data: {
          nikiname:userInfo.nickName,
          grade: userInfo.grade,
          openid:userInfo.openId,
          phoneno: userInfo.telephone,
          address: userInfo.address,
          avatar: userInfo.avatarUrl,
          userno: userInfo.userNo
        },
        success: res => {
          if (res.code == 0) {
            //promise机制放回成功数据
            resolve(res);
          } else {
            reject(res)
            common.showToast(res.msg)
          }
        },
        fail: function(res) {
          reject(res);
          common.showToast(res.msg)
        },
        complete: () => {
          //complete接口执行后的回调函数，无论成功失败都会调用
        }
      })
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
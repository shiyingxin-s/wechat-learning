const util = require('../utils/util.js');

let common = {
  //获取token  openid  加密排列 eg: str = 'e96a8690-5d70-4eb5-b21d-d6ac4b8be448$&&993652c4407d-7616-47e6-8373-b7524262c297';
  encryptionToken:function (str) {
    util.sortBase64(str);
    var base = new util.sortBase64();
    var encryptionToken = base.encode(str);
    return encryptionToken
  },
  // 本地存储
  setStorageSync:function (key, value){
    wx.setStorageSync(key, value)
  },

  // 删除本地存储
  removeStorageSync:function (key){
    wx.removeStorageSync(key)
  },
  // 获取本地存储
  getStorageSync:function (key){
    return wx.getStorageSync(key)
  },
  // Toast
  showToast:function (title, time, icon) {
    if (!icon) {
      icon ='none'
    }
    if(!time) {
      time = 2000
    }
    wx.showToast({
      title: title,
      icon: icon,
      duration: time
    })
  },
  //保留两位小数
  returnFloat:function (value){
    var value = Math.round(parseFloat(value) * 100) / 100;
    var xsd = value.toString().split(".");
    if (xsd.length == 1) {
        value = value.toString() + ".00";
        return value;
    }
    if (xsd.length > 1) {
      if (xsd[1].length < 2) {
        value = value.toString() + "0";
          }
          return value;
    }
	},
 
  /**
   *  待支付订单 倒计时
   */
  countDown(dates) {
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endTimes = dates;
    // 对结束时间进行处理渲染到页面
    if (endTimes.orderCustomerStatus == 1) { //判断是不是待付款
      // 兼容 苹果手机
      var orderTime = endTimes.orderTime.replace(/\-/g, '/')
      let endTime = Date.parse(orderTime);
      let obj = null;
      // 如果活动未结束，对时间进行处理
      let time = parseInt(86400 - (newTime - endTime) / 1000);
      if (time > 0) {
        // 获取 时、分、秒
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        obj = {
          hou: this.timeFormat(hou),
          min: this.timeFormat(min),
          sec: this.timeFormat(sec)
        }
      } else { //活动已结束，全部设置为'00'
        obj = {
          hou: '00',
          min: '00',
          sec: '00'
        }
        endTimes.orderCustomerStatus = 5; //倒计时为0  状态变为已取消
      }
      endTimes.countdownTime_List = obj;
    }
    // 渲染，然后每隔一秒执行一次倒计时函数
    this.setData({
      detail_newsList: this.data.detail_newsList
    })
    setTimeout(this.countDown, 1000);
  },
}
module.exports = common;
//index.js
//获取应用实例
const app = getApp()
// const util = require('../../utils/util.js')
const common = require('../../../utils/common.js');
Page({
  data: {
    viewHeight: app.globalData.navHeight,
    userData: null, // 获取缓存用户信息
    imgalist: [],
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '创建', //导航栏 中间的标题,
      isBackPer: true, //显示返回按钮,
      bgColor: '#f4f4f4' //导航背景色
    },
    show: false,
    actions: [{
        name: '视频'
      },
      {
        name: '照片',
      }
    ],

    //文字动态
    contenttext: '',
    //图片列表
    imageList: []
  },

  onLoad: function() {

  },
  onShow: function() {
    let wxs = this
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  previewImage: function(e) {
    var current = '../../images/common/2.png';
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.imgalist // 需要预览的图片http链接列表
    })
  },
  addImg: function() {
    let wxs = this
    wxs.setData({
      show: true
    })
  },
  onClose() {
    this.setData({
      show: false
    });
  },

  onSelect(event) {
    let wxs = this
    if (event.detail.name === '照片') {
      // 相册选择
      wxs.selectImg()
    } else {
      //拍照
      wxs.selectVideo()
    }
    wxs.setData({
      show: false
    })
  },
  // 相册选择
  selectImg: function() {
    let wxs = this
    wx.chooseImage({
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        console.log("选择照片的响应", res)
        if (this.data.imgalist.length == 0) {
          wxs.setData({
            imgalist: res.tempFilePaths
          })
        } else {
          const images = this.data.imgalist.concat(res.tempFilePaths)
          // 限制最多只能留下3张照片
          wxs.setData({
            imgalist: images.length <= 3 ? images : images.slice(0, 3)
          })

        }

      }
    })
  },
  selectVideo: function() {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        console.log(res.tempFilePath)
      }
    })
  },

  bindText: function(e) {
    console.log("e", e)
    this.setData({
      contenttext: e.detail.value
    });

  },


  //创建社区内容 ( 发布动态)
  addDynamic: function() {
    let wxs = this

    app.httpRequest({
      api: '/xbg-api/api/community/save',
      method: "POST",
      data: {
        userno: common.getStorageSync('userData').userNo,
        contenttext: wxs.data.contenttext
      },
      success: function(res) {
        console.log("发布动态的响应", res)
        if (res.code === 0) {
          wxs.upload(res.dynamicId)

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

  //上传图片的接口
  upload: function(dynamicId) {
    let wxs = this
    wx.uploadFile({
      url: app.globalServiceUrl.serviceUrl + '/xbg-api/api/community/upload', //根据具体后端程序IP修改
      filePath: wxs.data.imgalist[0],
      name: 'file',
      formData: {
        'token': common.getStorageSync('userData').token, //身份验证
        'userId': common.getStorageSync('userData').userNo, //发表动态的用户ID
        'dynamicId': dynamicId //发表动态之后返回的dynamicId
      },
      success: function(res) {
        //do something
        console.log("上传图片的响应", res)
      }
    })
  },

  //发布动态
  send: function() {
    if (this.data.contenttext) {
      this.addDynamic()
    } else {
      common.showToast("请填写动态", 3000)
    }

  }

})
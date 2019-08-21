//index.js
//获取应用实例
const app = getApp()
// const util = require('../../utils/util.js')
Page({
  data: {
    viewHeight:app.globalData.navHeight,
    userData: null, // 获取缓存用户信息
    imgalist:[ 
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496287851&di=0a26048f586b852193cb5026d60c4fad&imgtype=jpg&er=1&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F12%2F74%2F05%2F99C58PICYck.jpg',
      'https://res.wx.qq.com/wxdoc/dist/assets/img/1.d0a16186.png', 
      ],
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '创建', //导航栏 中间的标题,
      isBackPer: true, //显示返回按钮,
      bgColor:'#f4f4f4' //导航背景色
    },
    show: false,
    actions: [
      {
        name: '视频'
      },
      {
        name: '照片',
      }
    ]
  },
 
  onLoad: function () {
   
  },
  onShow:function(){
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
  previewImage:function(e) {
    var current='../../images/common/2.png';
    wx.previewImage({
          current: current, // 当前显示图片的http链接
          urls: this.data.imgalist // 需要预览的图片http链接列表
    })
  },
  addImg:function(){
    let wxs = this
    wxs.setData({
      show:true
    })
  },
  onClose() {
    this.setData({ show: false });
  },

  onSelect(event) {
    let wxs = this
    if(event.detail.name==='照片'){
      // 相册选择
      wxs.selectImg()
    }else{
      //拍照
      wxs.selectVideo()
    }
    wxs.setData({
      show:false
    })
  },
  // 相册选择
  selectImg:function() {
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        // 限制最多只能留下3张照片
        this.data.images = images.length <= 3 ? images : images.slice(0, 3) 
        $digest(this)
      }
    })
  },
  selectVideo:function(){
    wx.chooseVideo({
      sourceType: ['album','camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        console.log(res.tempFilePath)
      }
    })
  }
})

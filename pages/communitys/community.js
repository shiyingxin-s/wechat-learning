//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
const common = require('../../utils/common.js');

Page({
  data: {
    viewHeight: app.globalData.navHeight,
    userData: null, // 获取缓存用户信息
    imgalist: [
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496287851&di=0a26048f586b852193cb5026d60c4fad&imgtype=jpg&er=1&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F12%2F74%2F05%2F99C58PICYck.jpg',
      'https://res.wx.qq.com/wxdoc/dist/assets/img/1.d0a16186.png',
    ],
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '社区', //导航栏 中间的标题,
      isBackPer: false //不显示返回按钮,
    },
    scrollHeight: '',
    communityList: [],
    //分页参数
    //当前页
    page: "1",
    //总记录数
    total: 1,
    //每页记录数
    pageSize: "5",
    //总页数
    totalPage: 0,
    inputText:"",
    isInputShow:false,
    inputBottom:"",
    showLoading:true
  },

  //社区列表
  getCommunityList: function () {
    let wxs = this
    wxs.setData({
      showLoading: true
    })
    app.httpRequest({
      api: '/xbg-api/api/community/list',
      method: "POST",
      data: {
        page: wxs.data.page +'',
        limit: wxs.data.pageSize
      },
      success: function (res) {
        console.log("获取视频课堂数据的响应", res)
        if (res.code === 0) {
          wxs.setData({
            communityList: wxs.data.communityList.concat(res.page.list),
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
          showLoading: false
        })
        //complete接口执行后的回调函数，无论成功失败都会调用
      }
    })
  },


  //点赞
  clickLikes: function (e) {
    let wxs = this
    app.httpRequest({
      api: '/xbg-api/api/community/clickLikes',
      method: "POST",
      data: {
        dynamicId: e.currentTarget.dataset.communityno,
        userId: common.getStorageSync('userData').userNo
      },
      success: function (res) {
        if (res.code === 0) {
          wxs.setData({
            communityList: [],
            page: "1",
            pageSize: "5",
            totalPage: 0
          })
          wxs.getCommunityList()
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
  lowerGetCommunityList: function (e) {
    let wxs = this
    console.log("加载社区列表数据", e)
    if (wxs.data.page < wxs.data.totalPage) {
      wxs.setData({
        page: (wxs.data.page + 1).toString()
      })
      wxs.getCommunityList()
    }
  },

  onLoad: function () {
    let wxs = this
    wx.getSystemInfo({
      success: function (res) {
        wxs.setData({
          scrollHeight: res.windowHeight - 20
        })
      },
    })
  },
  onShow: function () {
    let wxs = this
    wxs.setData({
      communityList: []
    })
    wxs.getCommunityList()
  },
  previewImage: function (e) {
    console.log("e",e)
    let imgUrlList = e.currentTarget.dataset.imglist.map(item=>
      item.url
    )
    console.log("imgUrlList",imgUrlList)
    
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: imgUrlList // 需要预览的图片http链接列表
    })
  },
  create: function () {
    let wxs = this
    wx.navigateTo({
      url: '../communitys/create/create'
    })
  },

  //获得焦点
  foucus: function (e) {
    var that = this;
    that.setData({
      inputBottom: e.detail.height + app.globalData.tabBarHeight + 80
    })
  },

  getInputText:function(e){
    console.log("e",e)
    this.setData({
      inputText:e.detail.value
    })
  },

  review:function(e){
    this.setData({
      isInputShow:true,
      communityno:e.currentTarget.dataset.communityno,
    })
  },


  //失去聚焦
  blur: function (e) {
    var that = this;
    that.setData({
      inputBottom: 0,
      isInputShow:false,
      inputText:""
    })
  },

  //用户输入内容--提交输入
  submit: function () {
    var that = this;
    console.info(that.data.inputText);
    if (!that.data.inputText) {
      wx.showToast({
        icon: 'none',
        title: '请输入评论内容'
      })
      return false;
    }

    let wxs = this

    app.httpRequest({
      api: '/xbg-api/api/comment/save',
      method: "POST",
      data: {
        dynamicId: wxs.data.communityno,
        userId: common.getStorageSync('userData').userNo,
        content:wxs.data.inputText
      },
      success: function (res) {
        console.log("评论的响应", res)
        if (res.code === 0) {
          wxs.setData({
            inputText:"",
            isInputShow:false,
            communityList: [],
            page: "1",
            pageSize: "5",
            totalPage: 0
          })
          wxs.getCommunityList()
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
})
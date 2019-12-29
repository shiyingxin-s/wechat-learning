const common = require('/utils/common.js');
//app.js

App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: (res) => {
        console.log("系统信息",res)
        this.globalData.navHeight = res.statusBarHeight
      }
    })

    let systemInfo = wx.getSystemInfoSync()
	  // px转换到rpx的比例
      let pxToRpxScale = 750 / systemInfo.windowWidth;
      // 状态栏的高度
      let ktxStatusHeight = systemInfo.statusBarHeight * pxToRpxScale
      // 导航栏的高度
      let navigationHeight = 44 * pxToRpxScale
      // window的宽度
      let ktxWindowWidth = systemInfo.windowWidth * pxToRpxScale
      // window的高度
      let ktxWindowHeight = systemInfo.windowHeight * pxToRpxScale
      // 屏幕的高度
      let ktxScreentHeight = systemInfo.screenHeight * pxToRpxScale
      // 底部tabBar的高度
      let tabBarHeight = ktxScreentHeight - ktxStatusHeight - navigationHeight - ktxWindowHeight

      this.globalData.tabBarHeight = tabBarHeight
  },
  // 生命周期回调——监听小程序启动或切前台。
  onShow: function() {
    this.autoUpdate()
  },
  /**
   *  微信登陆方法
   *  返回：code
   */
  wxLogin: function() {
    var wxs = this
    return new Promise(function(resolve, reject) {
      // 调用登录接口
      wx.login({
        success: function(resData) {
          if (resData.code) {
             console.log("用户登录授权code为：" + resData.code);
            /**
             *  登陆接口调用 调用wxs.httpRequest请求传递code凭证换取用户openid，并获取后台用户信息
             *  参数：res.code 微信请求code
             *  成功后 存储及加密数据
             */
          
            wxs.httpRequest({
              api: '/xbg-api/api/login',
              method: "post",
              data: {
                code: resData.code,
                appId: wxs.appId,
              },
              success: function (res) {
                if (res.code === 0) {
                  wxs.userData.openId = res.data.openid
                  wxs.userData.token = res.data.token
                  wxs.userData.avatarUrl = res.data.avatar
                  wxs.userData.nickName = res.data.nikiname
                  wxs.userData.telephone = res.data.phoneno
                  wxs.userData.userNo = res.data.userno,
                  wxs.userData.grade = res.data.grade
                  common.setStorageSync('userData', wxs.userData)
                  //promise机制放回成功数据
                  resolve(res);
                } else {
                  reject('error');
                  common.showToast(res.msg, 3000)
                }
              },
              fail: function(res) {
                reject(res);
                common.showToast(res.msg, 3000)
              },
              complete: () => {
                //complete接口执行后的回调函数，无论成功失败都会调用
              }
            }) 
          }
        }
      })
    })
  },
  /**  
   *  设置 http 请求 header
   *  参数：method
   *  返回：header
   */
  settingHeader(cfg) {
    var wxs = this
    var header = {}
    var ContentType = 'application/json'
    
    if (cfg.method =='post' || cfg.method =='POST'){
      ContentType = 'application/json'
    }  else {
      ContentType = 'application/x-www-form-urlencoded'
    }
    // 非登陆 时判断缓存信息
    var userData = common.getStorageSync('userData')
    if (userData && userData.token) {
      header = {
        'Content-Type': ContentType,
        'token': userData.token
      }
    } else {
      wxs.wxLogin()
      return
    }
    return header
  },

  // 网络请求
  httpRequest: function (cfg) {
    var wxs = this
    if (!cfg.data) {
      cfg.data = {}
    }
    if (!cfg.method) {
      cfg.method = 'get'
    }

    var header = {}
    var apiName = cfg.api
    // 调用header 设置方法
    if (apiName =='/xbg-api/api/login')
    {
      header = {}
    } else {
      
      header = wxs.settingHeader(cfg)
    }
    // 服务请求
    wx.request({
      url: wxs.globalServiceUrl.serviceUrl + cfg.api,
      data: cfg.data,
      method: cfg.method,
      header: header,
      success: function (res) {
        if (typeof cfg.success === 'function') {
          //  token验证：401
          if(res.data.code === 401) {
            // 自动登陆
            wxs.wxLogin()
            return
          }
          // 登录失败
          if(res.data.code !== 0 && cfg.api ==='/xbg-api/api/login') {
            common.showToast(res.data.msg)
            return
          }
          cfg.success(res.data, cfg.data)
        }
      },
      fail: function (res) {
        if (typeof cfg.fail === 'function') {
          cfg.fail(res.data, cfg.data)
        }
        else {
          common.showToast('服务器异常，请稍后重试~')
        }
      },
      complete:function(res){
        if (typeof cfg.complete === 'function') {
          cfg.complete(res.data, cfg.data)
        }
      }
    })
  },

  /**
   * 自动更新小程序-------------------开始------------------------
   * 
   */
    autoUpdate: function() {
      var wxs = this
      // 获取小程序更新机制兼容
      if (wx.canIUse('getUpdateManager')) {
        const updateManager = wx.getUpdateManager()
        //1. 检查小程序是否有新版本发布
        updateManager.onCheckForUpdate(function(res) {
          // 请求完新版本信息的回调
          if (res.hasUpdate) {
            //检测到新版本，需要更新，给出提示
            wx.showModal({
              title: '更新提示',
              content: '检测到新版本，是否下载新版本并重启小程序？',
              success: function(res) {
                if (res.confirm) {
                  //2. 用户确定下载更新小程序，小程序下载及更新静默进行
                  wxs.downLoadAndUpdate(updateManager)
                } else if (res.cancel) {
                  //用户点击取消按钮的处理，如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                  wx.showModal({
                    title: '温馨提示~',
                    content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
                    showCancel:false,//隐藏取消按钮
                    confirmText:"确定更新",//只保留确定更新按钮
                    success: function(res) {
                      if (res.confirm) {
                        //下载新版本，并重新应用
                        wxs.downLoadAndUpdate(updateManager)
                      }
                    }
                  })
                }
              }
            })
          }
        })
      } else {
        // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
      }
    },
  /**
   * 下载小程序新版本并重启应用
   */
    downLoadAndUpdate: function (updateManager){
      wx.showLoading();
      //静默下载更新小程序新版本
      updateManager.onUpdateReady(function () {
        wx.hideLoading()
        //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate()
      })
      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
        wx.showModal({
          title: '已经有新版本了哟~',
          content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
        })
      })
    },
  //  自动更新小程序-------------------结束------------------------ 
  
  globalServiceUrl:{
    "serviceUrl":"http://119.3.180.1:8088",
    "serviceStaticUrl": 'https:'
  },
  appId: 'wxf3c74ca9e1ecf5d5',
  globalData: {
    navHeight: 0,
    tabBarHeight:0
  },
  userData: {
    openId: null, // openId
    token: null, // token
    avatarUrl: null, // 用户头像
    nickName: null, // 用户昵称
    userNo: null, // 用户编号
    grade: null // 年级
  },
})
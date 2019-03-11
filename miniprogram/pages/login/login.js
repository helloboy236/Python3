// miniprogram/pages/login/login.js
const cs = console.log
var mydate = new Date()
const db = wx.cloud.database({
  env: 'a-1-b4b138'
})
const todos = db.collection('users')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: '授权登录'
    })
    wx.getSystemInfo({
      success: function (res) {
        app.globalData.screen_height = res['screenHeight']
        app.globalData.screen_width = res['screenWidth']
      },
    })
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo'] == true)
          wx.reLaunch({
            url: '../mine/mine',
          })
      }
    })
  },
  login_first: function(res) {
    if (res.detail.errMsg == "getUserInfo:fail auth deny") {
      //如果用户点击了拒绝授权，则显示警告
      wx.showModal({
        title: '警告',
        content: '用户公开信息获取失败，不能进入学习系统',
        cancelText: '拒绝授权',
        confirmText: '去允许',
        success(res) { 
          if (res.confirm) {
            wx.showToast({
              title: '谢谢合作',
            })
          } else {
            //如果用户执迷不悟，那就和他说拜拜，给他6s考虑时间，万一迷途知返呢
            wx.showLoading({
              title: '拜拜',
              mask: true,
            })
            setTimeout(function() {
              wx.hideLoading()
            }, 5000)
          }
        }
      })
    } else {
      app.globalData.userInfo = res.detail.userInfo
      wx.showLoading({
        title: '加载中',
      })
      todos.add({
        data: {
          nickName: app.globalData.userInfo.nickName,
          bodyguard1_name: '保镖',
          bodyguard2_name: '侍卫',
          appellation: app.globalData.userInfo.nickName,
          lastTime: mydate.toLocaleTimeString(),
          times: 1,
          guard1_picture: 'xcx_python.png',
          guard2_picture: 'xcx_python.png',
          user_picture: app.globalData.userInfo.avatarUrl,
        }
      })
      wx.reLaunch({
        url: '../first/first'
      })
    }
  }
})
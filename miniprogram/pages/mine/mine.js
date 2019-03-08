//index.js
//获取应用实例
const app = getApp()
var mydate = new Date()
const db = wx.cloud.database({
  env: 'a-1-b4b138'
})
const todos = db.collection('users')
Page({
  data: {
    userInfor: {},
    hasUserInfo: false,
    hidden:true
  },
  onLoad:function(options){
    wx.showLoading({
      title: 'loading',
    })
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        app.globalData.userInfo=res.userInfo
        todos.where({
          nickName: app.globalData.userInfo.nickName
        }).get({
          success(res) {
            if (res.data.length == 0) {
              todos.add({
                data: {
                  nickName: e.detail.userInfo.nickName,
                  userGender: e.detail.userInfo.gender,
                  lastTime: mydate.toLocaleTimeString()
                }
              })
            }
            else {
              var id = res.data[0]['_id']
              todos.doc(id).update({
                data: {
                  lastTime: mydate.toLocaleTimeString(),
                  times:db.command.inc(1)
                }
              })
            }
          },
        })
        wx.hideLoading()
        wx.showToast({
          title: '欢迎回来'
        })
        that.setData({
          userInfor:res.userInfo,
          hasUserInfo:true,
          hidden:false
        })
      },
      fail:function(){
        wx.hideLoading()
        wx.showToast({
          title: '登录以使用全部功能',
          icon:'none',
          duration:2000
        })
      }
  })
  },
  onShareAppMessage: function () {
    wx.showShareMenu({

    })
  },
  getUserInfo: function(e) {
    var that = this
    wx.getSetting({
      success(res){
        if(res.authSetting['scope.userInfo'])
        {
          wx.showToast({
            title: '登录成功',
          })
          app.globalData.userInfo=e.detail.userInfo
          that.setData({
            userInfor:e.detail.userInfo,
            hasUserInfo:true,
            hidden:false
          })
          todos.where({
            nickName: e.detail.userInfo.nickName
          }).get({
            success(res) {
              if (res.data.length == 0) {
                todos.add({
                  data: {
                    nickName: e.detail.userInfo.nickName,
                    userGender: e.detail.userInfo.gender,
                    lastTime: mydate.toLocaleTimeString(),
                    times:1,
                  }
                })
              }
              else {
                var id = res.data[0]['_id']
                todos.doc(id).update({
                  data: {
                    lastTime: mydate.toLocaleTimeString()
                  }
                })
              }
            },
          })
        }
        else
          wx.showToast({
            title: '请先登录再使用',
            icon:'none'
          })
      }
    })
  },
  test:function(){

  },
  about:function(){
    wx.navigateTo({
      url: 'about/about'
    })
  }
})

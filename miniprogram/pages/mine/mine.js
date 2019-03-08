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
    screen_width:0,
    screen_height:0,
    xcxm_hidden: true,
    hasUserInfo: false,
    give_name_hidden: true,
    notes_hidden: true,
    mark_show_share:0,
    mark_show_notes:0,
    xcxm_w:0,
    xcxm_h:0,
    userInfor: {},
    hidden:true,
    bodyguard1_name:'大乔',
    bodyguard2_name:'小乔',
    notes_html: '<table width="335m"><tr><th>更新历史</th></tr>'+
    '<tr><td width="80rpx">日期</td><td width="55rpx">版本号</td><td>更新内容</td></tr>'+
    '<tr><td>2019/3/9</td><td>1.3.1</td><td>增加部分娱乐功能，劳逸结合</td></tr>'+
    '<tr><td>2019/3/7</td><td>1.3.0</td><td>增加视频学习功能</td></tr></table>'
  },
  onLoad:function(options){
    wx.showLoading({
      title: 'loading',
    })
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        app.globalData.screen_height=res['screenHeight']
        app.globalData.screen_width=res['screenWidth']
      },
    })
    wx.getUserInfo({
      success: function (res) {
        app.globalData.userInfo=res.userInfo
        todos.where({
          nickName: app.globalData.userInfo.nickName
        }).get({
          success(res) {
            that.setData({
              bodyguard1_name: res.data[0]['bodyguard1_name'],
              bodyguard2_name: res.data[0]['bodyguard2_name']
            })
            if (res.data.length != 0){
              var id = res.data[0]['_id']
              todos.doc(id).update({
                data: {
                  lastTime: mydate.toLocaleTimeString(),
                  times: db.command.inc(1)
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
          xcxm_hidden:false,
          userInfor:res.userInfo,
          hasUserInfo:true,
          hidden:false
        })
      },
      fail:function(){
        wx.hideLoading()
        wx.showModal({
          title: '登录',
          content: '登录后即可使用全部功能，一键登录???',
          showCancel: true,
          cancelText: '先逛逛',
          cancelColor: 'red',
          confirmText: '去登录',
          confirmColor: 'green',
          success: function(res) {
            if(res.confirm){
              
            }
            else{
            }
          },
        })
      }
  })
  },
  onShareAppMessage: function () {
    wx.showShareMenu({

    })
  },
  getUserInfo: function (e) {
    var that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.showModal({
            title: '登录成功',
            content: '点击头像旁边的图片和文字，会有新的发现哦。',
            showCancel:false,
            confirmText:'我知道了'
          })
          app.globalData.userInfo = e.detail.userInfo
          that.setData({
            xcxm_hidden:false,
            userInfor: e.detail.userInfo,
            hasUserInfo: true,
            hidden: false
          })
          todos.where({
            nickName: e.detail.userInfo.nickName
          }).get({
            success(res) {
              if (res.data.length == 0) {
                todos.add({
                  data: {
                    nickName: e.detail.userInfo.nickName,
                    bodyguard1_name: that.data.bodyguard1_name,
                    bodyguard2_name: that.data.bodyguard2_name,
                    lastTime: mydate.toLocaleTimeString(),
                    times: 1,
                  }
                })
              }
              else {
                var id = res.data[0]['_id']
                todos.doc(id).update({
                  data: {
                    lastTime: mydate.toLocaleTimeString(),
                  }
                })
              }
            },
          })
        }
        else
          wx.showToast({
            title: '请先登录再使用',
            icon: 'none'
          })
      }
    })
  }, 
  test:function(){
    var that=this
  },
  share_facetoface:function(){
    if(this.data.mark_show_share==0)
    {
      wx.showToast({
      title: '主公万岁',
      icon:'none'
      })
      this.setData({
        xcxm_h:600,
        xcxm_w:600,
        mark_show_share:1
        })
    }
    else{
      wx.showToast({
        title:'主公辛苦了',
        icon:'none'
      })
      this.setData({
        xcxm_h:0,
        xcxm_w:0,
        mark_show_share:0
      })
    }
  },
  greeting:function(){
    wx.showModal({
      title: '给主公请安',
      content: '主公万岁万岁万万岁！！！',
      showCancel:false,
      confirmText:'平身吧！',
      success:function(){
        wx.showToast({
          title: '谢主公',
        })
      }
    })
  },
  bodyguard:function(){
    this.setData({
      give_name_hidden:false,
    })
  },
  give_name:function(e){
    var that=this
    that.setData({
      bodyguard1_name:e.detail.value.bodyguard_name1,
      bodyguard2_name:e.detail.value.bodyguard_name2,
      give_name_hidden:true
    })
    todos.where({
      nickName: app.globalData.userInfo.nickName
    }).get({
      success(res) {
        if (res.data.length != 0){
          var id = res.data[0]['_id']
          todos.doc(id).update({
            data: {
              bodyguard1_name: that.data.bodyguard1_name,
              bodyguard2_name: that.data.bodyguard2_name
            }
          })
        }
      },
    })
    wx.showToast({
      title: '谢主公赐名',
    })
  },
  notes:function(){
    if(this.data.mark_show_notes==0)
      this.setData({
        mark_show_notes:1,
        notes_hidden:false
      })
    else{
      this.setData({
        mark_show_notes:0,
        notes_hidden:true
      })
    }
  },
  about:function(){
    wx.navigateTo({
      url: 'about/about'
    })
  }
})

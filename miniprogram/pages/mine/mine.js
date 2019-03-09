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
    screen_width: 0,
    screen_height: 0,
    xcxm_hidden: true,
    hasUserInfo: false,
    give_name_hidden: true,
    notes_hidden: true,
    mark_show_share: 0,
    mark_show_notes: 0,
    mark_show_name: 0,
    xcxm_w: 0,
    xcxm_h: 0,
    userInfor: {},
    hidden: true,
    bodyguard1_name: '保镖',
    bodyguard2_name: '侍卫',
    appellation: '主上',
    guard1_picture: 'xcx_python.png',
    guard2_picture: 'xcx_python.png',
    user_picture: '',
    notes_html: '<table width="335m"><tr><th>更新历史</th></tr>' +
      '<tr><td width="80rpx">日期</td><td width="55rpx">版本号</td><td>更新内容</td></tr>' +
      '<tr><td>2019/3/9</td><td>1.3.1</td><td>1、增加部分娱乐功能，劳逸结合<br/>2、增加更换头像及昵称功能<br/>3、优化小程序（包括按键、弹幕系统等）</td></tr>' +
      '<tr><td>2019/3/7</td><td>1.3.0</td><td>增加视频学习功能</td></tr></table>'
  },
  onLoad: function(options) {
    wx.showLoading({
      title: 'loading',
    })

    wx.setTopBarText({
      text: 'hello, world!'
    })
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        app.globalData.screen_height = res['screenHeight']
        app.globalData.screen_width = res['screenWidth']
      },
    })
    wx.getUserInfo({
      success: function(res) {
        app.globalData.userInfo = res.userInfo
        that.setData({
          user_picture: app.globalData.userInfo.avatarUrl
        })
        todos.where({
          nickName: app.globalData.userInfo.nickName
        }).get({
          success(res) {
            that.setData({
              bodyguard1_name: res.data[0]['bodyguard1_name'],
              bodyguard2_name: res.data[0]['bodyguard2_name'],
              appellation: res.data[0]['appellation'],
              guard1_picture: res.data[0]['guard1_picture'],
              guard2_picture: res.data[0]['guard2_picture'],
              user_picture: res.data[0]['user_picture'],
            })
            if (res.data.length != 0) {
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
          title: '欢迎回来,' + that.data.appellation
        })
        that.setData({
          xcxm_hidden: false,
          userInfor: res.userInfo,
          hasUserInfo: true,
          hidden: false
        })
      },
      fail: function() {
        wx.hideLoading()
        wx.showModal({
          title: '登录',
          content: '登录后更精彩，去登录???',
          showCancel: true,
          cancelText: '先逛逛',
          cancelColor: 'red',
          confirmText: '去登录',
          confirmColor: 'green',
          success: function(res) {
            if (res.confirm) {

            } else {}
          },
        })
      }
    })
  },
  onPullDownRefresh: function() {
    wx.reLaunch({
      url: 'mine',
    })
  },
  onShareAppMessage: function() {
    wx.showShareMenu({

    })
  },
  getUserInfo: function(e) {
    var that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.showModal({
            title: '登录成功',
            content: '点击头像旁边的图片和文字，会有新的发现哦。',
            showCancel: false,
            confirmText: '朕知道了'
          })
          app.globalData.userInfo = e.detail.userInfo
          that.setData({
            appellation: e.detail.userInfo.nickName,
            xcxm_hidden: false,
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
                    appellation: that.data.appellation,
                    lastTime: mydate.toLocaleTimeString(),
                    times: 1,
                    guard1_picture: 'xcx_python.png',
                    guard2_picture: 'xcx_python.png',
                    user_picture: app.globalData.userInfo.avatarUrl,
                  }
                })
              } else {
                var id = res.data[0]['_id']
                todos.doc(id).update({
                  data: {
                    lastTime: mydate.toLocaleTimeString(),
                  }
                })
              }
            },
          })
        } else
          wx.showToast({
            title: '请先登录再使用',
            icon: 'none'
          })
      }
    })
  },
  upload_data:function(name,picture_url){
    todos.where({
      nickName: app.globalData.userInfo.nickName
    }).get({
      success(res) {
        if (res.data.length != 0) {
            var id = res.data[0]['_id']
            todos.doc(id).update({
              data: {
                [name]:picture_url
              }
            })
        } else if(name=='guard1_picture') {
          todos.add({
            data: {
              nickName: app.globalData.userInfo.nickName,
              bodyguard1_name: that.data.bodyguard1_name,
              bodyguard2_name: that.data.bodyguard2_name,
              appellation: that.data.appellation,
              lastTime: mydate.toLocaleTimeString(),
              times: 1,
              guard1_picture: picture_url,
              guard2_picture: 'xcx_python.png',
              user_picture: app.globalData.userInfo.avatarUrl,
            }
          })
        }else if(name=='guard2_picture'){
          todos.add({
            data: {
              nickName: app.globalData.userInfo.nickName,
              bodyguard1_name: that.data.bodyguard1_name,
              bodyguard2_name: that.data.bodyguard2_name,
              appellation: that.data.appellation,
              lastTime: mydate.toLocaleTimeString(),
              times: 1,
              guard1_picture: 'xcx_python.png',
              guard2_picture: picture_url,
              user_picture: app.globalData.userInfo.avatarUrl,
            }
          })
        }else if(name=='user_picture'){
          todos.add({
            data: {
              nickName: app.globalData.userInfo.nickName,
              bodyguard1_name: that.data.bodyguard1_name,
              bodyguard2_name: that.data.bodyguard2_name,
              appellation: that.data.appellation,
              lastTime: mydate.toLocaleTimeString(),
              times: 1,
              guard1_picture: 'xcx_python.png',
              guard2_picture: 'xcx_python.png',
              user_picture: picture_url,
            }
          })
        }else{
          console.log('undefined')
        }
      },
    })
  },
  upload_picture: function(name) {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.cloud.uploadFile({
          cloudPath: 'user_image/' + app.globalData.userInfo.nickName + '/' + name + '_' + Math.floor(Math.random() * 100000) + '.jpg',
          filePath: tempFilePaths[0],
          success(res) {
            that.upload_data(name,res.fileID)
            that.setData({
              [name]: res.fileID
            })
          },
          fail(res) {
            console.log(res)
          }
        })
      }
    })
  },
  test: function() {
    var that = this
    var cs = console.log
  },
  share_facetoface: function() {
    var that = this
    if (this.data.mark_show_share == 0) {
      wx.showToast({
        title: that.data.appellation + '万岁',
        icon: 'none'
      })
      this.setData({
        xcxm_h: 600,
        xcxm_w: 600,
        mark_show_share: 1
      })
    } else {
      wx.showToast({
        title: that.data.appellation + '辛苦了',
        icon: 'none'
      })
      this.setData({
        xcxm_h: 0,
        xcxm_w: 0,
        mark_show_share: 0
      })
    }
  },
  guard1_picture_request: function() {
    var that = this
    wx.showModal({
      title: '给' + that.data.appellation + '提示',
      content: this.data.appellation + '换个头像玩玩？？？',
      cancelText: '这个不错',
      confirmText: '去选一张',
      success: function(res) {
        if (res.confirm)
          that.upload_picture('guard1_picture')
      }
    })
  },
  guard2_picture_request: function() {
    var that = this
    wx.showModal({
      title: '给' + that.data.appellation + '提示',
      content: this.data.appellation + ',换个头像玩玩？？？',
      cancelText: '这个挺好',
      confirmText: '去选一张',
      success: function(res) {
        if (res.confirm)
          that.upload_picture('guard2_picture')
      }
    })
  },
  user_picture_request: function() {
    var that = this
    wx.showModal({
      title: '给' + that.data.appellation + '提示',
      content: this.data.appellation + ',换个头像玩玩？？？',
      cancelText: '这个挺好',
      confirmText: '去选一张',
      success: function(res) {
        if (res.confirm)
          that.upload_picture('user_picture')
      }
    })
  },
  bodyguard: function() {
    if (this.data.mark_show_name == 0)
      this.setData({
        mark_show_name: 1,
        give_name_hidden: false,
      })
    else {
      this.setData({
        mark_show_name: 0,
        give_name_hidden: true
      })
    }
  },
  give_name: function(e) {
    var that = this
    that.setData({
      bodyguard1_name: e.detail.value.bodyguard_name1,
      bodyguard2_name: e.detail.value.bodyguard_name2,
      appellation: e.detail.value.appellation,
      give_name_hidden: true
    })
    todos.where({
      nickName: app.globalData.userInfo.nickName
    }).get({
      success(res) {
        if (res.data.length != 0 && res.data[0]['appellation'] != undefined) {
          if (that.data.appellation == '') {
            that.setData({
              appellation: app.globalData.userInfo.nickName,
            })
            var id = res.data[0]['_id']
            todos.doc(id).update({
              data: {
                bodyguard1_name: that.data.bodyguard1_name,
                bodyguard2_name: that.data.bodyguard2_name,
                appellation: that.data.appellation
              }
            })
          } else {
            var id = res.data[0]['_id']
            todos.doc(id).update({
              data: {
                bodyguard1_name: that.data.bodyguard1_name,
                bodyguard2_name: that.data.bodyguard2_name,
                appellation: that.data.appellation
              }
            })
          }
        } else {
          todos.add({
            data: {
              nickName: app.globalData.userInfo.nickName,
              bodyguard1_name: that.data.bodyguard1_name,
              bodyguard2_name: that.data.bodyguard2_name,
              appellation: that.data.appellation,
              lastTime: mydate.toLocaleTimeString(),
              times: 1,
              guard1_picture: 'xcx_python.png',
              guard2_picture: 'xcx_python.png',
              user_picture: app.globalData.userInfo.avatarUrl,
            }
          })
        }
      },
    })
    wx.showToast({
      title: '谢' + that.data.appellation + '赐名',
    })
  },
  notes: function() {
    if (this.data.mark_show_notes == 0)
      this.setData({
        mark_show_notes: 1,
        notes_hidden: false
      })
    else {
      this.setData({
        mark_show_notes: 0,
        notes_hidden: true
      })
    }
  },
  about: function() {
    wx.navigateTo({
      url: 'about/about'
    })
  }
})
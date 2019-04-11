//index.js
//获取应用实例
const app = getApp()
var mydate = new Date()
const db = wx.cloud.database({
  env: 'a-1-b4b138'
})
const todos = db.collection('integral')
Page({
  data: {
    integral: 0,
    notes_hidden:true,
    mark_show_share: 0,
    mark_show_notes: 0,
    xcxm_w: 0,
    xcxm_h: 0,
    notes_html: '<table width="335m"><tr><th>更新介绍</th></tr>' +
      '<tr><td width="80rpx">日期</td><td width="50rpx">更新内容</td></tr>' +
      '<tr><td>2019/3/17</td><td>增加签到系统</td></tr>'+
      '<tr><td>2019/4/10</td><td>增加python二级题目做题系统</td></tr>'+
      '</table>',
    sign: '签到',
    nickname: '',
    continuous: 1,
    days: 0,
    lable_hidden:true
  },
  onLoad: function(options) {
    var that = this
    wx.getUserInfo({
      success(res) {
        app.globalData.userInfo = res.userInfo
        //console.log(app.globalData.userInfo.nickName)
        that.data.nickname = app.globalData.userInfo.nickName
      }
    })
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    wx.hideLoading()
    that.setData({
      hidden: false
    })
    that.load_integral()
  },
  onShow:function(){
    var that = this
    that.load_integral()
  },
  onReady: function() {
    wx.hideLoading()
  },
  onPullDownRefresh: function() {
    var that = this
    wx.reLaunch({
      url: 'mine',
    })
  },
  onShareAppMessage: function () {
    return{
      title:'这个小程序学Python挺不错，快来围观',
      path:'pages/login/login'
    }
  },
  load_integral: function() {
    var that = this
    that.data.days = parseInt(mydate.getTime() / (1000 * 60 * 60 * 24))
    todos.where({
      nickname: that.data.nickName
    }).count({
      success(res) {
        //onsole.log(res.total)
        if (res.total == 0) {
          wx.showToast({
            title: '见面礼10金牌',
          })
          todos.add({
            data: {
              nickname: that.data.nickname,
              integral: 10,
              date:0,
              continuous: 1,
              documents:[0]
            },
            success(res) {
              that.setData({
                integral: 10
              })
            }
          })
        }
      }
    })
    todos.where({
      nickname: that.data.nickName
    }).get({
      success(res) {
        if (that.data.days - res.data[0].date == 0)
          that.setData({
            sign: '已签到'
          })
        app.globalData.id = res.data[0]._id
        app.globalData.documents=res.data[0].documents
        that.data.continuous = res.data[0].continuous
        app.globalData.integral = res.data[0].integral
        that.setData({
          integral: res.data[0].integral
        })
      }
    })
  },
  sign: function() {
    var that = this
    if (this.data.sign == '签到') {
      wx.showLoading({
        title: '签到中',
      })
      todos.where({
        nickname: that.data.nickname
      }).get({
        success(res) {
          var id = res.data[0]._id
          var sub = that.data.days - res.data[0].date
          if (sub == 1) {
            if (that.data.continuous <= 4) {
              var num = 0
              do {
                num = parseInt(Math.random() * that.data.continuous * 10)
                //console.log(num)
              } while (num <= 3)
              todos.doc(id).update({
                data: {
                  integral: db.command.inc(num),
                  continuous: db.command.inc(1),
                  date: that.data.days
                },
                success(res) {
                  //console.log(app.globalData.userInfo)
                  wx.showToast({
                    title: '签到成功',
                  })
                  // console.log(num)
                  // console.log(that.data.lable_hidden)
                  that.setData({
                    lable_hidden:false,
                    num:num
                  })
                  that.setData({
                    lable_hidden: false,
                    num: num
                  })
                  that.load_integral()
                  setInterval(function () {
                    that.setData({
                      lable_hidden: true
                    })
                  }, 2000)
                }
              })
            } else {
              that.data.continuous = 4
              do
              {
              var num = parseInt(Math.random() * that.data.continuous * 10)
              //console.log(num)
            } while (num <= 3)
              todos.doc(id).update({
                data: {
                  integral: db.command.inc(num),
                  continuous: db.command.inc(1),
                  date: that.data.days
                },
                success(res) {
                  wx.showToast({
                    title: '签到成功',
                  })
                  that.setData({
                    sign: '已签到'
                  })
                  that.setData({
                    lable_hidden: false,
                    num: num
                  })
                  that.load_integral()
                  setInterval(function () {
                    that.setData({
                      lable_hidden: true
                    })
                  }, 2000)
                }
              })
            }
          } else {
            var num = 0
            do {
              num = parseInt(Math.random() * that.data.continuous * 10)
              // console.log(num)
            } while (num <= 3)
            todos.doc(id).update({
              data: {
                integral: db.command.inc(num),
                continuous: 1,
                date: that.data.days
              },
              success(res) {
                wx.showToast({
                  title: '签到成功',
                })
                that.setData({
                  lable_hidden:false,
                  num : num
                })
                that.load_integral()
                setInterval(function(){
                  that.setData({
                    lable_hidden: true
                  })
                },2000)
              }
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '今日已签到，明天8点后再来吧',
        showCancel: false
      })
    }
  },
  test: function() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '新增二级模拟题系统，做每套题只需要3枚金牌',
      showCancel: false,
      confirmText: '我知道了'
    })
  },
  share_facetoface: function() {
    var that = this
    if (this.data.mark_show_share == 0) {
      wx.showToast({
        title: '点击图片关闭',
        icon: 'none'
      })
      this.setData({
        xcxm_h: 600,
        xcxm_w: 600,
        mark_show_share: 1
      })
    } else {
      wx.showToast({
        title: '感谢分享',
        icon: 'none'
      })
      this.setData({
        xcxm_h: 0,
        xcxm_w: 0,
        mark_show_share: 0
      })
    }
  },
  notes: function() {
    if (this.data.mark_show_notes == 0) {
      wx.showToast({
        title: '点击可返回',
        icon: 'none'
      })
      this.setData({
        mark_show_notes: 1,
        notes_hidden: false
      })
    } else {
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
  },
  translation: function() {
    wx.navigateTo({
      url: 'translation/translation'
    })
  },
  open_tools: function() {
    wx.navigateToMiniProgram({
      appId: 'wxdde3192d130298e5',
    })
  }
})
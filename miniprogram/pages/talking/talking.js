// miniprogram/pages/talking/talking.js
const app = getApp()
var mydate = new Date()
const db = wx.cloud.database({
  env: 'a-1-b4b138'
})
const todos = db.collection('talking')
Page({
  /**
   * 页面的初始数据
   */

  data: {
    input_hidden: true,
    dx_hidden: true,
    delete_hidden: true,
    image_hidden: false,
    talking_content_hidden: true,
    amount_base: 0,
    amount: 0,
    input_x: 0,
    input_y: 0,
    tip: '拟旨',
    first_x: 0,
    first_y: 0,
    reveal_x: 300,
    reveal_y: 0,
    next_x: 0,
    message: '     1、此处准许你畅所欲言，想说什么说什么，不开心什么的尽管发泄在此，这里就是无人问津树洞，没人知道你是谁，完全匿名。\n 2、无论你是程序遇到接二连三的bug，无处发泄，还是生活上遇到什么困难，都可以在这里尽情地发泄你的情绪，我们都是你的倾听者！！！\n3、你也可以在这里发表你的编程思想或者工作时的大概情况，让目前没有从业的人员参考一下。\n4、你可以分享你的编程经验，或者编程小知识。\n5、甚至可以发送你的个性签名，人生格言。\n6、可能我不足够优秀，得不到你的芳心，但我会不断努力，改善之路希望有你的建议和参与。树洞由我们一起发扬光大，加油，程序猿们。\n print("Good luck(^_^)")&nbsp;&nbsp;#祝你编程之路顺利',
    title: '陌生人，你好，关于该页面，我有话说',
    nickname_input: '',
    message_input: '',
    data_array: [],
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      image_hidden: app.globalData.image_privateVisits_hidden,
      talking_content_hidden: !app.globalData.image_privateVisits_hidden
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this
    that.refresh()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  refresh: function() {
    var that = this
    wx.showToast({
      title: '加载中',
      image: 'translation.png',
    })
    that.setData({
      first_x: app.globalData.screen_width / 2 - 105,
      first_y: app.globalData.screen_height - 200,
      reveal_x: app.globalData.screen_width / 2 - 42,
      reveal_y: app.globalData.screen_height - 260
    })
    todos.count({
      success(res) {
        var c = res.total - that.data.amount_base
        if (c == 0) {
          wx.hideLoading()
          wx.showModal({
            title: '暂无新民意',
            content: '皇上选贤用能，天下国泰民安；先去看看以前的奏折吧，以史为鉴是发展进步的重要法则。',
            showCancel: false,
            confirmText: '朕知道了'
          })
        } else {
          wx.hideLoading()
          var str = '加载民意:' + c + '条'
          that.setData({
            amount: res.total,
            amount_base: res.total,
          })
          wx.setNavigationBarTitle({
            title: '听取民意(' + that.data.amount + '/' + that.data.amount_base + ')',
          })
          wx.showToast({
            title: str,
          })
        }
      },
      complete() {
        const batchTimes = Math.ceil(that.data.amount / 20)
        const array_data = []
        let i = 0
        if (i == 0) {
          i++
          todos.get({
            success(res) {
              const result = res.data
              for (let j = 0; j < result.length; j++)
                array_data.push(result[j])
            },
            complete() {
              that.setData({
                data_array: array_data
              })
              for (i; i < batchTimes; i++)
                todos.skip(i * 20).limit(20).get({
                  success(res) {
                    const result = res.data
                    for (let j = 0; j < result.length; j++)
                      array_data.push(result[j])
                  },
                  complete() {
                    that.setData({
                      data_array: array_data
                    })
                  }
                })
            }
          })
        }

      }
    })
  },
  previous_item: function() {
    var that = this
    var data_res = this.data.data_array
    var i = that.data.amount_base
    var j = ++that.data.amount
    if (j >= i) {
      j--
      that.setData({
        amount: i - 1,
      })
      wx.setNavigationBarTitle({
        title: '听取民意(' + j + '/' + i + ')',
      })
      wx.showToast({
        title: '没有更多民意了',
        icon: 'none',
        duration: 2000,
      })
    } else {
      that.setData({
        title: data_res[j]['nickName2'],
        message: data_res[j]['messages']
      })
      wx.setNavigationBarTitle({
        title: '听取民意(' + j + '/' + i + ')',
      })
      wx.hideToast()
    }
  },
  next_item: function() {
    var that = this
    var i = that.data.amount_base
    var data_res = this.data.data_array
    var j = --that.data.amount
    if (j < 0) {
      j++
      that.setData({
        amount: 0,
      })
      wx.setNavigationBarTitle({
        title: '听取民意(' + j + '/' + i + ')',
      })
      wx.showToast({
        title: '没有更多民意了',
        icon: 'none',
        duration: 2000,
      })
    } else {
      //var i = Math.floor(Math.random() * j);
      that.setData({
        title: data_res[j]['nickName2'],
        message: data_res[j]['messages']
      })
      wx.setNavigationBarTitle({
        title: '听取民意(' + j + '/' + i + ')',
      })
      wx.hideToast()
    }

  },
  delete_item: function() {
    console.log(this.data.amount)
    var delete_id = this.data.data_array[this.data.amount]['_id']
    console.log(delete_id)
    wx.showModal({
      title: 'delete',
      content: '确定删除' + this.data.amount,
      showCancel: true,
      cancelText: '取消',
      cancelColor: '',
      confirmText: '确定',
      confirmColor: '',
      success: function(res) {
        if (res.confirm) {
          var ret = todos.doc(delete_id).remove({
            success(res) {
              if (res.stats['removed'] == 1) {
                wx.showToast({
                  title: '删除成功',
                })
              } else {
                wx.showToast({
                  title: '删除失败',
                })
              }
            }
          });
        } else if (res.cancel) {
          wx.showToast({
            title: '取消删除',
            icon: 'none',
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })

  },
  send_one: function() {
    if (this.data.tip == '拟旨')
      this.setData({
        tip: '算了',
        input_hidden: false,
        input_x: 0,
        input_y: 200
      })
    else
      this.setData({
        tip: '拟旨',
        input_hidden: true,
        input_x: 0,
        input_y: 0
      })
  },
  send: function() {
    var that = this
    if (this.data.nickname_input == '')
      this.data.nickname_input = '匿名帝'
    if (app.globalData.userInfo.nickName != undefined) {
      console.log('unload')
      if (this.data.message_input != '') {
        todos.add({
          data: {
            nickName: app.globalData.userInfo.nickName,
            nickName2: this.data.nickname_input,
            data: mydate.toLocaleDateString(),
            time: mydate.toLocaleTimeString(),
            messages: this.data.message_input
          },
          success(res) {
            wx.showToast({
              title: '下发圣旨成功',
              duration: 2000
            })
            that.setData({
              message_input: '',
              nickname_input: '',
              tip: '拟旨',
              input_hidden: true,
              mask: true
            })
          }
        })
      } else {
        wx.showToast({
          title: '先写点什么吧',
          icon: 'none',
        })
      }
    } else {
      if (this.data.message_input != '') {
        todos.add({
          data: {
            nickName: 'unlogin',
            nickName2: this.data.nickname_input,
            time: mydate.toLocaleTimeString(),
            data: mydate.toLocaleDateString(),
            messages: this.data.message_input
          },
          success(res) {
            wx.showToast({
              title: '下发圣旨成功',
              duration: 2000,
              mask: true
            })
            that.setData({
              message_input: '',
              nickname_input: '',
              tip: '拟旨',
              input_hidden: true
            })
          }
        })
      } else {
        wx.showToast({
          title: '先写点什么吧',
          icon: 'none',
          mask: true
        })
      }
    }
  },
  bi_name(e) {
    var that = this
    this.setData({
      nickname_input: e.detail.value
    })
    wx.getSystemInfo({
      success(res) {
        if (res.brand == 'GIONEE' && app.globalData.userInfo['nickName'] == '乐逍遥' && e.detail.value == 'wudi')
          that.setData({
            delete_hidden: false,
          })
        else
          that.setData({
            delete_hidden: true,
          })
      }
    })
  },
  bi_message(e) {
    this.setData({
      message_input: e.detail.value
    })
  },
  return_home: function() {
    var that = this
    that.refresh()
  },
  hidden_image_微服私访: function() {
    var that=this
    this.setData({
      image_hidden: true,
      talking_content_hidden:false
    })
    that.refresh()
    app.globalData.image_privateVisits_hidden = true
  }
})
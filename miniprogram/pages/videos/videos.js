// miniprogram/pages/videos/videos.js
function getRandomColor() {
  const rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}
const app = getApp()
var mydate = new Date()

const db = wx.cloud.database({
  env: 'a-1-b4b138'
})
const todos = db.collection('danmu')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    video_hidden: 'true',
    i_w: 60,
    i_h: 60,
    video_title: '第1章 Python入门导学',
    video_src: 'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/python_videos/第1章 Python入门导学.mp4?sign=56463ab283e4fb85465603b62788ca03&t=1551939711',
    chapter_current: 1,
    video_titles: {
      title: '目录',
      v1: '第1章 Python入门导学',
      v2: '第2章 Python环境安装',
      v3: '第3章 理解什么是写代码与Python的基本类型',
      v4: '第4章 Python中表示“组”的概念与定义',
      v5: '第5章 变量与运算符',
      v6: '第6章 分支、循环、条件与枚举',
      v7: '第7章 包、模块、函数与变量作用域',
      v8: '第8章 Python函数'
    },
    video_srcs: {
      v1: 'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/python_videos/第1章 Python入门导学.mp4?sign=56463ab283e4fb85465603b62788ca03&t=1551939711',
      v2: 'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/python_videos/第2章 Python环境安装.mp4?sign=1c32a7f895ef0f6272a75bc85322f6a6&t=1551939753',
      v3: 'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/python_videos/第3章 理解什么是写代码与Python的基本类型.mp4?sign=9944dc550ef392e5501aaf0a3b43de22&t=1551939807',
      v4: 'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/python_videos/第4章 Python中表示“组”的概念与定义.mp4?sign=270f3fbba2744a99d9fff7f50cbc7952&t=1551939823',
      v5: 'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/python_videos/第5章 变量与运算符.mp4?sign=52e7af367cc671d44d9c07b388adad82&t=1551939840',
      v6: 'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/python_videos/第6章 分支、循环、条件与枚举.mp4?sign=cdab31d4e4bdf192eaab32ca896cabbf&t=1551939860',
      v7: 'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/python_videos/第7章 包、模块、函数与变量作用域.mp4?sign=2d07001e6a42f93d1d96e629551e9c3f&t=1551939876',
      v8: 'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/python_videos/第8章 Python函数.mp4?sign=53d63f6fdc573cec1828b33631f33fc2&t=1551939884'
    },
    danmu_amount: 0,
    danmu_list: [],
    danmu_content: '',
    button_send_disable: true,
    control_video:'播放(快捷操作)'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.globalData.userInfo.nickName = '乐逍遥'
    wx.setNavigationBarTitle({
      title: '看视频(' + this.data.chapter_current + '/8)学Python'
    })
    this.setData({
      video_title: this.data.video_titles['v1'],
      video_src: this.data.video_srcs['v1'],
    })
    wx.setBackgroundTextStyle({
      textStyle: 'dark' // 下拉背景字体、loading 图的样式为dark
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that=this
    this.videoContext = wx.createVideoContext('myVideo')
    that.abtain_danmu_list()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.globalData.userInfo.nickName != undefined)
      this.setData({
        video_hidden: false
      })
    else {
      wx.showModal({
        title: '温馨提示',
        content: '登录后即可使用全部功能',
        showCancel: true,
        cancelText: '就不去',
        cancelColor: 'red',
        confirmText: '马上去',
        confirmColor: 'green',
        success: function(res) {
          if (res.confirm)
            wx.switchTab({
              url: '../mine/mine'
            })
        },
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.videoContext.pause()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.reLaunch({
      url: 'videos',
    })
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
  control_video: function() {
    if (this.data.control_video =='播放(快捷操作)')
      this.videoContext.play()
    else
      this.videoContext.pause()
  },
  abtain_danmu_list: function() {
    var that = this
    todos.count({
      success(res) {
        that.setData({
          danmu_amount: res.total
        })
      },
      complete() {
        const batchTimes = Math.ceil(that.data.danmu_amount / 20)
        const array_data = []
        let i = 0
        if (i == 0) {
          i++
          todos.where({
            'video_title': that.data.video_title
          }).get({
            success(res) {
              const result = res.data
              for (let j = 0; j < result.length; j++)
                array_data.push(result[j])
            },
            complete() 
            {
              that.setData({
                danmu_list: array_data
              })
              for(i;i<batchTimes;i++){
                todos.where({
                  'video_title': that.data.video_title
                }).skip(i * 20).limit(20).get({
                  success(res) {
                    const result = res.data
                    for (let j = 0; j < result.length; j++)
                      array_data.push(result[j])
                  },
                  complete() {
                    that.setData({
                      danmu_list: array_data
                    })
                  }
                })
              }
              var delete_redundancy_list=this.data.danmu_list
              cs(delete_redundancy_list)
            }
          })
        } 

      }
    })
  },
  image_show: function() {
    if (this.data.i_w == 60)
      this.setData({
        i_h: 360,
        i_w: 360,
      })
    else
      this.setData({
        i_h: 60,
        i_w: 60,
      })
  },
  video_time_update: function(res) {
    this.currentTime = Math.floor(res.detail['currentTime'])
  },
  send_danmu: function() {
    var that = this
    if (this.data.danmu_content != '' && this.currentTime != undefined)
    {
       this.videoContext.sendDanmu({
          text: this.data.danmu_content,
          color: getRandomColor()
        }),
        todos.add({
          data: {
            nickName: app.globalData.userInfo.nickName,
            video_title: that.data.video_title,
            time_send: mydate.toLocaleString(),
            time: that.currentTime,
            text: that.data.danmu_content,
            color: getRandomColor()
          },
          success(res) {}
        })
      this.setData({
        danmu_content: ''
      })
    } else {
      wx.showToast({
        title: '请稍后发弹幕',
        icon: 'none'
      })
    }
  },
  bindInput: function(e) {
    this.setData({
      danmu_content: e.detail.value
    })
  },
  next_chapter: function() {
    var that=this
    if (this.data.chapter_current <= 7) {
      var next_c = this.data.chapter_current + 1
      var next_t = 'v' + next_c
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      wx.setNavigationBarTitle({
        title: '看视频(' + next_c + '/8)学Python'
      })
      this.setData({
        chapter_current: next_c,
        video_title: this.data.video_titles[next_t],
        video_src: this.data.video_srcs[next_t],
        control_video: '播放(快捷操作)'
      })
      that.abtain_danmu_list()
      wx.hideLoading()
    } else {
      wx.showToast({
        title: '您已学完目前所有课程',
        icon: 'none'
      })
    }
  },
  previous_chapter: function() {
    var that=this
    if (this.data.chapter_current > 1) {
      var next_c = this.data.chapter_current - 1
      var next_t = 'v' + next_c
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      wx.setNavigationBarTitle({
        title: '看视频(' + next_c + '/8)学Python'
      })
      this.setData({
        chapter_current: next_c,
        video_title: this.data.video_titles[next_t],
        video_src: this.data.video_srcs[next_t],
        control_video: '播放(快捷操作)'
      })
      that.abtain_danmu_list()
      wx.hideLoading()
    } else {
      wx.showToast({
        title: '您已在起点',
        icon: 'none'
      })
    }
  },
  play_occur: function() {
    this.setData({
      button_send_disable: false,
      control_video:'暂停(快捷操作)'
    })
  },
  pause_occur: function() {
    this.setData({
      control_video:'播放(快捷操作)'
    })
  },
  end_occur: function() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否播放下一章视频？？？',
      showCancel: true,
      cancelText: '再看一遍',
      cancelColor: 'red',
      confirmText: '下章走起',
      confirmColor: 'green',
      success: function(res) {
        if (res.confirm)
          that.next_chapter()
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  video_error: function(e) {
    this.setData({
      video_title: '视频错误消息' + e.detail.error + '  下拉刷新'
    })
  },
  video_wating: function(e) {

  }
})
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
    i_w: 60,
    i_h: 60,
    video_title: '第1章 Python入门导学',
    video_src: 'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/python_videos/第1章 Python入门导学.mp4?sign=56463ab283e4fb85465603b62788ca03&t=1551939711',
    chapter_current: 1,
    video_titles: {
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
      v1: 'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/python_videos/第1章 Python入门导学.mp4',
      v2: 'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/python_videos/第2章 Python环境安装.mp4',
      v3: 'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/python_videos/第3章 理解什么是写代码与Python的基本类型.mp4',
      v4: 'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/python_videos/第4章 Python中表示“组”的概念与定义.mp4',
      v5: 'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/python_videos/第5章 变量与运算符.mp4',
      v6: 'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/python_videos/第6章 分支、循环、条件与枚举.mp4',
      v7: 'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/python_videos/第7章 包、模块、函数与变量作用域.mp4',
      v8: 'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/python_videos/第8章 Python函数.mp4'
    },
    danmu_amount: 0,
    danmu_list: [],
    danmu_content: '',
    button_send_disable: true,
    control_video: '播放(快捷操作)',
    basic_hidden: false,
    exercise_hidden: true,
    hide: false,
    exercise_titles: [
      'Pygame游戏库1',
      'Pygame游戏库2',
      'Pygame游戏库3',
      '爬猫眼1',
      '爬猫眼2',
      '爬猫眼3',
      '爬喜马拉雅1',
      '爬喜马拉雅2',
      '爬喜马拉雅3',
      '爬英雄联盟皮肤',
      '由于小程序存储空间有限，分享至此为止'
    ],
    exercise_srcs: [

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: 'Python基础视频(' + this.data.chapter_current + '/8)'
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
    var that = this
    this.videoContext = wx.createVideoContext('myVideo')
    that.abtain_danmu_list()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.videoContext.pause()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '这个小程序学Python挺不错，快来围观',
      path: 'pages/login/login'
    }
  },
  control_video: function() {
    if (this.data.control_video == '播放(快捷操作)')
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
            complete() {
              that.setData({
                danmu_list: array_data
              })
              for (i; i < batchTimes; i++) {
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
              var delete_redundancy_list = this.data.danmu_list
              cs(delete_redundancy_list)
            }
          })
        }

      }
    })
  },
  //微信二维码
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
  //获取视频当前播放时间
  video_time_update: function(res) {
    this.currentTime = Math.floor(res.detail['currentTime'])
  },
  send_danmu: function() {
    var that = this
    if (this.data.danmu_content != '' && this.currentTime != undefined) {
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
    var that = this
    if (this.data.chapter_current <= 7) {
      var next_c = this.data.chapter_current + 1
      var next_t = 'v' + next_c
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      wx.setNavigationBarTitle({
        title: 'Python基础视频(' + next_c + '/8)'
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
    var that = this
    if (this.data.chapter_current > 1) {
      var next_c = this.data.chapter_current - 1
      var next_t = 'v' + next_c
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
      wx.setNavigationBarTitle({
        title: 'Python基础视频(' + next_c + '/8)'
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
      control_video: '暂停(快捷操作)'
    })
  },
  pause_occur: function() {
    this.setData({
      control_video: '播放(快捷操作)'
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

  },
  get_tapitem: function(e) {
    var str = e.target.id
    if (str.startsWith('v')) {
      var id = str.substr(1, 1)
      console.log(id)
      this.setData({
        video_title: this.data.video_titles[str],
        video_src: this.data.video_srcs[str],
        chapter_current: id
      })
      wx.setNavigationBarTitle({
        title: 'Python基础视频(' + this.data.chapter_current + '/8)'
      })
    } else {
      if (str == '10' || str == '11' || str == '12')
        wx.setClipboardData({
          data: 'microcodelife',
          success(){
            wx.showModal({
              title: '公众号复制成功',
              content: '藏得这么隐秘都被你发现了，好有缘，去搜索公众号关注我吧',
              showCancel:false
            })
          }
        })
      else {
        // https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/exercise_videos/xpath爬取图片.mp4
        var src = 'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/exercise_videos/' + this.data.exercise_titles[str] + '.mp4'
        // console.log(src)
        this.setData({
          video_title: this.data.exercise_titles[str],
          video_src: src
        })
      }
    }
    wx.pageScrollTo({
      scrollTop: 0,
    })
  },
  basic: function() {
    wx.setNavigationBarTitle({
      title: 'Python基础视频(' + this.data.chapter_current + '/8)',
    })
    this.setData({
      basic_hidden: false,
      exercise_hidden: true,
      hide: false
    })
  },
  exercise: function() {
    wx.setNavigationBarTitle({
      title: 'Python爬虫实战',
    })
    this.setData({
      basic_hidden: true,
      exercise_hidden: false,
      hide: true
    })
  }
})
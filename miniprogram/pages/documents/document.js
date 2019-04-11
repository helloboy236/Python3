// miniprogram/pages/documents/document.js
const app = getApp()
const db = wx.cloud.database({
  env: 'a-1-b4b138'
})
const todos = db.collection('integral')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: [
      false,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true
    ],
    image: [
      '/images/lock_u.png',
      '/images/lock_c.png',
      '/images/lock_c.png',
      '/images/lock_c.png',
      '/images/lock_c.png',
      '/images/lock_c.png',
      '/images/lock_c.png',
      '/images/lock_c.png',
      '/images/lock_c.png',
      '/images/lock_c.png',
      '/images/lock_c.png',
      '/images/lock_c.png'
    ],
    urls: [
      'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/documents/Python100经典练习题.pdf',
      'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/documents/Linux黑客的python编程之道.pdf',
      'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/documents/Python 实战-从菜鸟到大牛的进阶之路.pdf',
      'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/documents/Python_文本处理指南.pdf',
      'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/documents/Python3网络爬虫数据采集.pdf',
      'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/documents/Python练习集100题.pdf',
      'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/documents/PS初级素材(1).pdf',
      'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/documents/Python开发实战.pdf',
      'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/documents/零基础学python.pdf',
      'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/documents/影响力.pdf',
      'https://612d-a-1-b4b138-1258455603.tcb.qcloud.la/documents/用Python写网络爬虫.pdf'
    ],
    names: [
      'Python100经典练习题',
      'Linux黑客的python编程之道.pdf',
      '实战-从菜鸟到大牛的进阶',
      'Python_文本处理指南',
      'Python3网络爬虫数据采集',
      'Python练习集100题',
      'PS初级素材',
      'Python开发实战',
      '零基础学python',
      '影响力',
      '用Python写网络爬虫'
    ],
    button_hidden: true,
    downloadTask: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.setNavigationBarTitle({
      title: 'Python相关文档',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    var doc = app.globalData.documents
    for (let i in doc) {
      var j = doc[i]
      that.data.image[j] = '/images/lock_u.png'
      that.data.disabled[j] = false
    }
    that.setData({
      image: that.data.image,
      disabled: that.data.disabled
    })
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
  click: function(e) {
    var that = this
    var id = e.target.id
    wx.showLoading({
      title: '正在打开'
    })
    this.setData({
      button_hidden: false
    })
    that.data.downloadTask = wx.downloadFile({
      url: that.data.urls[id],
      success(res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath,
          success(res) {
            // console.log('打开文档成功')
            wx.hideLoading()
          },
          fail(res) {
            wx.showToast({
              title: '请重试',
            })
          }
        })
      }
    })
    that.data.downloadTask.onProgressUpdate((res) => {
      wx.showLoading({
        title: '正在加载' + res.progress + '%',
      })
      // console.log('下载进度', res.progress)
      // console.log('已经下载的数据长度', res.totalBytesWritten)
      // console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
    })
  },
  unlock: function(e) {
    var that = this
    if(that.data.downloadTask!=0){
      that.setData({
        button_hidden: true
      })
      that.data.downloadTask.abort()
    }
    var id = e.target.id
    // console.log(id)
    if (this.data.disabled[id] == true) {
      if (app.globalData.integral >= 20) {
        app.globalData.integral -= 20
        wx.showLoading({
          title: '解锁中',
          mask: true
        })
        var documents = app.globalData.documents
        documents.push(parseInt(id))
        app.globalData.documents = documents
        todos.doc(app.globalData.id).update({
          data: {
            integral: db.command.inc(-20),
            documents: documents
          },
          success(res) {
            that.data.image[id] = '/images/lock_u.png'
            that.data.disabled[id] = false
            that.setData({
              image: that.data.image,
              disabled: that.data.disabled
            })
            wx.hideLoading()
          }
        })
      } else
        wx.showModal({
          title: '解锁失败',
          content: '金牌不足20（金牌可通过每日签到获得，连续签到有几率开出暴击）',
          showCancel: false,
          confirmText: '我知道了'
        })
    } else {
      wx.showModal({
        title: '提醒',
        content: '该文档已经解锁，确定继续上锁？(上锁将不会退换积分,坏笑)',
        cancelText: '点错了',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '关闭中',
              mask: true
            })
            var documents = app.globalData.documents
            for (let i in documents) {
              if (documents[i] == parseInt(id)) {
                documents.splice(i, 1)
              }
            }
            documents.splice(id, 1)
            app.globalData.documents = documents
            todos.doc(app.globalData.id).update({
              data: {
                documents: documents
              },
              success(res) {
                that.data.image[id] = '/images/lock_c.png'
                that.data.disabled[id] = true
                that.setData({
                  image: that.data.image,
                  disabled: that.data.disabled
                })
                wx.hideLoading()
              }
            })
          }
        }
      })
    }
  },
  cancel: function() {
    var that = this
    that.data.downloadTask.abort()
    this.setData({
      button_hidden: true
    })
    wx.showLoading({
      title: '取消中',
    })
    setTimeout(function() {
      wx.hideLoading()
    }, 2000)
  }
})
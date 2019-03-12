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
    xcxm_hidden: true,
    notes_hidden: true,
    mark_show_share: 0,
    mark_show_notes: 0,
    xcxm_w: 0,
    xcxm_h: 0,
    notes_html: '<table width="335m"><tr><th>最新版更新介绍</th></tr>' +
      '<tr><td width="80rpx">日期</td><td width="55rpx">版本号</td><td>更新内容</td></tr>' +
      '<tr><td>2019/3/12</td><td>1.4.0</td><td>1、增加基础实战部分<br/>2、下线更改头像昵称功能，以优化代码，拥有良好的体验<br/>3、增加同声传译英文学习系统，为英文文档做准备\n4、简化界面（有朋友提出界面花里胡哨不太好，于是诞生了现在的黑白界面，你们有什么想法也可以在关于界面内留言）</td></tr></table>'
  },
  onLoad: function(options) {
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    var that = this;
    wx.hideLoading()
    that.setData({
      xcxm_hidden: false,
      hidden: false
    })
    wx.showToast({
      title: '登录成功'
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
  test: function() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '腾讯官方给出的同声传译插件，去试试吧',
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
      url: 'translation/translation',
    })
  }
})
// pages/first/first.js
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {

    },
    /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: 'Python基础知识',
    })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

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
    chapter1: function() {
      wx.navigateTo({
        url: 'chapters/c1/c1',
      })
    },
    chapter2: function() {
      wx.navigateTo({
        url: 'chapters/c2/c2',
      })
    },
    chapter3: function() {
      wx.navigateTo({
        url: 'chapters/c3/c3',
      })
    },
    chapter4: function() {
      wx.navigateTo({
        url: 'chapters/c4/c4',
      })
    },
    chapter5: function() {
      wx.navigateTo({
        url: 'chapters/c5/c5',
      })
    },
    chapter6: function() {
      wx.navigateTo({
        url: 'chapters/c6/c6',
      })
    },
    chapter7: function() {
      wx.navigateTo({
        url: 'chapters/c7/c7',
      })
    },
    chapter8: function() {
      wx.navigateTo({
        url: 'chapters/c8/c8',
      })
    },
    chapter9: function() {
      wx.navigateTo({
        url: 'chapters/c9/c9',
      })
    },
    chapter10: function() {
      wx.navigateTo({
        url: 'chapters/c10/c10',
      })
    },
  exercise1: function () {
    wx.navigateTo({
      url: 'exercise/e1/e1',
    })
  },
  exercise2: function () {
    wx.navigateTo({
      url: 'exercise/e2/e2',
    })
  },
  exercise3: function () {
    wx.navigateTo({
      url: 'exercise/e3/e3',
    })
  },
  exercise4: function () {
    wx.navigateTo({
      url: 'exercise/e4/e4',
    })
  },
  exercise5: function () {
    wx.navigateTo({
      url: 'exercise/e5/e5',
    })
  }
})
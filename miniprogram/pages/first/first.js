// pages/first/first.js
const app=getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    disabled:true,
    studied:"#848484"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options){
    wx.setNavigationBarTitle({
      title: 'Python3',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: 'Python3',
    })
    var that = this
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          disabled: false
        })
      },
      fail: function () {
        wx.showModal({
          title: '温馨提示',
          content: '登录后即可使用全部功能',
          showCancel: true,
          cancelText: '就不去',
          cancelColor: 'red',
          confirmText: '好',
          confirmColor: 'green',
          success: function (res) {
            if (res.confirm)
              wx.switchTab({
                url: '../mine/mine'
              })
          },
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    wx.showShareMenu({
      
    })
  },
  chapter1:function(){
    wx.navigateTo({
      url: 'chapters/c1/c1',
    })
  },
  chapter2: function () {
    wx.navigateTo({
      url: 'chapters/c2/c2',
    })
  },
  chapter3: function () {
    wx.navigateTo({
      url: 'chapters/c3/c3',
    })
  },
  chapter4: function () {
    wx.navigateTo({
      url: 'chapters/c4/c4',
    })
  },
  chapter5: function () {
    wx.navigateTo({
      url: 'chapters/c5/c5',
    })
  },
  chapter6: function () {
    wx.navigateTo({
      url: 'chapters/c6/c6',
    })
  },
  chapter7: function () {
    wx.navigateTo({
      url: 'chapters/c7/c7',
    })
  },
  chapter8: function () {
    wx.navigateTo({
      url: 'chapters/c8/c8',
    })
  },
  chapter9: function () {
    wx.navigateTo({
      url: 'chapters/c9/c9',
    })
  },
})
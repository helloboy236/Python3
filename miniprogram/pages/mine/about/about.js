// pages/mine/about/about.js
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '关于',
    })
  },
  returnmine:function(){
    wx.navigateBack({})
  },
  copy:function(e){
    console.log(e.target.id)
    wx.setClipboardData({
      data: e.target.id
    })
  }
})
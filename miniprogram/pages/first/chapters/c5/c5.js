// miniprogram/pages/first/chapters/c4/c4.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    html: "<br/><p>(附)转义字符表：</p>\
    <table style='line-height: 20px; color: red;lighting-color: black;'><tr><th>转义字符</th><th>描述</th></tr>" +
      "<tr>\
      <td>\\</td>\
        <td>(在行尾时) 续行符</td></tr><tr><td>\\</td><td>反斜杠符号</td></tr>\
      <tr>\
        <td>\\a</td>\
        <td>响铃</td>\
      </tr>\
      <tr>\
        <td>\\b</td>\
        <td>退格(Backspace)</td>\
      </tr>\
      <tr>\
        <td>\\e</td>\
        <td>转义</td>\
      </tr>\
      <tr>\
        <td>\\000</td>\
        <td>空</td>\
      </tr>\
      <tr>\
        <td>\\n</td>\
        <td>换行</td>\
      </tr>\
      <tr>\
        <td>\\v</td>\
        <td>纵向制表符</td>\
      </tr>\
      <tr>\
        <td>\\t</td>\
        <td>横向制表符</td>\
      </tr>\
      <tr>\
        <td>\\r</td>\
        <td>回车</td>\
      </tr>\
      <tr>\
        <td>\\f</td>\
        <td>换页</td>\
      </tr><table>"

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: 'Python的基本数据类型',
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
    wx.startPullDownRefresh()
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

  },
  returnMain: function () {
    wx.navigateBack({
    })
  }
})
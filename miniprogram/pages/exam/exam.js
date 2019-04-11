// miniprogram/pages/exam/exam.js
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
    titles: ['第一套试题', '第二套试题', '第三套试题', '第四套试题', '第五套试题', '第六套试题', '第七套试题', '第八套试题', '第九套试题', '第十套试题', '第十一套试题', '第十二套试题']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '计算机二级Python试题练习',
    })
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '这个小程序学Python挺不错，快来围观',
      path: 'pages/login/login'
    }
  },
  select: function(e) {
    app.globalData.exam_id = e.target.id
    var integral = app.globalData.integral
    wx.showModal({
      title: '测验',
      content: '确定要花费3枚金牌去做这一套题吗?',
      success(res) {
        if (res.confirm) {
          if (app.globalData.integral >= 3) {
            todos.doc(app.globalData.id).update({
              data: {
                integral: db.command.inc(-3)
              },
              success(res) {
                wx.showLoading({
                  title: '请等待',
                })
                wx.navigateTo({
                  url: 'detail/detail',
                })
                wx.hideLoading()
              }
            })
          } else {
            wx.showToast({
              title: '积分不足',
              icon: 'none'
            })
          }
        }
      }
    })
  }
})
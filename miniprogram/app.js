//app.js
App({
  onLaunch: function () {
    wx.setNavigationBarTitle({
      title: 'Python3',
    })
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    this.globalData = {
      userInfo:{},
      screen_height:0,
      screen_width:0,
      integral:0,  //积分
      id:'',    //积分id
      documents:[],   //文档
      exam_id:0      //第几套试卷
    } 
  }, 
  onHide: function () {
    wx.stopBackgroundAudio()
  },
})

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
  getRecordAuth: function () {
    wx.getSetting({
      success(res) {
        console.log("succ")
        console.log(res)
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              console.log("succ auth")
            }, fail() {
              console.log("fail auth")
            }
          })
        } else {
          console.log("record has been authed")
        }
      }, fail(res) {
        //console.log("fail")
        //console.log(res)
      }
    })
  },
  onHide: function () {
    wx.stopBackgroundAudio()
  },
})

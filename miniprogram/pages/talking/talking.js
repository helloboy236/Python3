// miniprogram/pages/talking/talking.js
const app = getApp()
var mydate = new Date()
const db = wx.cloud.database({
  env: 'a-1-b4b138'
})
const todos = db.collection('talking')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    movable_hidden:true,
    amount_base:0,
    amount:0,
    input_x:0,
    input_y:0,
    tip:'我也发一个',
    s_hidden: true,
    message:'     1、此处准许你畅所欲言，想说什么说什么，不开心什么的尽管发泄在此，这里就是无人问津树洞，没人知道你是谁，完全匿名。\n 2、无论你是程序遇到接二连三的bug，无处发泄，还是生活上遇到什么困难，都可以在这里尽情地发泄你的情绪，我们都是你的倾听者！！！\n3、你也可以在这里发表你的编程思想或者工作时的大概情况，让目前没有从业的人员参考一下。\n4、你可以分享你的编程经验，或者编程小知识。\n5、甚至可以发送你的个性签名，人生格言。\n6、可能我不足够优秀，得不到你的芳心，但我会不断努力，改善之路希望有你的建议和参与。树洞由我们一起发扬光大，加油，程序猿们。\n print("Good luck(^_^)")&nbsp;&nbsp;#祝你编程之路顺利',
      title:'陌生人，你好，关于该页面，我有话说',
      nickname_input:'',
      message_input:'',
      data_array:[],
      dx_hidden:true,
      delete_hidden:true,
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.refresh()
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
    var that=this
    if (app.globalData.userInfo.nickName != undefined)
    {
      that.setData({
        movable_hidden:false,
      })
    } else {
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
    var that = this
    that.refresh()
    wx.stopPullDownRefresh()
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
  refresh:function() {
    var that = this
    wx.showToast({
      title: '加载中',
      image: 'translation.png',
      duration:2000,
    })
    todos.count({
      success(res) {
        var c=res.total-that.data.amount_base
        var str='加载新纪录:'+c
        that.setData({
          amount: res.total,
          amount_base: res.total,
        })
        wx.setNavigationBarTitle({
          title: '畅所欲言(' + that.data.amount + '/' + that.data.amount_base + ')',
        })
        wx.showToast({
          title: str,
        })
      },
      complete() {
        const batchTimes = Math.ceil(that.data.amount / 20)
        const array_data = []
        for (let i = 0; i < batchTimes; i++) {
          if (i == 0)
          {
              todos.orderBy('date', 'asc').orderBy('time','asc').get({
              success(res) {
                  const result = res.data
                for (let j = 0; j < result.length; j++)
                  array_data.push(result[j])
              },
              complete() {
                that.setData({
                  data_array: array_data
                })
              }
              })
            }
          else
          {
            todos.orderBy('date', 'asc').orderBy('time', 'asc').skip(i * 20).limit(20).get({
              success(res) {
                const result = res.data
                for (let j = 0; j < result.length; j++)
                  array_data.push(result[j])
              },
              complete() {
                that.setData({
                  data_array: array_data
                })
              }
            })
          }
        }
      }
    })
  },
  previous_item: function () {
    var that = this
    var data_res = this.data.data_array
    var i = that.data.amount_base
        var j = ++that.data.amount
        if (j >= i)
        {
          j--
          that.setData({
            amount: i-1,
          })
          wx.setNavigationBarTitle({
            title: '畅所欲言(' + j + '/' + i + ')',
          })
          wx.showToast({
            title: '塔顶风大，小心着凉',
            icon: 'none',
            duration: 2000,
          })
        }
        else
        {
          that.setData({
            title: data_res[j]['nickName2'],
            message: data_res[j]['messages']
          })
          wx.setNavigationBarTitle({
            title: '畅所欲言(' + j + '/' + i + ')',
          })
          wx.hideToast()
        }
  },
  next_item:function(){
    var that=this
    var i = that.data.amount_base
    var data_res=this.data.data_array
        var j = --that.data.amount
        if(j<0)
        {
          j++
          that.setData({
            amount:0,
          })
          wx.setNavigationBarTitle({
            title: '畅所欲言(' + j + '/' + i + ')',
          })
          wx.showToast({
            title: '抱歉，我没建造地下室',
            icon: 'none',
            duration: 2000,
          })
        }
        else
        {
          //var i = Math.floor(Math.random() * j);
          that.setData({
            title: data_res[j]['nickName2'],
            message: data_res[j]['messages']
          })
          wx.setNavigationBarTitle({
            title: '畅所欲言(' + j + '/' + i + ')',
          })
          wx.hideToast()
      }

  },
  delete_item:function(){
    console.log(this.data.amount)
    var delete_id = this.data.data_array[this.data.amount]['_id']
    console.log(delete_id)
    wx.showModal({
      title: 'delete',
      content: '确定删除'+this.data.amount,
      showCancel: true,
      cancelText: '取消',
      cancelColor: '',
      confirmText: '确定',
      confirmColor: '',
      success: function(res) {
        if (res.confirm) {
          var ret = todos.doc(delete_id).remove({
            success(res){
              if(res.stats['removed']==1)
              {   wx.showToast({
                  title: '删除成功',
                })
              }
              else{
                wx.showToast({
                  title: '删除失败',
                })
              }
            }
          });
        } else if (res.cancel) {
          wx.showToast({
            title: '取消删除',
            icon: 'none',
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
      
  },
  send_one:function(){
    if (this.data.tip =='我也发一个')
      this.setData({
       tip:'算了',
       s_hidden:false,
       input_x:0,
       input_y:200
      })
    else
      this.setData({
        tip: '我也发一个',
        s_hidden: true,
        input_x: 0,
        input_y: 0
      })
  },
  send:function(){
    var that=this
    if(this.data.nickname_input=='')
      this.data.nickname_input='匿名用户'
    if(app.globalData.userInfo.nickName!=undefined){
      console.log('unload')
      if (this.data.message_input != '') {
        todos.add({
          data: {
            nickName: app.globalData.userInfo.nickName,
            nickName2:this.data.nickname_input,
            data: mydate.toLocaleDateString(),
            time: mydate.toLocaleTimeString(),
            messages:this.data.message_input
          }, success(res) {
            wx.showToast({
              title: '投入树洞成功',
              duration: 2000
            })
            that.setData({
              message_input: '',
              nickname_input: '',
              tip: '我也发一个',
              s_hidden: true,
              mask: true
            })
          }
        })
      }
      else{
        wx.showToast({
          title: '先写点什么吧',
          icon:'none',
        })
      }
    }
    else
    {
      if (this.data.message_input != '') {
        todos.add({
          data: {
            nickName:'unlogin',
            nickName2: this.data.nickname_input,
            time: mydate.toLocaleTimeString(),
            data: mydate.toLocaleDateString(),
            messages: this.data.message_input
          }, success(res) {
            wx.showToast({
              title: '投入树洞成功',
              duration: 2000,
              mask:true
            })
            that.setData({
              message_input:'',
              nickname_input:'',
              tip: '我也发一个',
              s_hidden: true
            })
          }
        })
      }
      else{
        wx.showToast({
          title: '先写点什么吧',
          icon:'none',
          mask:true
        })
      }
    }
  },
  bi_name(e){
    this.setData({
      nickname_input:e.detail.value
    })
    if (app.globalData.userInfo['nickName']=="乐逍遥" && e.detail.value=='wudi')
      this.setData({
        delete_hidden:false,
      })
    else
      this.setData({
        delete_hidden:true,
      })
  },
  bi_message(e){
    this.setData({
      message_input:e.detail.value
    })
  },
  return_home:function(){
    wx.reLaunch({
      url: 'talking'
    })
  }
})
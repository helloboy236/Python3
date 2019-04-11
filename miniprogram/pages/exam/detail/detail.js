// miniprogram/pages/exam/detail/detail.js
const db = wx.cloud.database({
  env: 'a-1-b4b138'
})
const todos = db.collection('exams')
const todo = db.collection('integral')
var green = '#04B404'
var red = '#FF0000'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',
    options: ['A', 'B', 'C', 'D'],
    number: 0, //题号
    index: 0,
    title: '少年，看你骨骼惊奇，是个练武的好材料，送你一件法器', //题目
    contents: ['饕餮', '魑魅', '麒麟', '魍魉'], //选项
    answer: '', //正确答案
    answers: [], //保存首次用户答案，用于统计分数
    answers_last: [],
    correct_answers: [],
    error_rubrics: [],
    right: false,
    wrong: true,
    color: green,
    contnetss: [], //题目库
    id: 0, //试题号
    finished: false, //展示题目
    name: '小明',
    gold: 0,
    checkbox: true,
    errors: [],
    abc: [] //上传数据专用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.id = app.globalData.exam_id
    var num = this.data.number + 1
    var chapter = parseInt(this.data.id) + 1
    wx.setNavigationBarTitle({
      title: '第' + chapter + '套试题(' + num + '/40)',
    })
    var that = this
    // 上传
    // todos.add({
    //   data:{
    //     content: this.data.abc,
    //     id:0
    //   },success(res){
    //     console.log(res)
    //   }
    // })
    // 下载
    // console.log(app.globalData.id)
    that.downexam(this.data.id)
  },
  //加载试卷
  downexam: function(id) {
    var that = this
    todos.where({
      id: parseInt(id)
    }).get({
      success(res) {
        var text = res.data[0].content[0] //原文本内容
        that.data.contentss = res.data[0].content
        that.parse(text)
      }
    })
  },
  //解析试卷内容
  parse: function(text) {
    var that = this
    var contents = []
    for (let i in text) {
      // console.log(text[i])
      if (text[i] == 'B' || text[i] == 'C' || text[i] == 'D')
        continue
      else {
        contents.push(text[i])
      }
    }
    var index = contents.findIndex(function(value, index, arr) {
      return value == 'A'
    })
    var title = ''
    for (let i = 0; i < index; i++) {
      // console.log(i)
      // console.log(this.data.contentss[this.data.number])
      title += this.data.contentss[this.data.number][i]
      title += '\n'
    }
    // console.log(title)
    contents.splice(0, index + 1)
    var answer = contents[4].substring(5, 6)
    if (this.data.number == this.data.correct_answers.length)
      this.data.correct_answers.push(answer)
    that.setData({
      title: title,
      contents: contents,
      answer: answer
    })
    wx.hideLoading()
  },
  //当用户做出选择时执行
  selected: function(e) {
    var usr = e.detail.value //用户的选择
    var id = e.target.id //题号
    if (this.data.answers.length == id) {
      this.data.answers.push(usr)
    }
    if (usr == this.data.answer) {
      this.data.answers_last.push(usr)
      this.setData({
        right: true,
        wrong: true,
        color: green
      })
    } else {
      if (this.data.checkbox) {
        wx.vibrateLong()
      }
      this.setData({
        right: false,
        wrong: false,
        color: red
      })
    }
  },
  //触摸开始，用于滑动切换
  touchstart: function(e) {
    this.startpoint = e.touches[0].pageX
  },
  touchend: function(e) {
    var that = this
    this.endpoint = e.changedTouches[0].pageX
    var cz = this.startpoint - this.endpoint //触摸起点与终点的差值
    that.judge(cz)
  },
  //判断是否有资格进行下一题
  judge: function(cz) {
    wx.showLoading({
      title: ''
    })
    var that = this
    if (cz > 99) {
      if (this.data.right || this.data.answers_last[this.data.number] != undefined) {
        //show next
        if (this.data.answers_last[this.data.number] == undefined){
          this.data.answers_last.push(this.data.answer)
        }
        that.next()
      } else {
        wx.showToast({
          title: '请至少选对答案后继续下一题',
          duration: 2000,
          icon: 'none'
        })
        // that.next()
      }
    } else if (cz < -99) {
      // show preview
      that.preview()
    }else{
      wx.hideLoading()
    }
  },
  //上一题
  preview: function() {
    var that = this
    this.data.number -= 1
    if (this.data.number < 0) {
      this.data.number = 0
      wx.showToast({
        title: '已在第一题',
        icon: 'none'
      })
    } else {
      var checked = 'checked' + this.data.correct_answers[this.data.number]
      this.setData({
        right: false,
        wrong: true,
        [checked]: true,
        number: this.data.number,
        color: green
      })
      var num = this.data.number + 1
      var chapter = parseInt(this.data.id) + 1
      wx.setNavigationBarTitle({
        title: '第' + chapter + '套试题(' + num + '/40)',
      })
      that.parse(this.data.contentss[this.data.number])
    }
    // console.log(this.data.number)
  },
  //下一题
  next: function() {
    var that = this
    this.data.number += 1

    if (this.data.answers_last[this.data.number] == this.data.correct_answers[this.data.number] && this.data.answers_last[this.data.number]!=undefined) {
      var checked = 'checked' + this.data.correct_answers[this.data.number]
      // console.log(checked)
      this.setData({
        right: false,
        wrong: true,
        [checked]: true,
        number: this.data.number
      })
    } else {
      this.setData({
        right: false,
        wrong: true,
        checkedA: false,
        checkedB: false,
        checkedC: false,
        checkedD: false,
        number: this.data.number
      })
    }
    // console.log(this.data.contentss)
    if (this.data.number > 39) {
      this.data.number = 39
      wx.showModal({
        title: '完成',
        content: '你已经做完了所有题目，是否结束本套题目？',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '统计中',
            })
            that.setData({
              finished: true
            })
            var score = 0
            var errors = []
            for (let i = 0; i < 40; i++) {
              if (that.data.answers[i] == that.data.correct_answers[i]) {
                score += 1
              } else {
                errors.push(i + 1)
              }
            }
            wx.setStorage({
              key: 'error' + that.data.id,
              data: errors
            })
            that.setData({
              gold: Math.floor(score / 4)
            })
            todo.doc(app.globalData.id).update({
              data: {
                integral: db.command.inc(Math.floor(score / 4))
              },
              success(res) {
                wx.showToast({
                  title: '下发奖励成功',
                })
              }
            })
            wx.setNavigationBarTitle({
              title: '本次成绩：' + score + '分',
            })
            wx.hideLoading()
            var tit = ''
            if (score > 30)
              tit = '优秀'
            else if (score > 20)
              tit = '不错'
            else
              tit = '加油'
            wx.showToast({
              title: tit,
            })
            // clearTimeout(s1)
          }
        }
      })
    } else {
      if (this.data.number == 39){
        wx.showToast({
          title: '最后一道题了',
          icon: 'none'
        })
      }
      var num = this.data.number + 1
      var chapter = parseInt(this.data.id) + 1
      wx.setNavigationBarTitle({
        title: '第' + chapter + '套试题(' + num + '/40)',
      })
      that.parse(this.data.contentss[this.data.number])
    }
  },
  preview1: function() {
    var that = this
    that.judge(-100)
  },
  next1: function(e) {
    var that = this
    that.judge(100)
  },
  back: function() {
    wx.navigateBack({})
  },
  shock: function(e) {
    if (this.data.checkbox == true)
      this.data.checkbox = false
    else
      this.data.checkbox = true
  },
  view_error: function() {
    var that = this
    wx.getStorage({
      key: 'error' + that.data.id,
      success: function(res) {
        console.log(res.data)
        var title = ''
        for (let i = 0; i < res.data.length; i++) {
          title += res.data[i] + ','
        }
        wx.showModal({
          title: '错题',
          content: title,
          showCancel: false,
          confirmText: '我知道了'
        })
      }
    })
  }
})
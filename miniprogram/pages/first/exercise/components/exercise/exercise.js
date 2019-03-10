// pages/first/exercise/components/exercise/exercise.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    problem:String,
    image:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    code_hidden:true,
    i:0,
    tip:'打开参考代码'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    open_reference_code:function(){
      if(this.data.i==0)
      {
        this.setData({
          code_hidden: false,
          i:1,
          tip:'关闭参考代码'
        })
      }else{
        this.setData({
          i: 0,
          code_hidden: true,
          tip: '打开参考代码'
        })
      }
    }
  }
})

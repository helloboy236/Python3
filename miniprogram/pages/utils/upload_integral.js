
const db = wx.cloud.database({
  env: 'a-1-b4b138'
})
const todos = db.collection('integral')
function updateIntegral(nickname, continuous, integral){
  todos.where({
    nickname:nickname,
    openId:openid,
  }).update({
    integral:integral
  })
}
module.export.update = updateIntegral
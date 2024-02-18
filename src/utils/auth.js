// 操作认证信息token的工具函数
const KEY = 'geek-client-pc-store'
export default {
  // 获取token
  getToken () {
    return localStorage.getItem(KEY)
  },
  // 设置token
  setToken (token) {
    localStorage.setItem(KEY, token)
  },
  // 删除token
  delToken () {
    localStorage.removeItem(KEY)
  }
}

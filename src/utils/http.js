import axios from 'axios'
import auth from './auth'
import router from '@/router'
const instance = axios.create({
  baseURL: 'https://geek.itheima.net/',
  timeout: 5000
})
instance.interceptors.request.use(
  config => {
    const token = auth.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  err => Promise.reject(err)
)
instance.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      auth.delToken()
      router.push('/login')
    }
    return Promise.reject(err)
  }
)
export default instance

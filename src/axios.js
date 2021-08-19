import axios from 'axios'

const pendingHttp = {}
const CancelToken = axios.CancelToken

axios.interceptors.request.use(config => {
  console.log(config)
  
  new CancelToken((cancel) => {
    const url = config.url
    console.log(pendingHttp)
    if (!Object.prototype.hasOwnProperty.call(pendingHttp, url)) {
      pendingHttp[url] = [{ url, cancel}]
    } else {
      console.log(111)
      cancel("已经有了不重复执行")
      // pendingHttp[url].push({ url, cancel})
    }
  })
  return config
})

axios.interceptors.response.use(data => {
  return data
}, err => {
  delete pendingHttp['/aaa']
  console.log(err)
  return err
})


export {
  axios
}
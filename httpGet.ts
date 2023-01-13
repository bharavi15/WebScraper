import axios, { AxiosInstance } from 'axios'
export function createHttpHandler (baseUrl: string) {
  return axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {}
  })
}
export async function get (instance: AxiosInstance, path: string) {
  return await instance.get(path).then(async (response: any) => {
    return await new Promise((resolve, reject) => {
      if (response.status !== 200) {
        reject(new Error(response.status + ' is not 200'))
      }
      if (response.headers['content-type']?.includes('text/html')) {
        resolve(response.data)
      } else {
        reject(new Error('content-type is not text/html'))
      }
    })
  })
}
// get(createHttpHandler('https://diat.ac.in'), '').then((response) => {
//   console.log(response)
// })

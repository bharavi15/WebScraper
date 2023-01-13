import axios, { AxiosInstance } from 'axios'
import logger from './logger'
const LOG_PREFIX = 'httpGet |'
const MAX_DEPTH = parseInt(process.env.MAX_DEPTH ?? '5')
export function createHttpHandler (baseUrl: string) {
  logger.info(`${LOG_PREFIX} creating http handler for ${baseUrl}`)
  return axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {}
  })
}
export async function get (instance: AxiosInstance, path: string, depth = 0): Promise<string> {
  logger.info(`${LOG_PREFIX} getting path ${path} at depth ${depth}`)

  if (depth > MAX_DEPTH) {
    logger.info(`${LOG_PREFIX} ignoring path ${path} as depth > ${MAX_DEPTH}`)
  }
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

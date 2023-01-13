import { createHttpHandler, get } from './httpGet'
import { writeFileSync } from 'fs'
import logger from './logger'
const LOG_PREFIX = 'index |'
const toBeVisitedUrls: string[] = []
const visitedUrls: string[] = []

logger.info(`${LOG_PREFIX} Hello world`)
const fqdn = 'google.co.in'
const host = 'https://' + fqdn
const axiosInstance = createHttpHandler(host)
toBeVisitedUrls.push(host)
get(axiosInstance, '/').then((response: any) => {
  const urls = response.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gm)
  const filteredUrls = urls
    .filter(filterStaticFiles)
    .filter(filterThirdPartyHosts)
  visitedUrls.push(host)
  toBeVisitedUrls.push(...filteredUrls)
  // const chunkedUrls = chunkify(filteredUrls, 5)
  // writeFileSync('urls.out.json', JSON.stringify(chunkedUrls, null, 2))
  logger.debug(`${LOG_PREFIX} unvisitedUrls are ${JSON.stringify(toBeVisitedUrls)}`)
  return filteredUrls
}).then((chunkedUrls) => {
})
async function visitNode (path: string): Promise<string[]> {
  const response = await get(axiosInstance, '/')
  const urls = response.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gm) ?? []
  const filteredUrls = urls
    .filter(filterStaticFiles)
    .filter(filterThirdPartyHosts)
    .filter(filterVisitedUrls)
  visitedUrls.push(host)
  toBeVisitedUrls.push(...filteredUrls)
  return []
}
function filterStaticFiles (url: string) {
  return url.match(/\.(js|pdf|docx?|css|map|jpe?g|png|svg)/gm)
}
function filterThirdPartyHosts (url: string) {
  return url.includes(fqdn)
}
function filterVisitedUrls (url: string) {
  return visitedUrls.includes(url)
}
function chunkify (arr: string[], chunkSize: number): string[][] {
  const result: string[][] = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    const result1: string[] = []
    for (let j = 0; j < chunkSize; j++) {
      if (i + j >= arr.length) { break }
      result1.push(arr[i + j])
    }
    result.push(result1)
  }
  return result
}

import { createHttpHandler, get } from './httpGet'
import { writeFileSync } from 'fs'
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
const hostname = 'google.co.in'
console.log(chunkify(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'], 2))
console.log(chunkify(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'], 3))
const axiosInstance = createHttpHandler('https://' + hostname)
get(axiosInstance, '').then((response: any) => {
  const urls = response.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gm)
  const filteredUrls = urls
    .filter(filterStaticFiles)
    .filter(filterThirdPartyHosts)
  const chunkedUrls = chunkify(filteredUrls, 5)
  writeFileSync('urls.out.json', JSON.stringify(chunkedUrls, null, 2))
  return chunkedUrls
}).then((chunkedUrls) => {

})

function filterStaticFiles (url: string) {
  return url.match(/\.(js|pdf|docx?|css|map|jpe?g|png|svg)/gm) == null
}
function filterThirdPartyHosts(url: string) {
  return url.includes(hostname)
}

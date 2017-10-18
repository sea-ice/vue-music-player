import originalJsonp from 'jsonp'

export default function jsonp (url, data, options) {
  url = constructUrl(url, data)
  return new Promise(function (resolve, reject) {
    originalJsonp(url, options, function (error, data) {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

function constructUrl (url, data) {
  let query = ''
  for (var key in data) {
    query += `&${key}=${encodeURIComponent(data[key])}`
  }
  return ~url.indexOf('?') || !query ? url + query : url + '?' + query.substring(1)
}

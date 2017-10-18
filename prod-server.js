var express = require('express')
var config = require('./config/index')
var axios = require('axios')

var port = config.build.port

var app = express()

var apiRoutes = express.Router()

apiRoutes.get('/getRecommendSongSheet', function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(function (response) {
    res.json(response.data)
  }).catch(function (error) {
    console.log(error)
  })
})

apiRoutes.get('/lyric', function (req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(response => {
    let data = response.data
    let reg = /\(({.*})\)/gi
    let match = reg.exec(data)
    data = JSON.parse(match && match[1])
    res.json(data)
  }).catch(error => {
    console.log(error)
  })
})

apiRoutes.get('/search', function (req, res) {
  var url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  axios.get(url, {
    headers: {
      origin: 'https://m.y.qq.com',
      referer: 'https://m.y.qq.com/'
    },
    params: req.query
  }).then(response => {
    res.json(response.data)
  }).catch(error => {
    console.log(error)
  })
})

apiRoutes.get('/rank', function (req, res) {
  var url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  axios.get(url, {
    headers: {
      origin: 'https://m.y.qq.com',
      referer: 'https://m.y.qq.com/'
    },
    params: req.query
  }).then(response => {
    res.json(response.data)
  }).catch(error => {
    console.log(error)
  })
})

apiRoutes.get('/rankdetail', function (req, res) {
  var url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  axios.get(url, {
    headers: {
      origin: 'https://m.y.qq.com',
      referer: 'https://m.y.qq.com/'
    },
    params: req.query
  }).then(response => {
    res.json(response.data)
  }).catch(error => {
    console.log(error)
  })
})


app.use('/api', apiRoutes)

app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs');
const ytdl = require('ytdl-core')
const uuidv1 = require('uuid/v1')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

// parse application/json
app.use(bodyParser.json())

app.get('/api', function (req, res) {
  res.send('Hello World')
})

//the idea is to get resolution 720, 480 or 360 in this priority
app.post('/api/video/youtube', function (req, res) {

  const {
    url
  } = req.body
  console.log(url)
  const nameVideo = uuidv1()

  res.header('Content-Disposition', 'attachment; filename="video.mp4"');

  ytdl(url, {
      format: 'mp4'
    })
    .pipe(res);


})

app.get('/api/video', function (req, res) {
  res.send('api/video')
})

//create api to get info
app.post('/api/video/youtube/info', function (req, res) {
  const {
    url
  } = req.body

  ytdl.getInfo(url, function (err, info) {
    if (err) throw err

    console.log(info)
    console.log('video_id:', info.video_id)
    console.log('title:', info.title)
    console.log('url:', info.video_url)
    console.log('thumbnail:', info.player_response.videoDetails.thumbnail.thumbnails[0].url)
    console.log('description:', info.description)
    res.send({
      id: info.video_id,
      title: info.title,
      author: info.author.name,
      thumbnail: info.player_response.videoDetails.thumbnail.thumbnails[0].url,
      description: info.description
    })
  })

})

//create api to list videos created


//create api to remove all videos


//create logs

//create unhandlerException

app.listen(3500)
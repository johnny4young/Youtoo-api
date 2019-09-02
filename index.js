const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs');
const youtubedl = require('youtube-dl')
const uuidv1 = require('uuid/v1')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/api', function (req, res) {
  res.send('Hello World')
})

//the idea is to get resolution 720, 480 or 360 in this priority
app.post('/api/video/youtube', function(req, res) {

  const { url } = req.body
  console.log(url)
  const nameVideo = uuidv1()

  const video = youtubedl(url,
  // Optional arguments passed to youtube-dl.
  ['--format=18'],
  // Additional options can be given for calling `child_process.execFile()`.
  { cwd: __dirname })
 
  // Will be called when the download starts.
  video.on('info', function(info) {
    console.log('Download started')
    console.log('filename: ' + info._filename)
    console.log('size: ' + info.size)
  })
  
  video.pipe(fs.createWriteStream(`/tmp/${nameVideo}.mp4`))
  
  video.on('end', function() {
    console.log('finished downloading!')
    const file = `/tmp/${nameVideo}.mp4`
    res.download(file) // Set disposition and send it.
  });
  
})

app.get('/api/video', function(req, res) {
  res.send('api/video')
})

//create api to get info
app.post('/api/video/youtube/info', function(req, res) {
  const { url } = req.body

  youtubedl.getInfo(url, function(err, info) {
    if (err) throw err
   
    console.log('id:', info.id)
    console.log('title:', info.title)
    console.log('url:', info.url)
    console.log('thumbnail:', info.thumbnail)
    console.log('description:', info.description)
    console.log('filename:', info._filename)
    console.log('format id:', info.format_id)
    res.send({id : info.id, title: info.title, thumbnail: info.thumbnail, description: info.description,
      _filename: info.filename, format_id: info.format_id})
  })

})

//create api to list videos created


//create api to remove all videos


//create logs

//create unhandlerException

app.listen(3500)
const express = require('express');
const app = express();

const uploadRouter = require('./upload');
app.use('/upload', uploadRouter)

app.listen('5050', (req, res) => {
  console.log('server on!')
})
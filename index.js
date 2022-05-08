require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const {Router} = require('./router')
const port = process.env.PORT || 8000;

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/public', express.static(`${process.cwd()}/public`))

// DB 

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

app.get('/', (req, res) => {
    res.sendFile(`${process.cwd()}/views/index.html`)
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


app.use('/api', Router)
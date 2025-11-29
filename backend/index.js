require('dotenv').config()
const express = require('express')
const fileupload = require('express-fileupload')
const path = require('path')
const cors = require('cors')
const app = express()

app.use(cors ({
    origin:true,
    credentials:'http://localhost:5173',
}))

app.use(express.json())
app.use(fileupload())
app.use('/uploads',express.static(path.join('uploads')))

app.listen(3001, () => console.log('Server Running On Port 3001') )
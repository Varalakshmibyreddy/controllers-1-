const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
 const bcrypt = require('bcryptjs')
const bodyparser = require('body-parser')
const router = require('./routes/routes')

const app = express()

const PORT = process.env.PORT || 5000

dotenv.config()

app.use(bodyparser.json())

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('mongoDB connected successfully');
})
.catch((error)=>{
    console.log(`mongoDB Error: ${error}`);
})

app.use('/api', router);

app.listen(PORT,()=>{
    console.log(`server connected successfully at ${PORT}`)
})
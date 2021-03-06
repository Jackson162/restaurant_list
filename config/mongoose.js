//import mongoose
const mongoose = require('mongoose')
//connect to mongoDB: MongoClient constructor
const MONGODB_URI = process.env.MONGODB_URI
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
//get DB connection status
const db = mongoose.connection
//connection error
db.on('error', () => {
    console.log('detect mongoDB error!!!')
})
//connection succeeds
db.once('open', () => {
    console.log('mongoDB is connected.')
})

module.exports = db
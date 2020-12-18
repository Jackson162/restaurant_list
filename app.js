const express = require('express')
//import handlebars template engine
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

//import Restaurant model
const routes = require('./routes') // /index.js (default looking for it)
require('./config/mongoose')
// //import mongoose
// const mongoose = require('mongoose')
// //connect to mongoDB: MongoClient constructor
// mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
// //get DB connection status
// const db = mongoose.connection
// //connection error
// db.on('error', () => {
//     console.log('detect mongoDB error!!!')
// })
// //connection succeeds
// db.once('open', () => {
//     console.log('mongoDB is connected.')
// })

const app = express()
const port = 3000;

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//setting static files
app.use(express.static('public'));

//body-parser
app.use(bodyParser.urlencoded({ extended: true }))

//method override
app.use(methodOverride('_method'))

//routes
app.use(routes)

//start server listening
app.listen(port, () => {
    console.log(`The server is listening to http://localhost:${port}.`);
});
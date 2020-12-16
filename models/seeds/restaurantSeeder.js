//import mongoose
const mongoose = require('mongoose')
//import restaurant model
const Restaurant = require('../restaurant.js')
//import .json
const restaurantList = require('./restaurant.json')

//connect to mongoDB: MongoClient constructor
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true });
//get DB connection status
const db = mongoose.connection;
//connection error
db.on('error', () => {
    console.log('mongoDB error!!!');
});
//connection succeeds
db.once('open', () => {
    console.log('mongoDB is connected.')
    const restaurants = restaurantList.results
    for (let i = 0; i < restaurantList.results.length; i++) {
        Restaurant.create(restaurantList.results[i])
    }
    console.log('done!!!')
});
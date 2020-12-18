const db = require('../../config/mongoose')
//import restaurant model
const Restaurant = require('../restaurant.js')
//import .json
const restaurantList = require('./restaurant.json')

//connection succeeds
db.once('open', () => {
    for (let i = 0; i < restaurantList.results.length; i++) {
        Restaurant.create(restaurantList.results[i])
    }
    console.log('done!!!')
});
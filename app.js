const express = require('express');
const app = express();
const port = 3000;
//import handlebars template engine
const exphbs = require('express-handlebars');

// const restaurantList = require('./restaurant.json');
//import Restaurant model
const Restaurant = require('./models/restaurant')

//import mongoose
const mongoose = require('mongoose')
//connect to mongoDB: MongoClient constructor
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
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

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//setting static files
app.use(express.static('public'));


app.get('/', (req, res) => {
    Restaurant.find()
            .lean()
            .then(restaurants => res.render('index', { restaurants }))
            .catch(error => console.log(error))
    
})

app.get('/restaurants/:restaurant_id', (req, res) => {
    console.log(req.params.restaurant_id);
    const id = req.params.restaurant_id;
    return Restaurant.findById(id) 
                .lean()
                .then(restaurant => res.render('show', { restaurant }))
                .catch(error => console.log(error))
})

// app.get('/search', (req, res, next) => {
//     console.log(req.query);
//     const keyword = req.query.keyword.trim();
//     if (keyword === "") return res.redirect('/') //without return, it will continue execution, and cause cant set header error
//     const filteredRestaurants = restaurantList.results.filter(restaurant => 
//          restaurant.name.toLowerCase().includes(keyword.toLowerCase()) 
//         || restaurant.category.toLowerCase().includes(keyword.toLowerCase())
//     );
//     if (filteredRestaurants.length === 0) {
//         res.render('none', { keyword: keyword })
//     } else {
//         res.render('index', { restaurants: filteredRestaurants, keyword: keyword })
//     }
// })


//start server listening
app.listen(port, () => {
    console.log(`The server is listening to http://localhost:${port}.`);
});
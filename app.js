const express = require('express');
const app = express();
const port = 3000;
//import handlebars template engine
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser')

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

app.use(bodyParser.urlencoded({ extended: true }))


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

app.get('/search', (req, res, next) => {
    console.log(req.query);
    const keyword = req.query.keyword.trim();
    if (keyword.length === 0) return res.redirect('/') //without return, it will continue execution, and cause can't set header error
    return Restaurant.find()
            .lean()
            .then(restaurants => {
                const filteredRestaurants = restaurants.filter(restaurant => 
                     restaurant.name.toLowerCase().includes(keyword.toLowerCase()) 
                    || restaurant.category.toLowerCase().includes(keyword.toLowerCase())
                );
                if (filteredRestaurants.length === 0) {
                    res.render('none', { keyword: keyword })
                } else {
                    res.render('index', { restaurants: filteredRestaurants, keyword: keyword })
                }
            })
            .catch(error => console.log(error))
})

app.get('/restaurant/new', (req, res) => res.render('new'))

app.post('/restaurant', (req, res) => {
    const newRestaurant = req.body
    return Restaurant.create({
        name: newRestaurant.name,
        name_en: newRestaurant.name_en,
        category: newRestaurant.category,
        image: newRestaurant.image,
        location: newRestaurant.location,
        phone: newRestaurant.phone,
        google_map: newRestaurant.google_map,
        rating: newRestaurant.rating,
        description: newRestaurant.description
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


//start server listening
app.listen(port, () => {
    console.log(`The server is listening to http://localhost:${port}.`);
});
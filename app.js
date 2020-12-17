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
//must be put before GET /restaurants/:id, or new will be viewed as :id
app.get('/restaurants/new', (req, res) => res.render('new')) 

app.post('/restaurants', (req, res) => {
    const newRestaurant = req.body
    for (info in newRestaurant) {
        newRestaurant[info].trim()
    }
    return Restaurant.create(newRestaurant)
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

app.get('/restaurants/:id', (req, res) => {
    const id = req.params.id;
    return Restaurant.findById(id) 
                .lean()
                .then(restaurant => res.render('show', { restaurant }))
                .catch(error => console.log(error))
})

app.get('/search', (req, res, next) => {
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

app.get('/restaurants/:id/edit', (req, res) => {
    const id = req.params.id
    return Restaurant.findById(id)
                .lean()
                .then(restaurant => {
                    const category = restaurant.category;
                    const options = {};
                    options[category] = true //options.category doesn't apply predefined variable, [] works instead
                    console.log(options)
                    res.render('edit', { restaurant, options })
                })
                .catch(error => console.log(error))
})

app.post('/restaurants/:id/edit', (req, res) => {
    const id = req.params.id
    const editedInfo = req.body
    for (info in editedInfo) {
        editedInfo[info].trim() //white spaces seem to be trimmed even without doing so
    }
    return Restaurant.findById(id)
                .then(restaurant => {
                    Object.assign(restaurant, editedInfo)
                    return restaurant.save() 
                })
                .then(restaurant => res.redirect(`/restaurants/${restaurant._id}`))
                .catch(error => console.log(error))    
})

app.post('/restaurants/:id/delete', (req, res) => {
    const id = req.params.id
    return Restaurant.findById(id)
                .then(restaurant => restaurant.remove())
                .then(() => res.redirect('/'))
                .catch(error => console.log(error))
})

//start server listening
app.listen(port, () => {
    console.log(`The server is listening to http://localhost:${port}.`);
});
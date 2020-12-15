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

app.get('/restaurants/:id', (req, res) => {
    console.log(req.params.id);
    const id = req.params.id;
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

app.get('/restaurant/:id/edit', (req, res) => {
    const id = req.params.id
    return Restaurant.findById(id)
                .lean()
                .then(restaurant => {
                    const category = restaurant.category;
                    const options = {
                        middleEast: Boolean(category === '中東餐廳'),
                        italien: Boolean(category === '義式餐廳'),
                        japanese: Boolean(category === '日本料理'),
                        bar: Boolean(category === '酒吧'),
                        cafe: Boolean(category === '咖啡'),
                        thai: Boolean(category === '泰式'),
                        american: Boolean(category === '美式'),
                        french: Boolean(category === '法式'),
                        taiwanese: Boolean(category === '台式')
                    }
                    res.render('edit', { restaurant, options })
                })
                .catch(error => console.log(error))
})

app.post('/restaurant/:id/edit', (req, res) => {
    const id = req.params.id
    const editedInfo = req.body
    return Restaurant.findById(id)
                .then(restaurant => {
                    restaurant.name = editedInfo.name
                    restaurant.name_en = editedInfo.name_en
                    restaurant.category = editedInfo.category
                    restaurant.image = editedInfo.image
                    restaurant.location = editedInfo.location
                    restaurant.phone = editedInfo.phone
                    restaurant.google_map = editedInfo.google_map
                    restaurant.rating = editedInfo.rating
                    restaurant.description = editedInfo.description
                    return restaurant.save() 
                })
                .then(restaurant => res.redirect(`/restaurants/${restaurant._id}`))
                .catch(error => console.log(error))    
})

app.post('/restaurant/:id/delete')

//start server listening
app.listen(port, () => {
    console.log(`The server is listening to http://localhost:${port}.`);
});
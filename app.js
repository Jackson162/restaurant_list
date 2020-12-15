const express = require('express');
const app = express();
const port = 3000;
//import handlebars template engine
const exphbs = require('express-handlebars');

const restaurantList = require('./restaurant.json');

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//setting static files
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.render('index', { restaurants: restaurantList.results })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
    console.log(req.params.restaurant_id);
    const id = req.params.restaurant_id;
    const restaurant_info = restaurantList.results.find(restaurant => restaurant.id.toString() === id);
    res.render('show', { restaurant:  restaurant_info });
})

app.get('/search', (req, res, next) => {
    console.log(req.query);
    const keyword = req.query.keyword.trim();
    if (keyword === "") return res.redirect('/') //without return, it will continue execution, and cause cant set header error
    const filteredRestaurants = restaurantList.results.filter(restaurant => 
         restaurant.name.toLowerCase().includes(keyword.toLowerCase()) 
        || restaurant.category.toLowerCase().includes(keyword.toLowerCase())
    );
    if (filteredRestaurants.length === 0) {
        res.render('none', { keyword: keyword })
    } else {
        res.render('index', { restaurants: filteredRestaurants, keyword: keyword })
    }
})


//start server listening
app.listen(port, () => {
    console.log(`The server is listening to http://localhost:${port}.`);
});
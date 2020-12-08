const express = require('express');
const app = express();
const port = 3000;
//import handlebars template engine
const exphbs = require('express-handlebars');

const restaurantList = require('./restaurant.json');

//function
//enable searching with both mandarin and English
const stringToRegExp = (string) => {
    let regExpStr = ''
    for (i=0; i < string.length; i++) {
        const unicodeLength = string.codePointAt(i).toString(16).length;
        if (unicodeLength === 0) {
            regExpStr +=  `\\u{0000}`;
        } else if (unicodeLength === 1) {
            regExpStr +=  `\\u{000${unicode}}`;
        } else if (unicodeLength === 2) {
            regExpStr +=  `\\u{00${unicode}}`;
        } else if (unicodeLength === 3) {
            regExpStr +=  `\\u{0${unicode}}`;
        } else if (unicodeLength > 3) {
            regExpStr +=  `\\u{${unicode}}`;
        } 
    }
    return new RegExp(regExpStr, 'gui');
}

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
    const userInput = req.query.keyword.trim();
    const keyword = stringToRegExp(userInput);
    console.log(keyword) 
    const filteredRestaurants = restaurantList.results.filter(restaurant => keyword.test(restaurant.name));
    if (filteredRestaurants.length === 0) {
        res.render('none', { keyword: req.query.keyword })
    } else {
        res.render('index', { restaurants: filteredRestaurants, keyword: userInput })
    }
})


//start server listening
app.listen(port, () => {
    console.log(`The server is listening to http://localhost/${port}`);
});
const express = require('express');
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/', (req, res, next) => {
    const keyword = req.query.keyword.trim();
    console.log(keyword) 
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

module.exports = router
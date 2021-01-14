const express = require('express');
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/', (req, res, next) => {
  try {
    const userId = req.user._id
    const keyword = req.query.keyword.trim();
    req.session.keyword = keyword
    console.log(keyword) 
    if (keyword.length === 0) return res.redirect('/') //without return, it will continue execution, and cause 'can't set header error'
    return Restaurant.find({ userId })
            .lean('-createdAt')
            .then(restaurants => {
                const filteredRestaurants = restaurants.filter(restaurant => 
                     restaurant.name.toLowerCase().includes(keyword.toLowerCase()) 
                    || restaurant.category.toLowerCase().includes(keyword.toLowerCase())
                    || restaurant.name_en.toLowerCase().includes(keyword.toLowerCase())
                )
                if (filteredRestaurants.length === 0) {
                    res.render('none', { keyword: keyword })
                } else {
                    res.render('index', { restaurants: filteredRestaurants, keyword })
                }
            })
            .catch(err => {
              console.error(err)
              res.render('error')
            })
  } catch(err) {
    console.error(err)
    res.render('error')
  }
})

module.exports = router
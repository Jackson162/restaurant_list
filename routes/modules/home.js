const express = require('express');
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
    try {
      const userId = req.user._id
      const sortOption = '-createdAt'
      Restaurant.find({ userId })
        .lean()
        .sort(sortOption)
        .then(restaurants => res.render('index', { restaurants, sortOption }))
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
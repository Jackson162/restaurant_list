const express = require('express');
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
    const sortOption = req.query.sort
    Restaurant.find()
        .lean()
        .sort(sortOption)
        .then(restaurants => res.render('index', { restaurants, sortOption }))
        .catch(error => console.log(error))
})

module.exports = router
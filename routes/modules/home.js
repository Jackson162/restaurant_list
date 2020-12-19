const express = require('express');
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
    // Restaurant.find()
    //     .lean()
    //     .sort({ name_en: 'asc' })
    //     .then(restaurants => res.render('index', { restaurants }))
    //     .catch(error => console.log(error))
    res.redirect('/sort?sort=name_en')
})

module.exports = router
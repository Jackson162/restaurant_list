const express = require('express');
const router = express.Router()
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const search = require('./modules/search')
const sort = require('./modules/sort')

router.use('/', home)
router.use('/search', search)
router.use('/sort', sort)
router.use('/restaurants', restaurants)

module.exports = router
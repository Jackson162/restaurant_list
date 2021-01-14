const express = require('express');
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  try {
    const userId = req.user._id
    const sortOption = req.query.sort
    let keyword = req.session.keyword
    if (keyword === '') keyword = undefined //RegExp [] err if empty string
    const keywordRegExp = new RegExp(`.*[${keyword}].*`, 'iy')//if use string in condition means filter with 100% match
    const conditionArray = [{ userId, name: keywordRegExp }, { userId, category: keywordRegExp }, { userId, name_en: keywordRegExp }]
    if (!keyword) {
      conditionArray.push({ userId })
    }
    console.log('keyword:', keyword)
    Restaurant.find() // if use OR do not pass arg
        .or(conditionArray)
        .lean()
        .sort(sortOption)
        .then(restaurants => {
          if (!keyword) {
            return res.render('index', { restaurants, sortOption }) //do not pass keyword 
          } else if (keyword && restaurants.length === 0) {
            return res.render('none', { keyword })
          }
          return res.render('index', { restaurants, sortOption, keyword })
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
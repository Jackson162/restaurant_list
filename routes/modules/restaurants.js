const express = require('express');
const router = express.Router()
const Restaurant = require('../../models/restaurant')

//must be put before GET /:id, or new will be viewed as :id
router.get('/new', (req, res) => res.render('new')) 

router.post('/', (req, res) => {
  try {
    const userId = req.user._id
    const newRestaurant = req.body
    for (info in newRestaurant) {
        newRestaurant[info].trim()
    }
    return Restaurant.create({ ...newRestaurant, userId })
        .then(() => res.redirect('/'))
        .catch(err => {
          console.error(err)
          res.render('error')
        })
  } catch(err) {
    console.error(err)
    res.render('error')
  }
})

router.get('/:id', (req, res) => {
  try {
    const userId = req.user._id
    const _id = req.params.id;
    return Restaurant.findOne({ _id, userId }) 
                .lean()
                .then(restaurant => {
                  const createdTime = restaurant.createdAt
                  const createdDate = `${createdTime.getFullYear()}-${createdTime.getMonth() + 1}-${createdTime.getDate()}`
                  console.log(createdDate)
                  res.render('show', { restaurant, createdDate})
                })
                .catch(err => {
                  console.error(err)
                  res.render('error')
                })
  } catch {
    console.error(err)
    res.render('error')
  }
})

router.get('/:id/edit', (req, res) => {
    try {
      const userId = req.user._id
      const _id = req.params.id;
      return Restaurant.findOne({ _id, userId })
                  .lean()
                  .then(restaurant => {
                      const category = restaurant.category;
                      const options = {};
                      options[category] = true //to use variable as key, using computed property
                      res.render('edit', { restaurant, options })
                  })
                  .catch(err => {
                    console.error(err)
                    res.render('error')
                  })
    } catch {
      res.render('error')
    }
})

router.put('/:id', (req, res) => {
  try {
    const userId = req.user._id
    const _id = req.params.id;
    const editedInfo = req.body
    for (info in editedInfo) {
        editedInfo[info].trim() //white spaces seem to be trimmed even without doing so
    }
    return Restaurant.findOne({ _id, userId })
                .then(restaurant => {
                    restaurant = Object.assign(restaurant, editedInfo)
                    return restaurant.save() 
                })
                .then(restaurant => res.redirect(`/restaurants/${restaurant._id}`))
                .catch(err => {
                  console.error(err)
                  res.render('error')
                })
  } catch(err) {
    console.error(err)
    res.render('error')
  }  
})

router.delete('/:id', (req, res) => {
  try {
    const userId = req.user._id
    const _id = req.params.id;
    return Restaurant.findOne({ _id, userId })
                .then(restaurant => restaurant.remove())
                .then(() => res.redirect('/'))
                .catch(err => {
                  console.error(err)
                  res.render('error')
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
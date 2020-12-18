const express = require('express');
const router = express.Router()
const Restaurant = require('../../models/restaurant')

//must be put before GET /:id, or new will be viewed as :id
router.get('/new', (req, res) => res.render('new')) 

router.post('/', (req, res) => {
    const newRestaurant = req.body
    for (info in newRestaurant) {
        newRestaurant[info].trim()
    }
    return Restaurant.create(newRestaurant)
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    return Restaurant.findById(id) 
                .lean()
                .then(restaurant => res.render('show', { restaurant }))
                .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
    const id = req.params.id
    return Restaurant.findById(id)
                .lean()
                .then(restaurant => {
                    const category = restaurant.category;
                    const options = {};
                    options[category] = true //options.category doesn't routerly predefined variable, [] works instead
                    res.render('edit', { restaurant, options })
                })
                .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
    const id = req.params.id
    const editedInfo = req.body
    for (info in editedInfo) {
        editedInfo[info].trim() //white spaces seem to be trimmed even without doing so
    }
    return Restaurant.findById(id)
                .then(restaurant => {
                    let spreadRes = {...restaurant}
                    console.log('spreadRes: ', spreadRes)
                    console.log('restaurant: ', restaurant)
                    console.log('editedInfo: ', editedInfo)
                    restaurant = Object.assign(restaurant, editedInfo)
                    console.log('Object.assign: ', restaurant)
                    return restaurant.save() 
                })
                .then(restaurant => res.redirect(`/restaurants/${restaurant._id}`))
                .catch(error => console.log(error))    
})

router.delete('/:id', (req, res) => {
    const id = req.params.id
    return Restaurant.findById(id)
                .then(restaurant => restaurant.remove())
                .then(() => res.redirect('/'))
                .catch(error => console.log(error))
})

module.exports = router
const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')
//import restaurant model
const Restaurant = require('../restaurant.js')
const User = require('../user.js')
//import .json
const restaurantList = require('./restaurant.json').results
const fakeUsers = [
  {
    email: 'user1@example.com',
    password: '12345678'
  },
  {
    email: 'user2@example.com',
    password: '12345678'
  }
]



//connection succeeds
db.once('open', async () => {
    const promiseArray = []
    for (i = 0; i < fakeUsers.length; i++) {
      await bcrypt
        .genSalt(10)
        .then(salt => {
          return bcrypt.hash(fakeUsers[i].password, salt)
        })
        .then(hash => User.create({ 
            email: fakeUsers[i].email,
            password: hash
          }))
        .then(user => {
          const userId = user._id
          for (j = 0; j < 3; j++) {
            if (i === 1) j += 3
            promiseArray.push(Restaurant.create({...restaurantList[j], userId}))
            if (i === 1) j -= 3 
          }
          console.log('restaurant-loop ends')
        })
    }

    Promise.all(promiseArray)
      .then(() => {
        console.log('done!!!')
        process.exit()
      })
})
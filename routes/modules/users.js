const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const Restaurant = require('../../models/restaurant')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res) => {
  res.send('POST /users/login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  if (password !== confirmPassword) return res.send('password does not match')


  //check whether email is registered
  User.findOne({ email })
    .then(user => {
      if (user) {
        console.log('email is registered.')
        res.render('register', {
          name,
          email,
          password,
          confirmPassword
        })
      } else {
          return User.create({
            name,
            email,
            password
          }).then(() => res.redirect('/'))
            .catch(err => console.log(err))
      }
    })
})

router.post('/logout', (req, res) => {
  res.send('POST users/logout')
})



module.exports = router
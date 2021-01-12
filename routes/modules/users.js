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
  res.send('POST users/register')
})

router.post('/logout', (req, res) => {
  res.send('POST users/logout')
})



module.exports = router
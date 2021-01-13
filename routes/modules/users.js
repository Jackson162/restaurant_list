const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../../models/user')
const authenticatedLogin = require('../../utils/authenticatedLogin')


router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', authenticatedLogin)

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) errors.push({ message: '所有欄位都是必填的'})
  if (password !== confirmPassword) errors.push({ message: '密碼與確認密碼不相符' })
  if (errors.length) return res.render('register', { name, email, password, confirmPassword, errors })

  //check whether email is registered
  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push({ message:'此信箱已被使用' })
        return res.render('register', {
          errors,
          name,
          email,
          password,
          confirmPassword
        })
      } 
      bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
            name,
            email,
            password: hash
        }))
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
    })
})

router.post('/logout', (req, res) => {
 req.logout()
 req.flash('success_msg', '成功登出')
 res.redirect('/users/login')
})



module.exports = router
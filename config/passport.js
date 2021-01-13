const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/user')

module.exports = app => {
  //初始化passport模組
  app.use(passport.initialize())
  app.use(passport.session())
  //設定本地登入策略
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
      const userInput = { email, password }
      User.findOne({ email })
        .then(user => {
          if (!user) {
            return done(null, false, { login_error: 'Unregistered email', userInput })
          }

          return bcrypt.compare(password, user.password).then(isMatch => {
            if(!isMatch) return done(null, false, { login_error: 'Incorrect password or email.', userInput })
            return done(null, user)
          })
          // if (user.password !== password) {
          //   return done(null, false, { login_error: 'Incorrect password or email.', userInput })
          // }
          // return done(null, user)
        })
        .catch(err => done(err, false))
    }
  ))
  //設定序列化與反序列化
  passport.serializeUser((user, done) => done(null, user._id))

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, false))
  })
}
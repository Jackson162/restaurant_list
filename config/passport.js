const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
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
            return done(null, false, { login_error: '此信箱未註冊。', userInput })
          }

          return bcrypt.compare(password, user.password).then(isMatch => {
            if(!isMatch) return done(null, false, { login_error: '信箱或密碼錯誤。', userInput })
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

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const { email, name } = profile._json
    User.findOne({ email }) //add name in case someone used this email to register
      .then(user => {
        if (user) {
          if (!(user.name === name)) return done(null, false, 
            { message: `用來註冊此信箱之名字與你臉書名字不符。請問你是\"${user.name}\"嗎?` })
          return done(null, user)
        }
        const randomPassword = Math.random().toString(36).slice(-8)
        return bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            email,
            name,
            password: hash
          }))
          .then(user => done(null, user)) //log-in automatically
          .catch(err => done(err, false))
      })

  }))

  //設定序列化與反序列化
  passport.serializeUser((user, done) => done(null, user._id))

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, false))
  })
}
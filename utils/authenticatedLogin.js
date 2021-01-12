const passport = require('passport')

module.exports = (req, res, next) => {
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) {
      console.log(info)
      let { userInput, login_error } = info //info is data sent by third argument of done
      if (!login_error) login_error = info.message //if user input is empty, it will return a message
      return res.render('login', { userInput, login_error })
    }
    console.log(user)
    req.logIn(user, function(err) {
      if (err) return next(err)
      return res.redirect('/')
    })
  })(req, res, next)
}
const passport = require('passport')

module.exports = (req, res, next) => {
  try {
    passport.authenticate('local', function(err, user, info) {
      if (err) return next(err);
      if (!user) {
        let { userInput, login_error } = info //info is data sent by third argument of done
        if (!login_error) login_error = ['請輸入帳密']
        return res.render('login', { userInput, login_error })
      }
      console.log('/utils/authenticatedLogin_user: ', user)
      
      req.logIn(user, function(err) {
        if (err) return next(err)
        return res.redirect('/')
      })
    })(req, res, next)
  } catch(err) {
    console.error(err)
    res.render('error')
  }
}
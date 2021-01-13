const express = require('express')
//import handlebars template engine
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const helpers = require('handlebars-helpers')() //在template使用
const session = require('express-session')
const flash = require('connect-flash')

const usePassport = require('./config/passport')

//import Restaurant model
const routes = require('./routes') // /index.js (default looking for it)
require('./config/mongoose')

const app = express()
const port = 3000;

//setting template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');

//setting static files
app.use(express.static('public'));

//body-parser
app.use(bodyParser.urlencoded({ extended: true }))

//method override
app.use(methodOverride('_method'))

app.use(session({
  secret: 'JacksonSecret',
  resave: false,
  saveUninitialized: false
}))

usePassport(app)

app.use(flash())

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.success_msg = req.flash('success_msg')
  next()
})

//routes
app.use(routes)

//start server listening
app.listen(port, () => {
    console.log(`The server is listening to http://localhost:${port}.`);
});
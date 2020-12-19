const express = require('express')
//import handlebars template engine
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const helpers = require('handlebars-helpers')()


//import Restaurant model
const routes = require('./routes') // /index.js (default looking for it)
require('./config/mongoose')

const app = express()
const port = 3000;

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//setting static files
app.use(express.static('public'));

//body-parser
app.use(bodyParser.urlencoded({ extended: true }))

//method override
app.use(methodOverride('_method'))

//routes
app.use(routes)

//start server listening
app.listen(port, () => {
    console.log(`The server is listening to http://localhost:${port}.`);
});
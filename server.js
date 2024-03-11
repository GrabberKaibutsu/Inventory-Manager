require('dotenv').config()
const path = require('path')
const express = require('express')
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const methodOverride = require('method-override') 
const morgan = require('morgan')
const session = require('express-session')
const PORT = process.env.PORT || 5000
const proCtrl = require('./controllers/productController')
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

  app.use('/', proCtrl)

app.listen(PORT, () => {
    console.log('Open on port', PORT)
})
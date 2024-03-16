require('dotenv').config()
const path = require('path')
const express = require('express')
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const methodOverride = require('method-override') 
const morgan = require('morgan')
const session = require('express-session')


const PORT = process.env.PORT || 5000

const db = require('./models');

const proCtrl = require('./controllers/productController')
const userCtrl = require('./controllers/userController')
const sessionCtrl = require('./controllers/sessionController')


const app = express();



if (process.env.ON_HEROKU === 'false') {
  const liveReloadServer = livereload.createServer();
  liveReloadServer.server.once("connection", () => {
      setTimeout(() => {
      liveReloadServer.refresh("/");
      }, 100);
  });
  app.use(connectLiveReload());
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.static('public'))

app.use(connectLiveReload());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(methodOverride('_method'));
app.use(morgan('tiny')) 

app.get('/', function (req, res) {
  res.redirect('/Main')
});


 app.use('/main', proCtrl)
 app.use('/users', userCtrl)
 app.use('/sessions', sessionCtrl) 


app.get('*', function (req, res) {
    res.render('404')
});

app.listen(PORT, () => {
    console.log('Open on port', PORT)
})
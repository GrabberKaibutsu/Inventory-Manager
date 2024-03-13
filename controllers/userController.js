const router = require('express').Router()
const db = require('../models')
const bcrypt = require('bcrypt');

router.get('/new', (req, res) => {
    res.render('users/new')
})

router.post('/', async (req, res) => {
    console.log(req.session);
    req.body.user = req.session.currentUser._id;
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    const newUser = await db.User.create(req.body) 
    console.log(newUser)
    res.redirect('/')
})  

module.exports = router
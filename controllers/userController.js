const router = require('express').Router()
const db = require('../models')
const bcrypt = require('bcrypt');

router.get('/signup', (req, res) => {
    res.render('users/newUser.ejs')
})


router.post('/', async (req, res) => {
    console.log(req.body)
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    const newUser = await db.User.create(req.body)
    console.log(newUser)
    res.redirect('/')
})  

module.exports = router
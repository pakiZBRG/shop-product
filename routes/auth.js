const express = require("express");
const bcrypt = require('bcryptjs');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const { loginValidation } = require('../Validation');
const User = require("../models/User");

// Authenticate an user
router.post('/', async (req, res) => {
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).json({msg: error.details[0].message});

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).json({msg: 'No user with given email'});

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).json({msg: "Wrong Password"});

    jwt.sign(
        {id: user.id},
        config.get('jwtSecret'),
        {expiresIn: 3600},
        (err, token) => {
            if(err) throw err;
            res.status(201).json({
                token,
                user: {
                    _id: user.id,
                    name: user.name,
                    email: user.email
                }
            })
        }
    )
});

// Get data of user - Private
router.get('/user', checkAuth, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user))
})

module.exports = router;
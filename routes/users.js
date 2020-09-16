const express = require("express");
const bcrypt = require('bcryptjs');
const router = express.Router();
const config = require('config');
const jwt = require('jsonwebtoken');
const { registerValidation } = require('../Validation');
const User = require("../models/User");

// Create an User
router.post('/', async (req, res) => {
    const {error} = registerValidation(req.body)
    if(error) return res.status(400).json({msg: error.details[0].message});

    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).json({msg: 'Email exists. Try another one'});

    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })
    user.save()
        .then(user => {
            jwt.sign(
                {id: user.id},
                config.get('jwtSecret'),
                {expiresIn: 3600},
                (err, token) => {
                    if(err) throw err;
                    res.status(201).json({
                        message: "User Created",
                        token,
                        user: {
                            _id: user.id,
                            name: user.name,
                            email: user.email
                        }
                    })
                }
            )
        })
        .catch(err => res.status(500).json({error: err}))
})

module.exports = router;
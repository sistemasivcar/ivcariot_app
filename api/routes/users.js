const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import UserModel from '../models/user';
import asyncMiddleware from '../middleware/async.js'
const router = express.Router();

// LOGIN
router.post('/login', async (req, res) => {

    const password = req.body.password;
    const email = req.body.email;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
        const toSend = {
            status: 'error',
            message: 'Invalid credentials'
        }

        return res.status(401).json(toSend);
    }
    // email and password are valids
    if (bcrypt.compareSync(password, user.password)) {

        user.set('password', undefined, { strict: false });

        const token = jwt.sign({ userData: user }, 'securePasswordHere', { expiresIn: 60 * 60 * 24 * 30 });

        const toSend = {
            status: 'success',
            token: token,
            userData: user
        };
        return res.status(200).json(toSend);


    } else {
        const toSend = {
            status: 'error',
            message: 'Invalid credentials'
        }

        return res.status(401).json(toSend);
    }


});

// REGISTER
router.post('/register', asyncMiddleware(async (req, res) => {

    const password = req.body.password;
    const name = req.body.name;
    const email = req.body.email;

    const encryptedPassword = bcrypt.hashSync(password, 10);

    const newUser = {
        name,
        email,
        password: encryptedPassword
    };
    const user = await UserModel.create(newUser)
    const toSend = {
        status: 'success'
    }
    res.status(200).json(toSend);

}));


module.exports = router;
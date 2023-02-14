const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import UserModel from '../models/user';
import EmqxAuthRule from '../models/emqx_auth';
import checkAuth from '../middleware/auth';
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

//GET MQTT CREDENTIALS
router.post('/getmqttcredentials', checkAuth, asyncMiddleware(async (req, res) => {
    
    const userId = req.userData._id;
    const credentials = await getWebUserMqttCredentials(userId);
    const toSend = {
        status: 'success',
        username: credentials.username,
        password:credentials.password,
    }    
    
    res.json(toSend);

    setTimeout(() => {
        getWebUserMqttCredentials(userId)
    },7000)
    
    return;

}));

router.post('/getmqttcredentialsforreconnection', checkAuth,asyncMiddleware(async (req, res) => {
    
    const userId = req.userData._id;
    const credentials = await getWebUserMqttCredentialsForReconnection(userId);
    if (credentials==false) {
        throw new Error('fail to get credentials')
    }

    const toSend = {
        status: 'success',
        username: credentials.username,
        password:credentials.password
    }
    res.status(200).json(toSend);

    setTimeout(() => {
        getWebUserMqttCredentials(userId);
    },30000)

    
}))

// mqtt credentials types: "user", "device", "superuser"

async function getWebUserMqttCredentials(userId) {

    try {
        var rule = await EmqxAuthRule.find({ type: "user", userId: userId });

        if (rule.length == 0) {

            const newRule = {
                userId: userId,
                username: makeid(10),
                password: makeid(10),
                publish: [userId + "/#"],
                subscribe: [userId + "/#"],
                type: "user",
                createdTime: Date.now(),
                updatedTime: Date.now()
            }

            const result = await EmqxAuthRule.create(newRule);

            const toReturn = {
                username: result.username,
                password: result.password
            }

            return toReturn;

        }

        const newusername = makeid(10);
        const newpassword = makeid(10);

        const result = await EmqxAuthRule.updateOne({ type: "user", userId: userId }, { $set: { username: newusername, password: newpassword, updatedTime: Date.now() } });

        if (result.n == 1 && result.ok == 1) {
            return {
                username: newusername,
                password: newpassword
            }
        }
        return false;
        

    } catch (error) {
        return false;
    }

}

async function getWebUserMqttCredentialsForReconnection(userId) {
    
    try {
        const credentials = await EmqxAuthRule.findOne({ type: 'user', userId: userId });
        if (!credentials) return false;

        return {
            username: credentials.username,
            password:credentials.password
        }
    } catch (e) {
        return false
    }
}
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


module.exports = router;
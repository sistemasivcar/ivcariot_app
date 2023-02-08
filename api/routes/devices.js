const express = require('express');
import checAuth from '../middleware/auth.js';
import asyncMiddleware from '../middleware/async';
import axios from 'axios'

/*
 ___  ______________ _____ _      _____ 
|  \/  |  _  |  _  \  ___| |    /  ___|
| .  . | | | | | | | |__ | |    \ `--. 
| |\/| | | | | | | |  __|| |     `--. \
| |  | \ \_/ / |/ /| |___| |____/\__/ /
\_|  |_/\___/|___/ \____/\_____/\____/  
*/

import DeviceModel from '../models/device';
import SaverRuleModel from '../models/emqx_saver_rule';
const auth = {
    auth: {
        username: 'admin',
        password: process.env.EMQX_MANAGMENT_PASSWORD
    }
};

const router = express.Router();

/* 
  ___  ______ _____ 
 / _ \ | ___ \_   _|
/ /_\ \| |_/ / | |  
|  _  ||  __/  | |  
| | | || |    _| |_ 
\_| |_/\_|    \___/ 
*/

router.get('/', checAuth, asyncMiddleware(async (req, res) => {
    const userId = req.userData._id;

    const devices = await DeviceModel.find({ userId: userId });
    const toSend = {
        status: 'success',
        data: devices,
    }
    res.status(200).json(toSend)

}));

router.post('/', checAuth, asyncMiddleware(async (req, res) => {

    const userId = req.userData._id;
    let newDevice = req.body.newDevice;

    newDevice.userId = userId;
    newDevice.createdTime = Date.now()

    const device = await DeviceModel.create(newDevice);

    const toSend = {
        status: "success"
    }

    selectDevice(userId, newDevice.dId);
    return res.status(200).json(toSend);

}));

router.put('/', checAuth, asyncMiddleware( (req, res) => {

    const userId = req.userData._id;
    const dId = req.body.dId;
    
    console.log(dId);

    if ( selectDevice(userId, dId)) {
        const toSend = {
            status: "success"
        };

        return res.json(toSend);
    } 
    const toSend = {
        status: "error"
    }
    
    return res.json(toSend);


}));

router.delete('/', checAuth, asyncMiddleware(async (req, res) => {


    const dId = req.query.dId;
    const result = await DeviceModel.deleteOne({ dId: dId });

    if (result.n == 0) {
        const toSend = {
            status: "error",
            data: "Device not found"
        };

        return res.status(404).json(toSend);
    }

    const toSend = {
        status: "success",
        data: result
    };
    console.log('success')
    return res.status(200).json(toSend);

}));
module.exports = router;

/* 
______ _   _ _   _ _____ _____ _____ _____ _   _  _____ 
|  ___| | | | \ | /  __ \_   _|_   _|  _  | \ | |/  ___|
| |_  | | | |  \| | /  \/ | |   | | | | | |  \| |\ `--. 
|  _| | | | | . ` | |     | |   | | | | | | . ` | `--. \
| |   | |_| | |\  | \__/\ | |  _| |_\ \_/ / |\  |/\__/ /
\_|    \___/\_| \_/\____/ \_/  \___/ \___/\_| \_/\____/  
*/

async function selectDevice(userId, dId) {
    try {
        await DeviceModel.updateMany(
            { userId: userId },
            { selected: false }
        );

        await DeviceModel.updateOne(
            { dId: dId, userId: userId },
            { selected: true }
        );

        return true;

    } catch (error) {
        console.log("ERROR IN 'selectDevice' FUNCTION ");
        console.log(error);
        return false;
    }
}

/* 
SAVER RULES FUNCTIONS
*/

setTimeout(() => {
    createSaverRule("121212", "11111", false);
}, 2000);

// get a rule

// create a rule 
async function createSaverRule(userId, dId, status) {
    try {
        const url = "http://localhost:8085/api/v4/rules";

        const topic = userId + "/" + dId + "/+/sdata";

        const rawsql = "SELECT topic, payload FROM \"" + topic + "\" WHERE payload.save = 1";

        var newRule = {
            rawsql: rawsql,
            actions: [
                {
                    name: "data_to_webserver",
                    params: {
                        $resource: global.saverResource.id,
                        payload_tmpl: '{"payload":${payload},"topic":"${topic}"}'
                    }
                }
            ],
            description: "SAVER-RULE",
            enabled: status
        };

        //save rule in emqx - grabamos la regla en emqx
        const res = await axios.post(url, newRule, auth);

        if (res.status === 200 && res.data.data) {
            console.log(res.data.data);

        }
    } catch (e) {
        
    } 
}
//update a rule

// delete a rule
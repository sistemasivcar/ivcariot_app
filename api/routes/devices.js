const express = require('express');
import checAuth from '../middleware/auth.js';
import asyncMiddleware from '../middleware/async';


/*
 ___  ______________ _____ _      _____ 
|  \/  |  _  |  _  \  ___| |    /  ___|
| .  . | | | | | | | |__ | |    \ `--. 
| |\/| | | | | | | |  __|| |     `--. \
| |  | \ \_/ / |/ /| |___| |____/\__/ /
\_|  |_/\___/|___/ \____/\_____/\____/  
*/

import DeviceModel from '../models/device';


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

// get a rule

// create a rule 

//update a rule

// delete a rule
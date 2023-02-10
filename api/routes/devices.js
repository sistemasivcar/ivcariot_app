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

    const devices = await DeviceModel.find({ userId: userId }).populate('saverRule', 'emqxRuleId status').populate('templateId','widgets');
    const toSend = {
        status: 'success',
        data: devices,
    }
    res.status(200).json(toSend)

}));

router.post('/', checAuth, asyncMiddleware(async (req, res) => {

    const userId = req.userData._id;
    const newDevice = req.body.newDevice;

    const createdTime = Date.now()
    const device = await DeviceModel.create({ ...newDevice, userId, createdTime });
    
    const saverRuleBack = await createSaverRule(userId, newDevice.dId, true);
    const saverRule = saverRuleBack._id
    await DeviceModel.updateOne({ dId: newDevice.dId }, { saverRule: saverRule });

    await selectDevice(userId, newDevice.dId);
    const toSend = {
        status: "success",
        data: device
    }

    return res.status(200).json(toSend);

}));

router.put('/', checAuth, asyncMiddleware(async (req, res) => {

    const userId = req.userData._id;
    const dId = req.body.dId;

    const result = await selectDevice(userId, dId);

    if (result) {
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

router.put('/saver-rule', asyncMiddleware(async (req, res) => {
    const status = req.body.status;
    const emqxRuleId = req.body.emqxRuleId;
    // await SaverRuleModel.updateOne({ dId: dId }, { status: status });
    const resp = await updateSaverRule(emqxRuleId, status);

    const toSend = {
        status: 'success',
    };
    return res.status(200).json(toSend);

}))

router.delete('/', checAuth, asyncMiddleware(async (req, res) => {

    const dId = req.query.dId;

    await deleteSaverRule(dId);
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
            { dId: dId },
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

// get saver rules for a user (deprecated)
async function getSaverRules(userId) {
    try {
        const rules = await SaverRuleModel.find({ userId: userId });
        return rules;
    } catch (e) {
        console.log("ERROR GETTING RULES");
        return false;
    }
}

// create a rule 
async function createSaverRule(userId, dId, status) {
    try {
        const url = `http://localhost:${process.env.EMQX_MANAGMENT_PORT}/api/v4/rules`;
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
        const res = await axios.post(url, newRule, auth);
       
        if (res.status === 200 && res.data.data) {

            const saverRule = await SaverRuleModel.create({
                dId: dId,
                emqxRuleId: res.data.data.id,
                status: status
            });

            return saverRule;

        } else {
            return false;
        }

    } catch (error) {
        console.log("Error creating saver rule")
        console.log(error);
        return false;
    }
}

//update a rule

async function updateSaverRule(emqxRuleId, status) {
    try {
        const url = `http://localhost:${process.env.EMQX_MANAGMENT_PORT}/api/v4/rules/${emqxRuleId}`;
        const newRule = {
            enabled: status
        };

        const res = await axios.put(url, newRule, auth);
        if (res.status === 200 && res.data.data) {
            await SaverRuleModel.updateOne({ emqxRuleId: emqxRuleId }, { status: status });
            console.log("Saver rule updated success".green);

            return true;
        }
    } catch (e) {
        console.log('error update rule')
        return false;
    }
}

// delete a rule

async function deleteSaverRule(dId) {

    try {
        const mongoRule = await SaverRuleModel.findOne({ dId: dId });

        const url = `http://localhost:${process.env.EMQX_MANAGMENT_PORT}/api/v4/rules/${mongoRule.emqxRuleId}`

        await SaverRuleModel.deleteOne({ dId: dId });
        await axios.delete(url, auth);

        return true;
    } catch (e) {
        console.log(e)
        console.log("error deleting saver rule")
        return false;

    }

}
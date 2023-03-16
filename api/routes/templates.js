import { Router } from "express";
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

import templateModel from '../models/template.js';
import DeviceModel from '../models/device';
import NotificationModel from '../models/notification';
import EmqxAuthModel from '../models/emqx_auth';
import AlarmRuleModel from '../models/emqx_alarm_rule.js';
import SaverRuleModel from '../models/emqx_saver_rule';

/* 
  ___  ______ _____ 
 / _ \ | ___ \_   _|
/ /_\ \| |_/ / | |  
|  _  ||  __/  | |  
| | | || |    _| |_ 
\_| |_/\_|    \___/ 
*/
const router = Router();

router.get('/', checAuth, asyncMiddleware(async (req, res) => {
    const userId = req.userData._id;
    const publics = req.userData.config.usePublicTemplates;
    console.log(publics)

    const userTemplates = await templateModel.find({ userId: userId });
    var toSend = {
        status: 'success',
        data: userTemplates
    }

    if (!publics) return res.status(200).json(toSend);
    const publicTemplates = await templateModel.find({ isPublic: true });

    //merge userTemplates and publicTemplates without repeted tempaltes in the final array
    userTemplates.forEach((userTemp, i) => {
        publicTemplates.forEach((pubTemp, j) => {
            if (pubTemp.userId == userTemp.userId) {
                publicTemplates.splice(j, 1)
            }
        })
    })

    toSend = {
        status: 'success',
        data: [...userTemplates, ...publicTemplates]
    }

    return res.status(200).json(toSend);
}))

router.get('/:id', checAuth, asyncMiddleware(async (req, res) => {
    const userId = req.userData._id;
    console.log(req.params)

    const templates = await templateModel.findOne({ userId: userId, _id: req.params.id });
    const toSend = {
        status: 'success',
        data: templates
    }

    res.status(200).json(toSend);
}))

router.post('/', checAuth, asyncMiddleware(async (req, res) => {
    const userId = req.userData._id;
    const createdTime = Date.now();
    const template = await templateModel.create({ ...req.body.template, userId, createdTime });
    const toSend = {
        status: 'success',
        data: template,
    };
    res.status(200).json(toSend);

}))

router.put('/', checAuth, asyncMiddleware(async (req, res) => {
    const userId = req.userData._id;
    const template = req.body.template
    if (template.widgets) {
        await templateModel.updateOne({ userId, _id: template.id }, { widgets: template.widgets });
        return res.json({ status: 'success' })
    }

    await templateModel.updateOne({ userId, _id: template.id }, { isPublic: template.isPublic });
    return res.json({ status: 'success' })



}))

router.delete('/', checAuth, asyncMiddleware(async (req, res) => {

    const templateId = req.query._id;
    const userId = req.userData._id;

    // por si la plantilla es publica y la están usando 
    // otros dispositivos, los elimino a todos

    const devices = await DeviceModel.find({ templateId })

    asyncForEach(devices, async device => {

        await deleteMqttDeviceCredentials(device.dId)

        await deleteAllAlarmRules(userId, device.dId);

        await deleteSaverRule(device.dId);

        NotificationModel.deleteMany({ dId: device.dId });

        await DeviceModel.deleteOne({ dId: device.dId })

    });

    const result = await templateModel.deleteOne({ _id: templateId });

    if (result.n == 0) {
        const toSend = {
            status: "error",
            data: "Template not found"
        };

        return res.status(404).json(toSend);
    }

    const toSend = {
        status: "success",
    };
    return res.status(200).json(toSend);

}))
module.exports = router;

/* 
______ _   _ _   _ _____ _____ _____ _____ _   _  _____ 
|  ___| | | | \ | /  __ \_   _|_   _|  _  | \ | |/  ___|
| |_  | | | |  \| | /  \/ | |   | | | | | |  \| |\ `--. 
|  _| | | | | . ` | |     | |   | | | | | | . ` | `--. \
| |   | |_| | |\  | \__/\ | |  _| |_\ \_/ / |\  |/\__/ /
\_|    \___/\_| \_/\____/ \_/  \___/ \___/\_| \_/\____/  
*/


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}



async function deleteMqttDeviceCredentials(dId) {
    try {
        await EmqxAuthModel.deleteMany({ dId: dId, type: "device" });
        return true;
    } catch (e) {
        console.log(e);

    }

}

async function deleteAllAlarmRules(userId, dId) {

    try {
        const rules = await AlarmRuleModel.find({ userId, dId });
        console.log(rules)
        if (rules.length > 0) {
            asyncForEach(rules, async rule => {
                await deleteAlarmRule(rule.emqxRuleId);
            });
        }
    } catch (e) {
        console.log(e);
    }

}

async function deleteSaverRule(dId) {

    try {
        const mongoRule = await SaverRuleModel.findOne({ dId: dId });

        const url = `http://${process.env.EMQX_HOST}:${process.env.EMQX_MANAGMENT_PORT}/api/v4/rules/${mongoRule.emqxRuleId}`

        await SaverRuleModel.deleteOne({ dId: dId });
        await axios.delete(url, auth);

        return true;
    } catch (e) {
        console.log(e)
        console.log("error deleting saver rule")
        return false;

    }

}

async function deleteAlarmRule(emqxRuleId) {
    try {

        const url = `http://${process.env.EMQX_HOST}:${process.env.EMQX_MANAGMENT_PORT}/api/v4/rules/${emqxRuleId}`;

        await axios.delete(url, auth);

        await AlarmRuleModel.deleteOne({ emqxRuleId: emqxRuleId });

        return true;

    } catch (error) {
        console.log(error);
        return false;

    }
}
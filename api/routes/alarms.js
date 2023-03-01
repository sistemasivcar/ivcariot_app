import { Router } from "express";
const router = Router();
import axios from 'axios';
import asyncMiddleware from '../middleware/async';
import checkAuth from '../middleware/auth';

const auth = {
    auth: {
        username: 'admin',
        password: process.env.EMQX_MANAGMENT_PASSWORD
    }
};

import AlarmRuleModel from "../models/emqx_alarm_rule";
import DeviceModel from "../models/device";
/* 
  ___  ______ _____ 
 / _ \ | ___ \_   _|
/ /_\ \| |_/ / | |  
|  _  ||  __/  | |  
| | | || |    _| |_ 
\_| |_/\_|    \___/ 
*/

router.get('/', checkAuth, asyncMiddleware(async (req, res) => {
    const dId = req.query.dId;
    const userId = req.userData._id;

    const alarmRules = await AlarmRuleModel.find({ userId: userId, dId: dId });
    const toSend = {
        status: 'success',
        data: alarmRules,
    };

    res.json(toSend);
}))

router.post('/', checkAuth, asyncMiddleware(async (req, res) => {

    const userId = req.userData._id;
    const newRule = {
        ...req.body.newRule,
        userId,
        status: true
    };
    console.log(newRule)

    if (await createAlarmRule(newRule)) {
        console.log('ALARM-RULE CREATED'.green);
        res.status(200).json({ status: 'success' })
    } else {
        throw new Error('Error creating alarm rule')
    }
}));

router.put('/', checkAuth, asyncMiddleware(async (req, res) => {

    const newStatus = req.body.status;
    const emqxRuleId = req.body.emqxRuleId;
    var r = await updateAlarmRuleStatus(emqxRuleId, newStatus);

    if (r == true) {
        return res.json({ status: "success" });

    } else {
        return res.json({ status: "error" });
    }

}));


router.delete('/', checkAuth, asyncMiddleware(async (req, res) => {

    var emqxRuleId = req.query.emqxRuleId;

    var r = await deleteAlarmRule(emqxRuleId);

    if (r == true) {
        return res.json({ status: "success" });

    } else {
        return res.json({ status: "error" });
    }

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



async function createAlarmRule({ userId, dId, variable, value, condition, status, triggerTime, variableFullName, message, messageOn, messageOff }) {

    try {
        const url_post = `http://localhost:${process.env.EMQX_MANAGMENT_PORT}/api/v4/rules`;
        const topic = `${userId}/${dId}/${variable}/sdata`;
        if (!message) {
            /* // CREATE ALARMA FOR STATUS CHANGES */
            const rawsql_for_change = `SELECT username, topic, payload FROM "${topic}" `;
            var newRule = {
                rawsql: rawsql_for_change,
                actions: [{
                    name: "data_to_webserver",
                    params: {
                        $resource: global.alarmResource.id,
                        payload_tmpl: '"payload":${payload},"topic":"${topic}"}'
                    }
                }],
                description: "ALARM-RULE",
                enabled: status
            }
            const res_change = await axios.post(url_post, newRule, auth);
            const emqxRuleId = res_change.data.data.id;
            if (res_change.data.data && res_change.status === 200) {
                //grabo alarm-rule en mongo
                const mongoAlarmRule = await AlarmRuleModel.create({
                    userId,
                    dId,
                    variable,
                    status,
                    messageOn,
                    messageOff,
                    variableFullName,
                    emqxRuleId,
                    createdTime: Date.now(),
                });
    
                // actualizo las alarmRules del device
                var alarmRules = [];
                const device = await DeviceModel.findOne({ dId: dId });
                alarmRules = [...device.alarmRules, mongoAlarmRule._id]
                await DeviceModel.updateOne({ dId: dId }, { alarmRules: alarmRules });
    
                // actualizo la regla eqmx
    
                const url_put = `http://localhost:${process.env.EMQX_MANAGMENT_PORT}/api/v4/rules/${emqxRuleId}`;
                const payload_templ = '{"userId":"' + userId + '","dId":"' + dId + '","payload":${payload},"topic":"${topic}","emqxRuleId":"' + emqxRuleId + '","messageOn":"' + messageOn + '","messageOff":"' + messageOff + '","variable":"' + variable + '","variableFullName":"' + variableFullName + '"}';
                newRule.actions[0].params.payload_tmpl = payload_templ;
    
                // actualizo la regla
                const rest = await axios.put(url_put, newRule, auth);
                console.log(rest)
    
                return true;
            } else {
                return false;
            }

        }

        /* // CREATE A REGULAR ALARM RULE */
        const rawsql = `SELECT username, topic, payload FROM "${topic}" WHERE payload.value ${condition} ${value} AND is_not_null(payload.value)`;

        var newRule = {
            rawsql: rawsql,
            actions: [{
                name: "data_to_webserver",
                params: {
                    $resource: global.alarmResource.id,
                    payload_tmpl: '"payload":${payload},"topic":"${topic}"}'
                }
            }],
            description: "ALARM-RULE",
            enabled: status
        }

        const res = await axios.post(url_post, newRule, auth);
        const emqxRuleId = res.data.data.id;

        if (res.data.data && res.status === 200) {
            //grabo alarm-rule en mongo
            const mongoAlarmRule = await AlarmRuleModel.create({
                userId,
                dId,
                variable,
                value,
                condition,
                status,
                message,
                triggerTime,
                variableFullName,
                emqxRuleId,
                createdTime: Date.now(),
            });

            // actualizo las alarmRules del device
            var alarmRules = [];
            const device = await DeviceModel.findOne({ dId: dId });
            alarmRules = [...device.alarmRules, mongoAlarmRule._id]
            await DeviceModel.updateOne({ dId: dId }, { alarmRules: alarmRules });

            // actualizo la regla eqmx

            const url_put = `http://localhost:${process.env.EMQX_MANAGMENT_PORT}/api/v4/rules/${emqxRuleId}`;
            const payload_templ = '{"userId":"' + userId + '","dId":"' + dId + '","payload":${payload},"topic":"${topic}","emqxRuleId":"' + emqxRuleId + '","value":' + value + ',"condition":"' + condition + '","message":"' + message + '","variable":"' + variable + '","variableFullName":"' + variableFullName + '","triggerTime":' + triggerTime + '}';
            newRule.actions[0].params.payload_tmpl = payload_templ;

            // actualizo la regla
            const rest = await axios.put(url_put, newRule, auth);

            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log(e)
        console.log('error creating or updating alarm-rule')
        return false

    }
}


async function updateAlarmRuleStatus(emqxRuleId, status) {

    const url = `http://localhost:${process.env.EMQX_MANAGMENT_PORT}/api/v4/rules/${emqxRuleId}`;

    const newRule = {
        enabled: status
    }

    const res = await axios.put(url, newRule, auth);

    if (res.data.data && res.status === 200) {

        await AlarmRuleModel.updateOne({ emqxRuleId: emqxRuleId }, { status: status });
        console.log("Saver Rule Status Updated...".green);

        return true;
    }

}

async function deleteAlarmRule(emqxRuleId) {
    try {

        const url = `http://localhost:${process.env.EMQX_MANAGMENT_PORT}/api/v4/rules/${emqxRuleId}`;

        await axios.delete(url, auth);

        await AlarmRuleModel.deleteOne({ emqxRuleId: emqxRuleId });

        return true;

    } catch (error) {
        console.log(error);
        return false;

    }
}
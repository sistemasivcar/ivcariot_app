/* 

ESTOS SON ENDPOINTS QUE
LLAMARÁ EL MISMO BROKER EMQX

 */

import { Router } from "express";

import DataModel from "../models/data";
import TemplateModel from '../models/template';
import DeviceModel from "../models/device";
import Notification from "../models/notification";
import AlarmRuleModel from "../models/emqx_alarm_rule";
import EmqxAuthModel from '../models/emqx_auth'
import mqtt from "mqtt";

const router = Router();
const axios = require('axios');
const colors = require('colors');
var client;

// SAVER RULE WEBHOOK
router.post('/saver-webhook', async (req, res) => {
    if (!req.headers.token === process.env.EMQX_MANAGMENT_TOKEN) return res.sendStatus(404);

    const data = req.body;
    const splittedTopic = data.topic.split('/');

    const userId = splittedTopic[0]
    const dId = splittedTopic[1];
    const variable = splittedTopic[2]
    const value = data.payload.value;

    const result = await DeviceModel.find({ dId: dId, userId: userId });

    if (result.length === 1) {
        await DataModel.create({
            userId,
            dId,
            variable,
            value,
            time: Date.now()
        })
    }
    console.log(data)
    res.sendStatus(200);



});
// ALARM RULE WEBHOOK
router.post('/alarm-webhook', async (req, res) => {
    try {
        res.sendStatus(200);
        if (!req.headers.token === process.env.EMQX_MANAGMENT_TOKEN) return res.sendStatus(404);

        const incomingAlarm = req.body;

        updateAlarmCounter(incomingAlarm.emqxRuleId)
        const lastNotif = await Notification.find({ dId: incomingAlarm.dId, emqxRuleId: incomingAlarm.emqxRuleId }).sort({ createdTime: -1 }).limit(1);

        if (lastNotif == 0) {
            console.log("FIRST TIME ALARM");
            sendMqttNotif(incomingAlarm);
            saveNotifToMongo(incomingAlarm);
        } else {

            const lastNotifToNowMins = (Date.now() - lastNotif[0].createdTime) / 1000 / 60;

            if (lastNotifToNowMins > incomingAlarm.triggerTime) {
                console.log("TRIGGERED");
                sendMqttNotif(incomingAlarm);
                saveNotifToMongo(incomingAlarm);
            }

        }

    } catch (e) {
        console.log(e);
        res.sendStatus(200);
    }



});

router.post("/getdevicecredentials", async (req, res) => {
    try {

        const dId = req.body.dId;

        const whpassword = req.body.whpassword;

        const device = await DeviceModel.findOne({ dId: dId });

        if (whpassword != device.whpassword) {
            return res.status(401).json();
        }

        const userId = device.userId;

        var credentials = await getDeviceMqttCredentials(dId, userId);
        if (!credentials) return res.sendStatus(500);

        var template = await TemplateModel.findOne({ _id: device.templateId._id });


        var variables = [];

        template.widgets.forEach(widget => {
            var v = (({
                variable,
                variableFullName,
                variableType,
                variableSendFreq
            }) => ({
                variable,
                variableFullName,
                variableType,
                variableSendFreq
            }))(widget);

            variables.push(v);
        });

        const response = {
            username: credentials.username,
            password: credentials.password,
            topic: userId + "/" + dId + "/",
            variables: variables
        };


        res.json(response);

        setTimeout(() => {
            getDeviceMqttCredentials(dId, userId);
            console.log("Device Credentials Updated");
        }, 20000);


    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}); 


module.exports = router;

function saveNotifToMongo(incomingAlarm) {

    var newNotif = incomingAlarm;
    newNotif.createdTime = Date.now();
    newNotif.readed = false;
    Notification.create(newNotif);
}

async function updateAlarmCounter(emqxRuleId) {
    try {
        await AlarmRuleModel.updateOne({ emqxRuleId }, { $inc: { counter: 1 } });
    } catch (e) {
        return false;
    }
}

function startMqttClient() {

    const options = {
        port: 1883,
        host: 'localhost',
        clientId: 'webhook_superuser' + Math.round(Math.random() * (0 - 10000) * -1),
        username: 'superuser',
        password: 'superuser',
        keepalive: 60,
        reconnectPeriod: 5000,
        protocolId: 'MQIsdp',
        protocolVersion: 3,
        clean: true,
        encoding: 'utf8'
    }

    client = mqtt.connect('mqtt://' + 'localhost', options);

    client.on('connect', function () {
        console.log("MQTT CONNECTION -> SUCCESS;".green);
        console.log("\n");
    });

    client.on('reconnect', (error) => {
        console.log('RECONNECTING MQTT');
        console.log(error)
    });

    client.on('error', (error) => {
        console.log("MQTT CONNECIONT FAIL -> ");
        console.log(error)
    });


}


function sendMqttNotif(notif) {
    try {
        const topic = notif.userId + '/dummy-did/dummy-var/notif';
        console.log(notif)
        const msg = notif.message;
        client.publish(topic, msg);
    } catch (error) {
        console.log(error)

    }
}

async function getDeviceMqttCredentials(dId, userId) {

    try {
        const credentials = await EmqxAuthModel.findOne({ type: "device", dId: dId, userId: userId });
        if (!credentials) {
            const newRule = {
                userId: userId,
                dId:dId,
                username: makeid(10),
                password: makeid(10),
                publish: [userId + "/" + dId + "/+/sdata"],
                subscribe: [userId + "/" + dId + "/+/actdata"],
                type: "device",
                createdTime: Date.now(),
                updatedTime: Date.now()
            }

            const result = await EmqxAuthModel.create(newRule);

            const toReturn = {
                username: result.username,
                password: result.password
            }

            return toReturn;
        }


        const newusername = makeid(10);
        const newpassword = makeid(10);

        const result = await EmqxAuthModel.updateOne({ type: "device", dId: dId,  userId: userId, }, { $set: { username: newusername, password: newpassword, updatedTime: Date.now() } });

        if (result.n == 1 && result.ok == 1) {
            return {
                username: newusername,
                password: newpassword
            }
        }
        return false;

    } catch (error) {
        console.log(error)
        return false;
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
setTimeout(function () {
    startMqttClient()
}, 3000)
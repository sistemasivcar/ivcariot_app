/* 

ESTOS SON ENDPOINTS QUE
LLAMARÁ EL MISMO BROKER EMQX

 */

import { Router } from "express";
import DataModel from "../models/data";
import DeviceModel from "../models/device";
import Notification from "../models/notifications";
import AlarmRuleModel from "../models/emqx_alarm_rule";
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
        console.log(topic)
        const msg = 'The rule: when the ' + notif.variableFullName + ' is ' + notif.condition + ' than ' + notif.value;
        client.publish(topic, msg);
    } catch (error) {
        console.log(error)
        
    }
}

setTimeout(function () {
    startMqttClient()
},3000)
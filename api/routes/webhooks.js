/* 

ESTOS SON ENDPOINTS QUE
LLAMARÁ EL MISMO BROKER EMQX

 */

import { Router } from "express";

import DataModel from "../models/data";
import TemplateModel from '../models/template';
import DeviceModel from "../models/device";
import UserModel from '../models/user';
import Notification from "../models/notification";
import AlarmRuleModel from "../models/emqx_alarm_rule";
import EmqxAuthModel from '../models/emqx_auth'
import mqtt from "mqtt";

const router = Router();
const axios = require('axios');
const colors = require('colors');
const qs = require('qs');
var client;

// WHATSAPP API CONFIG
var config = {
    method: 'post',
    url: 'https://api.ultramsg.com/instance21265/messages/chat',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: null
};

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
    res.sendStatus(200);



});
// ALARM RULE WEBHOOK
router.post('/alarm-webhook', async (req, res) => {
    try {
        res.sendStatus(200);
        if (!req.headers.token === process.env.EMQX_MANAGMENT_TOKEN) return res.sendStatus(404);
        const incomingAlarm = req.body;
        //console.log(incomingAlarm)

        updateAlarmCounter(incomingAlarm.emqxRuleId)
        const sendWpp = incomingAlarm.notifMethods.includes('wpp');
        const sendEmail = incomingAlarm.notifMethods.includes('sms');
        const sendSMS = incomingAlarm.notifMethods.includes('email');
        const { phones } = await UserModel.findOne({ _id: incomingAlarm.userId })
       

        if (incomingAlarm.typeAlarm == 'change') {

            /* CHANGE ALARM */

            if (incomingAlarm.payload.value) {
                //send notif ON
                sendMqttNotif(incomingAlarm.userId, incomingAlarm.messageOn);
                sendWpp ? sendWhatsappNotif(phones, incomingAlarm.messageOn) : null
                const notifToSave = {
                    ...incomingAlarm,
                    type: 'change',
                    message: incomingAlarm.messageOn
                }
                saveNotifToMongo(notifToSave);
            } else if (!incomingAlarm.payload.value) {
                //send notif OFF
                sendMqttNotif(incomingAlarm.userId, incomingAlarm.messageOff);
                sendWpp ? sendWhatsappNotif(phones, incomingAlarm.messageOff) : null
                const notifToSave = {
                    ...incomingAlarm,
                    type: 'change',
                    message: incomingAlarm.messageOff
                }
                saveNotifToMongo(notifToSave);
            }
            return;
        }

        if (incomingAlarm.typeAlarm == 'regular') {
            /* REGULAR ALARM */

            const lastNotif = await Notification.find({ dId: incomingAlarm.dId, emqxRuleId: incomingAlarm.emqxRuleId }).sort({ createdTime: -1 }).limit(1);

            if (lastNotif == 0) {

                sendMqttNotif(incomingAlarm.userId, incomingAlarm.message);
                sendWpp ? sendWhatsappNotif(phones, '⚠️'+incomingAlarm.message) : null
                saveNotifToMongo({ ...incomingAlarm, message: incomingAlarm.message });
            } else {

                const lastNotifToNowMins = (Date.now() - lastNotif[0].createdTime) / 1000 / 60;

                if (lastNotifToNowMins > incomingAlarm.triggerTime) {

                    sendMqttNotif(incomingAlarm.userId, incomingAlarm.message);
                    sendWpp ? sendWhatsappNotif(phones, '⚠️'+incomingAlarm.message) : null
                    saveNotifToMongo({ ...incomingAlarm, message: incomingAlarm.message });
                }

            }
        }

    } catch (e) {
        console.log(e)
        res.sendStatus(200);
    }



});

router.post("/getdevicecredentials", async (req, res) => {
    try {

        const dId = req.body.dId;
        const whpassword = req.body.whpassword;
        const device = await DeviceModel.findOne({ dId: dId });
        if(!device) return res.status(401).json();

        if (whpassword != device.whpassword) return res.status(401).json();
        

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
                variableSendFreq,
                sendMethod,
            }) => ({
                variable,
                variableFullName,
                variableType,
                variableSendFreq,
                sendMethod
            }))(widget);

            variables.push(v);
        });

        const response = {
            username: credentials.username,
            password: credentials.password,
            topic: userId + "/" + dId + "/",
            device_name:device.name,
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
        host: process.env.EMQX_HOST,
        clientId: 'ivcariot_webhook_superuser',
        username: process.env.EMQX_NODE_SUPERUSER_USERNAME,
        password: process.env.EMQX_NODE_SUPERUSER_PASSWORD,
        keepalive: 60,
        reconnectPeriod: 5000,
        protocolId: 'MQIsdp',
        protocolVersion: 3,
        clean: false,
        encoding: 'utf8'
    }

    client = mqtt.connect('mqtt://' + process.env.EMQX_HOST, options);

    client.on('connect', function () {
        console.log("MQTT CONNECTION -> SUCCESS;".green);
        const statusTopicSubscribe = '+/+/+/status';
        client.subscribe(statusTopicSubscribe, { qos: 0 }, () => {
            
        })
    });
    
    client.on('message', (topic, message) => {
        console.log(topic,message.toString());
        const splittedTopic = topic.split("/");
        const typeMessage = splittedTopic[3];
        if (typeMessage == 'status') {
            const userId = splittedTopic[0];
            const dId = splittedTopic[1];
            processStatusMessage(dId, userId, JSON.parse(message.toString()))
        }
    })

    client.on('reconnect', (error) => {
        console.log('RECONNECTING MQTT');
        console.log(error)
    });

    client.on('error', (error) => {
        console.log("MQTT CONNECIONT FAIL -> ");
        console.log(error)
    });


}

async function processStatusMessage(dId, userId, message) {
    // whatsApp notification
    // message -> {
    //     status:"online",
    //     name:"devicename"
    // }
    try {
        const {phones} = await UserModel.findOne({_id:userId})
        const {status}=await DeviceModel.findOne({ dId, userId })
        console.log(status,message.status)
        if(message.status=="offline" && status == "online"){
            sendWhatsappNotif(phones, `"${message.name.toUpperCase()}" FUERA DE LINEA 🔴`)
            await DeviceModel.updateOne({ dId, userId }, { status:message.status })
        }
        if(message.status=="online" && status == "offline"){
            sendWhatsappNotif(phones, `"${message.name.toUpperCase()}" EN LÍNEA 🔵`)
            await DeviceModel.updateOne({ dId, userId }, { status:message.status })
        }
    } catch (e) {
        console.log(e)
    }
    
}

function sendMqttNotif(userId, message) {
    try {

        const topic = userId + '/dummy-did/dummy-var/notif';
        const msg = message;
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
                dId: dId,
                username: makeid(10),
                password: makeid(10),
                publish: [userId + "/" + dId + "/+/sdata", userId + "/" + dId + "/+/status"],
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

        const result = await EmqxAuthModel.updateOne({ type: "device", dId: dId, userId: userId, }, { $set: { username: newusername, password: newpassword, updatedTime: Date.now() } });

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

function sendWhatsappNotif(phones, text) {
    try {
        phones.forEach(phone => {
            var data = qs.stringify({
                "token": process.env.WPP_TOKEN,
                "to": `+549${phone}@c.us`,
                "body": text,
            });

            config.data = data;

            axios(config)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                })
                .catch(function (error) {
                    console.log(error);
                });
        })
    } catch (e) {
        console.log(e)
    }
}
setTimeout(function () {
    startMqttClient()
}, 3000)
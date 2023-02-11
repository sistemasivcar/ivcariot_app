/* 

ESTOS SON ENDPOINTS QUE
LLAMARÁ EL MISMO BROKER EMQX

 */ 

import { Router } from "express";
import DataModel from "../models/data";
import DeviceModel from "../models/device";
import Notification from "../models/notifications";

const router = Router();
const axios = require('axios');
const colors = require('colors');

// regla de grabar en Base de Datos
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

router.post('/alarm-webhook', async (req, res) => {
try {
    if (!req.headers.token === process.env.EMQX_MANAGMENT_TOKEN) return res.sendStatus(404);

    const incomingAlarm = req.body;
    console.log(incomingAlarm);

    if (lastNotif == 0) {
        console.log("FIRST TIME ALARM");
        saveNotifToMongo(incomingAlarm);
    } else {

        const lastNotifToNowMins = (Date.now() - lastNotif[0].time) / 1000 / 60;

        if (lastNotifToNowMins > incomingAlarm.triggerTime) {
            console.log("TRIGGERED");
            saveNotifToMongo(incomingAlarm);
        }

    }

    res.sendStatus(200);
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
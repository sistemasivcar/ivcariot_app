/* ESTOS SON ENDPOINTS QUE
LLAMARÁ EL MISMO BROKER EMQX
 */ 

import { Router } from "express";
import DataModel from "../models/data";
import DeviceModel from "../models/device";

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

module.exports = router;

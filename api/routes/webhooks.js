/* ESTOS SON ENDPOINTS QUE
LLAMARÁ EL MISMO BROKER EMQX
 */ 

import { Router } from "express";
const router = Router();
const axios = require('axios');
const colors = require('colors');

// regla de grabar en Base de Datos
router.get('/saver-webhook', async (req, res) => {

    const data = req.body;
    console.log(data);
    res.json("{}");

});

module.exports = router;
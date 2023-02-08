import { Router } from "express";
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

import templateModel from '../models/template.js';
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

    const templates = await templateModel.find({ userId: userId });
    const toSend = {
        status: 'success',
        data:templates
    }

    res.status(200).json(toSend);
}))

router.post('/', checAuth, asyncMiddleware(async (req, res) => {
    const userId = req.userData._id;
    const createdTime = Date.now();

    const template = await templateModel.create({ ...req.body.template, userId,createdTime });
    const toSend = {
        status: 'success',
        data: template,
    };
    res.status(200).json(toSend);

}))

router.delete('/', checAuth, asyncMiddleware(async (req, res) => {
    const templateId = req.query._id;
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
    console.log('success')
    return res.status(200).json(toSend);

}))
module.exports= router;
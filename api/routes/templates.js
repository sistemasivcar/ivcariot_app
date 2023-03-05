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
import DeviceModel from '../models/device';
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
        data:userTemplates
    }

    if(!publics) return res.status(200).json(toSend);
    const publicTemplates = await templateModel.find({ isPublic: true });
    
    //merge userTemplates and publicTemplates without repeted tempaltes in the final array
    userTemplates.forEach((userTemp,i)=>{
        publicTemplates.forEach((pubTemp,j)=>{
            if(pubTemp.userId==userTemp.userId){
                publicTemplates.splice(j,1)
            }
        })
    })

    toSend = {
        status: 'success',
        data:[...userTemplates,...publicTemplates]
    }
    
    return res.status(200).json(toSend);
}))

router.get('/:id', checAuth, asyncMiddleware(async (req, res) => {
    const userId = req.userData._id;
    console.log(req.params)

    const templates = await templateModel.findOne({ userId: userId,_id:req.params.id });
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

router.put('/', checAuth, asyncMiddleware(async (req,res)=>{
    const userId = req.userData._id;
    const template = req.body.template
    if(template.widgets){
        await templateModel.updateOne({userId, _id:template.id},{widgets:template.widgets});
        return res.json({status:'success'})
    }

    await templateModel.updateOne({userId, _id:template.id},{isPublic:template.isPublic});
    return res.json({status:'success'})



}))

router.delete('/', checAuth, asyncMiddleware(async (req, res) => {

    const templateId = req.query._id;

    // por si la plantilla es publica y la están usando 
    // otros dispositivos, los elimino a todos  
    const devices = await DeviceModel.find({templateId})
    asyncForEach(devices,async device => {
        await DeviceModel.deleteOne({dId:device.dId})
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
    console.log('success')
    return res.status(200).json(toSend);

}))
module.exports= router;

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
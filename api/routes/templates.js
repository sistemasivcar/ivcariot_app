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

}))

router.post('/', checAuth, asyncMiddleware(async (req, res) => {
    const userId = req.userData._id;
    
    const template = await templateModel.create({ ...req.body.data, userId });
    console.log(template);
}))

router.delete('/', checAuth, asyncMiddleware(async (req, res) => {

}))
export default router;
import { Router } from 'express';
import CheckAuth from '../middleware/auth';
import asyncMiddleware from '../middleware/async';
import DataModel from '../models/data';

const router = Router()

router.get("/get-data-chart", CheckAuth, asyncMiddleware(async (req, res) => {
    const userId = req.userData._id;
    const { dId, chartTimeAgo, variable } = req.query;
    
    const timeAgoms = Date.now() - (chartTimeAgo * 60 * 1000);

    const data = await DataModel.find({ dId, variable, userId, "time": { $gt: timeAgoms } });

    const toSend = {
        status: 'success',
        data
    };

    res.json(toSend);

}));
module.exports = router;

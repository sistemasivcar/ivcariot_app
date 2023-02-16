import { Router } from "express";
import checkAuth from '../middleware/auth'
import asyncMiddleware from '../middleware/async'
const router = Router();

import Notification from "../models/notification";

//GET NOTIFICATIONS
router.get("/", checkAuth, asyncMiddleware(async (req, res) => {

    const userId = req.userData._id;
    const numberPage = req.query.numberPage;
    console.log(numberPage)
    const pageSize = 10;

    const notifications = await Notification.find({ userId: userId })
        .sort({ createdTime: -1 })
        .skip((numberPage-1) * pageSize)
        .limit(pageSize);

        const toSend = {
            status: "success",
            data: notifications
        };
        res.json(toSend);

}));

router.get("/fordevice", checkAuth, asyncMiddleware(async (req, res) => {

    const userId = req.userData._id;
    const numberPage = req.query.numberPage;
    const dId = req.query.dId;
    console.log(numberPage)
    const pageSize = 10;

    const notifications = await Notification.find({ userId: userId, dId:dId })
        .sort({ createdTime: -1 })
        .skip((numberPage - 1) * pageSize)
        .limit(pageSize);

    const toSend = {
        status: "success",
        data: notifications
    };
    res.json(toSend);

}));

//UPDATE NOTIFICATION (readed status)
router.put("/", checkAuth, asyncMiddleware(async (req, res) => {

    const userId = req.userData._id;

    const notificationId = req.body.notifId;

    await Notification.updateOne({ userId: userId, _id: notificationId }, { readed: true });

    const toSend = {
        status: "success",
    };

    res.json(toSend);


}));

module.exports=router
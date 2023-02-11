import { Router } from "express";
import checkAuth from '../middleware/auth'
const router = Router();

import Notification from "../models/notifications";

//GET NOTIFICATIONS
router.get("/", checkAuth, async (req, res) => {

        const userId = req.userData._id;
    const notifications = await Notification.find({ userId: userId, readed: false });

        const toSend = {
            status: "success",
            data: notifications
        };
        res.json(toSend);

});

//UPDATE NOTIFICATION (readed status)
router.put("/", checkAuth, async (req, res) => {

    const userId = req.userData._id;

    const notificationId = req.body.notifId;

    await Notification.updateOne({ userId: userId, _id: notificationId }, { readed: true });

    const toSend = {
        status: "success",
    };

    res.json(toSend);


});

module.exports=router
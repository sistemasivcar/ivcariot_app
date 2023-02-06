const express = require('express');
import checAuth from '../middleware/auth.js';
import asyncMiddleware from '../middleware/async';

const router = express.Router();

router.get('/', checAuth, asyncMiddleware(async (req, res) => {
    res.json(req.userData)
}));

module.exports = router;
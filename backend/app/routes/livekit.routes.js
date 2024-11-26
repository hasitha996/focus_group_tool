const express = require('express');
const livekitController = require('../controllers/livekit.controller');

const router = express.Router();

router.post('/live_token', livekitController.getToken);

module.exports = router;

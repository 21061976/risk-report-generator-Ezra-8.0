const express = require('express');
const { getHealthStatus, getSystemMetrics } = require('../controllers/healthController');

const router = express.Router();

router.get('/', getHealthStatus);
router.get('/metrics', getSystemMetrics);

module.exports = router;

const express = require('express');
const controller = require('../controllers/busStops');
const router = express.Router();

//localhost:5000/api/busStops/login
router.get('/:id', controller.getAllById);

router.get('/getStopsByRouteStart', controller.getStopsByRouteStart);

module.exports = router;

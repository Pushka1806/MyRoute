const express = require('express')
const controller = require('../controllers/busStops')
const router = express.Router()

router.get('/getStopsByRouteStart', controller.getStopsByRouteStart)

module.exports = router
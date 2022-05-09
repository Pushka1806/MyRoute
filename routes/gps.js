const express = require('express')
const controller = require('../controllers/gps')
const router = express.Router()


router.get('/getJpsByStops', controller.getJpsByStops)


router.get('/getGpsDriver',controller.getGpsDriver)

module.exports = router

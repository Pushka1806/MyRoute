const express = require('express')
const controller = require('../controllers/gps')
const router = express.Router()


router.get('/getJpsByStops', controller.getJpsByStops)


router.post('/getGpsDriver',controller.getGpsDriver)

module.exports = router

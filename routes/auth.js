const express = require('express');
const controller = require('../controllers/auth');
const router = express.Router();

//localhost:5000/api/auth/login
router.post('/login', controller.login);

//localhost:5000/api/auth/register
router.post('/register', controller.register);

router.get('/driverGetInfo', controller.driverGetInfo);

router.get('/driverGetRouteById', controller.driverGetRouteById);

router.post('/plusOne', controller.plusOne);

router.post('/minusOne', controller.minusOne);

router.post('/deletePassengers', controller.deletePassengers)

router.patch('/getWorkAuto', controller.getWorkAuto)        // изменение флага водителя (работает/неработает)

router.patch('/editGPSDriver', controller.editGPSDriver)        // изменение координат GPS водителя

module.exports = router

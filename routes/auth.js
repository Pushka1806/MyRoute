const express = require('express');
const controller = require('../controllers/auth');
const router = express.Router();

router.post('/login', controller.login)     // вход в систему по паролю

// localhost:5000/api/auth/register
// router.post('/register', controller.register);

router.get('/driverGetInfo', controller.driverGetInfo);

router.get('/driverGetRouteById', controller.driverGetRouteById);

router.post('/plusOne', controller.plusOne);

router.post('/minusOne', controller.minusOne);

router.post('/deletePassengers', controller.deletePassengers)

router.patch('/setWorkAuto', controller.getWorkAuto)        // изменение флага водителя (работает/неработает)

router.patch('/setGPSDriver', controller.editGPSDriver)        // изменение координат GPS водителя

router.patch('/newPassword', controller.newPassword)        // изменение пароля в БД, универсальный метод

module.exports = router

const express = require('express')
const controller = require('../controllers/auth')
const router = express.Router()


// вход в систему по паролю
router.post('/login', controller.login)      // y

// изменение пароля в БД, универсальный метод
router.patch('/newPassword', controller.newPassword)        // y

// получение массива маршрутов по логину
router.get('/getDriverRouterID', controller.getDriverRouterID)      // у

// добавляю пассажира в запись водителя (поштучно!)
router.patch('/plusOne', controller.plusOne)        // y

// отнимаю пассажира в запись водителя (поштучно!)
router.patch('/minusOne', controller.minusOne)      // y

// обнуление количества пассажиров в записи водителя по логину
router.patch('/deletePassengers', controller.deletePassengers)      // y

// изменение флага водителя в записи (работает/неработает)
router.patch('/setWorkAuto', controller.setWorkAuto)        // у

// изменение координат GPS водителя
router.patch('/setGPSDriver', controller.setGPSDriver)      // у

// обнуление записи водителя:
//  -маршрутов следования
//  -маршрута работы
//  -следующей остановки
//  -количества пассажиров
//  -флага работы маршрутки
router.patch('/resetDriver', controller.resetDriver)        // y

// получение "флага пароля" водителя
router.get('/getDriverFlag', controller.getDriverFlag)      // у

// принудительная смена "флага пароля" водителя
router.patch('/setDriverFlag', controller.setDriverFlag)      // у

module.exports = router

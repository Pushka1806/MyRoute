const express = require('express')
const controller = require('../controllers/stops')
const router = express.Router()


// вывод в массиве всех существующих остановок
router.get('/getAllExistingStops', controller.getAllExistingStops)      // у   

// вывод массива остановок, в которые можно добраться из текущей 
router.get('/getAvailableStopsByName', controller.getAvailableStopsByName)      // у

// вывод всех маршрутов в форме массива
router.get('/getAllRoutes', controller.getAllRoutes)        // у

// вывод массива названий остановок по маршруту
router.get('/getRouteNameByID', controller.getRouteNameByID)        // у

// вывод массива остановок по маршруту с их координатами
router.get('/getRouteNameWithGPSByID', controller.getRouteNameWithGPSByID)        // у

// вывод массива с маршрутами подходящими по пути пассажира
router.get('/getRoutesByStops', controller.getRoutesByStops)        // у

// вывод массива с объектами
// название + координаты остановок
router.get('/getGPSAllStops', controller.getGPSAllStops)        // у

module.exports = router

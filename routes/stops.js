const express = require('express')
const controller = require('../controllers/stops')
const router = express.Router()


// вывод в массиве всех существующих остановок
router.get('/getAllExistingStops', controller.getAllExistingStops)      // у   

// вывод массива с объектами
// название + координаты остановок
router.get('/getGPSAllStops', controller.getGPSAllStops)        // у

// вывод всех маршрутов в форме массива
router.get('/getAllRoutes', controller.getAllRoutes)        // у

// вывод массива остановок, в которые можно добраться из начальной остановки
router.get('/getStopsByStart', controller.getStopsByStart)      // у

//вывод массива остановок, в которые можно добратьcя по текущему маршруту из начальной остановки
router.get('/getStopsByRouteAndStart', controller.getStopsByRouteAndStart)



// вывод массива названий остановок по маршруту
router.get('/getStopsFromRoute', controller.getStopsFromRoute)        // у

// вывод массива остановок по маршруту с их координатами
router.get('/getGPSStopsFromRoute', controller.getGPSStopsFromRoute)        // у

// вывод массива с маршрутами подходящими по пути пассажира
router.get('/getRoutesByStops', controller.getRoutesByStops)        // у


module.exports = router

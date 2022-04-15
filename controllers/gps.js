const Passenger = require('../models/User_passenger');
const Driver = require('../models/User_driver')
const Driver_route = require('../models/Driver_routes');

//просто получить ВСЕ остановки - правил
module.exports.AvailableZakaz = async function (req, res){
    const getZakaz = await Passenger.find();
   
    let sortedRoute = new Array();
    for(const zakaz of getZakaz){
        for (const route  of zakaz.routeID) {
            if(route === req.query.routeID) {
               sortedRoute.push({start:zakaz.start, stop:zakaz.stop});
            }
        }
    }
    //console.log(sortedDrivers);
   // const sortedRouteRoute = {stops: sortedRoute}
    res.status(200).json(sortedRoute);
}

module.exports.getJpsByStops = async function(req, res) {
    //для этого сначала получим все маршруты, которые содержат в себе эти остановки
    const driver_route = await Driver_route.findOne({"_id":req.query.route});
    let step_one = new Array;
    let step_two = new Array;
    let size = driver_route.lenght;
    let findStart = false, findStop = false;
    for (let i = 0;driver_route.route.length>i;i++) {
        if(driver_route.route[i].name === req.query.step_one) {
            findStart = true;
            step_one.push(driver_route.route[i].latitude)
            step_one.push(driver_route.route[i].longitude)
            continue;
        }
        if(driver_route.route[i].name === req.query.step_two) {
            findStop = true;
            step_two.push(driver_route.route[i].latitude)
            step_two.push(driver_route.route[i].longitude)
            break;
        }
    }
    if(findStart && findStop){
         const result= {step_one:step_one,step_two:step_two,message:"OK"}
         res.status(200).json(result);
    }
    else{
        const result = {step_one:size,step_two:{}, message:"NO"}
        res.json(result);
    }
}

module.exports.getGpsDriver = async function(req, res) {        // тут ПИЗДЕЦ
    let ok_cars = new Array()
    for(let route of  req.query.routes){
        let cars_route = await Driver.find({route_work:route})      // получили водителей работающих на этом маршруте
        const driver_route = await Driver_route.findOne({_id:route})        // получили остановки маршрута
        let okDriverByRoute = new Array()
        for(let car of cars_route){
            if (check_gps(car, driver_route, req.query.start)){     // проверяем, приедет ли водитель на нашу остановку или уже проехал
                let lat = car.gps.latitude
                let lon = car.gps.longitude
                let car_result = {id: car._id, latitude:lat, longitude:lon}
                okDriverByRoute.push(car_result)
            }
        }
        let result = {route: route, cars: okDriverByRoute}
        ok_cars.push(result)       // отправляем машины в массив, по текущему маршруту
    }
    let car_name = {
        name: {}
    }
    car_name.name = ok_cars
    res.status(200).json(car_name)
}

function check_gps(driver,dr_route,start){
    const driver_route = dr_route
    let index = 0;
    let index_start = -1
    let index_driver = -1
    for(stop of driver_route.route){
        if (stop.name === driver.current_stop){
            index_driver = index
        }
        if (stop.name === start){
            index_start = index
            if(index_driver >= 0 && index_start >= index_driver) {      //индекс остановки должен быть больше текущей остановки
                return 1
            }
            else{
                return 0
            }   
        }
        index += 1
    }
    // можно реализовать приезд водителя
}
   

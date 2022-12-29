const Stops = require('../models/Stops')        // схема к файлу с остановками начала и возможным концом пути
const Driver_route = require('../models/Driver_routes')     // схема к файлу с маршрутами и остановками на них (+координаты GPS)


// функция для вывода названий всех существующих остановок
module.exports.getAllExistingStops = async function (req, res){     
    try{
        // перебор массива объектов, создание массива по полям _id
        const allStops = (await Stops.find()).map((names) => { return names._id })      
        res.status(201).json(allStops)      // вывод массива с названиями остановок
    } catch (e) {
        res.status(501).json({      // ошибки в серверной части
            message: "Ошибка сервера. Попробуйте снова"
        })
        console.log(e)
    }
}

// функция для вывода массива названий остановок, в которые возможно добрать из текущей
module.exports.getAvailableStopsByName = async function (req, res){    
    try{
        // нахождение нужного объекта, создание массива по полю availableStops
        const allStops = (await Stops.findOne({"_id": req.query._id})).availableStops      
        res.status(201).json(allStops)      // вывод массива с названиями остановок
    } catch (e) {
        res.status(501).json({      // ошибки в серверной части
            message: "Ошибка сервера. Попробуйте снова"
        })
        console.log(e)
    }
}

// функция для вывода всех маршрутов в виде массива
module.exports.getAllRoutes = async function(req, res){        
    try{
        // перебор массива объектов, создание массива по полям _id
        const allStops = (await Driver_route.find(/*{existAuto: true}*/)).map((names) => { return names._id })      
        res.status(201).json(allStops)      // вывод массива с названиями остановок
    } catch (e) {
        res.status(501).json({      // ошибки в серверной части
            message: "Ошибка сервера. Попробуйте снова"
        })
        console.log(e)
    }
}

// функция для вывода массива всех остановок на маршруте
module.exports.getRouteNameByID = async function(req, res) {        
    try{
        // нахождение нужного объекта, выделение объекта с остановками, выделение поля name с занесением в массив
        const allStops = (await Driver_route.findOne({"_id": req.query._id})).route.map(names => { return names.name })      
        res.status(201).json(allStops)      // вывод массива с названиями остановок
    } catch (e) {
        res.status(501).json({      // ошибки в серверной части
            message: "Ошибка сервера. Попробуйте снова"
        })
        console.log(e)
    }
}

// функция для вывода массива всех остановок на маршруте с их координатами
module.exports.getStopsFromRoute = async function(req, res) {        
    try{
        // нахождение нужного объекта, выделение объекта с остановками
        const driver = (await Driver_route.findOne({"_id": req.query._id}))
        if(driver != null){
            console.log(driver.route)
        }  
        else{
            console.log("null")
        }   
        res.status(201).json(allStops)      // вывод массива с названиями остановок
    } catch (e) {
        res.status(501).json({      // ошибки в серверной части
            message: "Ошибка сервера. Попробуйте снова"
        })
        console.log(e)
    }
}

// функция для нахождения подходящих маршрутов по началу и концу пути пассажира
module.exports.getRoutesByStops = async function(req, res) {
    try{
        // поиск в БД по двум элементам (остановкам), получим все маршруты, корорые имеют эти остановки
        const okDrivers = await Driver_route.find({"route.name": {$all: [req.query.start, req.query.stop]}})
        // создаем массив, в котором будем хранить подходящие маршруты
        let sortedDrivers = new Array()
        // фильтр для проверки подходящих маршрутов
        // подбираем маршруты, в которых старт идет раньше финиша
        for(const driver_route of okDrivers){       // перебераю маршруты
            let findStart = false, findStop = false     // флаги для поиска
            for(let i = 0;;i++){        // перебираю остановки на маршруте
                // отмечаю флаг, если остановка начала или конца совпала
                if (driver_route.route[i].name === req.query.start){
                    findStart = true
                    break
                }
                if (driver_route.route[i].name === req.query.stop){
                    findStop = true
                    break
                }
                // если сработало совпадение по остановке, цикл останавливается
                // в итоге отметка стоит в одном из флагов
            }
            // если флаг начала отетился раньше, то это подходящий маршрут
            // если флаг конца засветился раньше, то на этом маршруте мы никуда не доедем (нужен маршрут, обратный этому)
            if (findStart && !findStop){        // проверка пригодности маршрута
                sortedDrivers.push(driver_route._id)        // добавляю маршрут в массив
            }
        }
        // вывожу массив с подходящими маршрутами
        // если маршруты есть, то вывожу "OK"
        // если подходящих маршрутов нет, то вывожу "NO"
        if (sortedDrivers.length > 0){
            res.status(201).json({
                sortedDrivers, 
                message: "OK"
            })
        } else {
            res.status(201).json({
                sortedDrivers, 
                message: "NO"
            })
        }
    } catch (e) {
        res.status(501).json({      // ошибки в серверной части
            message: "Ошибка сервера. Попробуйте снова"
        })
    }
}

// функция для получения координат всех остановок (вывод: массив объектов остановок)
module.exports.getGPSAllStops = async function(req, res) {
    try{
        // перебор массива объектов, создание массива по полям _id
        const allStops = await (await Stops.find()).map((names) => { return names._id })
        // создаю массив для хранения объектов 
        let allStopsWithGPS = new Array()  
        for(const stop of allStops){        // перебираю все остановки
            // нахоже первый маршрут с имеющейся остановкой
            // беру массив с данными остановками
            // отбираю элемент массива по названию остановки
            // остается массив с одним объектом, в котором название и координаты моей остановки
            let nameStops = await (await Driver_route.findOne({"route.name": stop})).route.filter((valueName) => {
                return valueName.name == stop
            })
            // добавляю в массив объект (изымаю объект из массива и перекладываю в общий)
            await allStopsWithGPS.push(nameStops[0])
        }
        res.status(201).json(allStopsWithGPS)
    } catch (e) {
        res.status(501).json({      // ошибки в серверной части
            message: "Ошибка сервера. Попробуйте снова"
        })
        console.log(e)
    }
}

const User = require('../models/User_passenger')        // схема к файлу заявок пассажиров
const CompletedOrders = require('../models/completedOrders')        // схема к файлу с завершенными заявками
const ObjectId = require('mongoose').Types.ObjectId

//\\ сука, кто влезет своими кривыми руками в код - убью


// функция для создания новых заявок, простое занесение активных заявок в файл
module.exports.createOrder = async function (req, res){      
    try{
        // создаю переменную с id пользователя
        var _idUserNewOrser = req.body._id  
        // проверяю наличие корректного id    
        // если пользователь новый, сервер получит _id = "404"
        // сервер подберет новый, и вернент в конце запроса
        if (_idUserNewOrser === "404") {     
            _idUserNewOrser = require('mongoose').Types.ObjectId()
        }
        // создаю новую заявку
        const newUser = new User({      
            _id: _idUserNewOrser,
            start: req.body.start,
            stop: req.body.stop,
            routeID: req.body.routeID,
            waitAuto: true,
        })
        // сохраняю
        await newUser.save()
        res.status(201).json({
            "_id": newUser._id,     // возвращаю _id пользователя/заявки
            message: "Ваша заявка принята"
        })
    } catch (e) {       // ошибки в серверной части
        res.status(501).json({
            message: "Ошибка обработки заявки. Попробуйте снова"
        })
        console.log(e)
    }
}

// функция для получения всех заявок на маршруте
module.exports.getAllOrderByRoute = async function (req, res){
    try{
        // ищу заявки по маршруту, заношу все в объект
        const requests_on_request = await User.find({routeID: req.query.routeID})
        res.status(201).json(requests_on_request)
    } catch (e) {       // ошибки в серверной части
        res.status(501).json({
            message: "Ошибка обработки заявки. Попробуйте снова"
        })
        console.log(e)
    }
}

// функция для получения всех заявок на маршруте
module.exports.getNumberOrderByStopsOnRoute = async function (req, res){
    try{
        // ищу заявки по маршруту, заношу все в объект
        const requests_on_request = (await User.find({routeID: req.query.routeID, start: req.query.start})).length
        res.status(201).json(requests_on_request)
    } catch (e) {       // ошибки в серверной части
        res.status(501).json({
            message: "Ошибка обработки заявки. Попробуйте снова"
        })
        console.log(e)
    }
}

// функция для получения начала и конца пути заявки для маршрута
module.exports.getAllOrderByRoute = async function (req, res){
    try{
        // ищу заявки по маршруту, заношу все в объект
        const requests_on_request = await User.find({routeID: req.query.routeID})
        // массив для хранения данных
        let newArray = new Array()
        // прогоняю все объекты
        for (let key in requests_on_request) {
            // создаю новый объект с определенными полями
            const newObject = new Object({
                start: requests_on_request[key].start,
                stop: requests_on_request[key].stop
            })
            // добавляю в массив созданный объект
            newArray.push(newObject)
        }
        res.status(201).json(newArray)
    } catch (e) {       // ошибки в серверной части
        res.status(501).json({
            message: "Ошибка обработки заявки. Попробуйте снова"
        })
        console.log(e)
    }
}

// функция для отмены заявки (полное удаление из БД)
module.exports.disableOrder = async function(req, res){     
    try{
        // нахожу и удаляю
        if (!(await User.findOneAndDelete({_id: ObjectId(req.body._id)}))){
            // если удаление не произошло
            res.status(404).json({
                message: "Заявка не найдена"
            })
        } else {
            // успешно
            res.status(201).json({
                message: "Заявка была отменена"
            })
        }
    } catch (e) {       // ошибки в серверной части
        res.status(501).json({      
            message: "Ошибка обработки заявки. Попробуйте снова"
        })
        console.log(e)
    }
}

// функция для завершения заявок
// переносим завершенные заявки в новый файл
module.exports.deleteOrder = async function(req, res){     
    try{
        // нахожу нужную заявку по _id
        const candidate = await User.findOne({_id: ObjectId(req.body._id)})        
        if (candidate === null){        // если заявки нет, вернет null
            res.status(404).json({
                message: "Заявка не найдена"
            })
        } else {        // если заявка есть
            const newUser = new CompletedOrders({      // переношу заявку
                _id: candidate._id,
                start: candidate.start,
                stop: candidate.stop,
                routeID: candidate.routeID,
                date: Date(),       // добавляю дату завершения заявки
                waitAuto: false
            })
            // удаляю заявку в файле с активными заявками
            await User.findOneAndDelete({_id: ObjectId(req.body._id)})            
            // сохраняю файл с завершенными заявками
            await newUser.save()
            res.status(201).json({
                "message": "Удаление завершено"
            })
        }
    } catch (e) {       // ошибки в серверной части
        res.status(501).json({      
            message: "Ошибка обработки заявки. Попробуйте снова"
        })
        console.log(e)
    }
}


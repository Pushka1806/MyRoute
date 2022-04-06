const User = require('../models/User_passenger')
const ObjectId = require('mongoose').Types.ObjectId
const CompletedOrders = require('../models/completedOrders')

//\\ сука, кто влезет своими кривыми руками в код - убью

module.exports.getAll = async function (req, res){      // когда-то нужно сделать, но пока не горит

}

module.exports.create = async function (req, res){      // функция для создания новых заявок, простое занесение активных заявок в файл
    var _idUserNewOrser = req.body._id      // создаю переменную с id пользователя

    if (_idUserNewOrser === "404") {     // проверяю наличие корректного id
        _idUserNewOrser = require('mongoose').Types.ObjectId()
    }

    const newUser = new User({      // создаю новую заявку
        _id: _idUserNewOrser,
        start: req.body.start,
        stop: req.body.stop,
        routeID: req.body.routeID,
        waitAuto: true,
    })

    try{        // проверка 
        await newUser.save()
        res.status(201).json({      // успешно
            "_id": newUser._id,
            "message": "Ваша заявка принята"
        })
    } catch (e) {       // если сохранить всё же не удалось, вернём сообщение с ошибкой) мдя...
        res.status(501).json({
            "message": "Ошибка обработки заявки. Попробуйте снова"
        })
        console.log(e)
    }
}


module.exports.disableOrder = async function(req, res){     // теперь представим, что пользователь передумал и отменил заявку
    try{
        await User.findOneAndDelete({_id: ObjectId(req.body._id)})        // удаляю отмененную заявку, она не нужна
        res.status(201).json({
            "message": "Заявка была отменена",
        })
    } catch (e) {       // если сохранить всё же не удалось, вернём сообщение с ошибкой) мдя...
        res.status(404).json({
            "message": "Заявка не найдена",
        })
        console.log(e)
    }
}


module.exports.deleteOrder = async function(req, res){     // переносим завершенные заявки в новый файл
    const candidate = await User.findOne({_id: ObjectId(req.body._id)})        // нахожу, сохраняю, удаляю
    if (candidate === null){
        res.status(404).json({
            "message": "Заявка не найдена",
        })
    } else{
        const newUser = new CompletedOrders({      // переношу заявку
            _id: candidate._id,
            start: candidate.start,
            stop: candidate.stop,
            routeID: candidate.routeID,
            date: Date(),
            waitAuto: false,
        })
        await User.findOneAndDelete({_id: ObjectId(req.body._id)})        // удаляю заявку в файле с активными заявками    
        try{
            await newUser.save()
            res.status(201).json({
                "message": "Удаление завершено",
            })
        } catch (e) {       // если сохранить всё же не удалось, вернём сообщение с ошибкой) мдя...
            res.status(501).json({
                "message": "Ошибка завершения заявки. Попробуйте снова",
            })
            console.log(e)
        }
    }
}


module.exports.getAllOrderByStop = async function (req, res){       // получение всех заявок по id пользователя
    try{
        const requests_on_request = await User.find({routeID: req.body.routeID})        // ищу и заношу в отдельный объект
        res.status(200).json(requests_on_request, {     // куда-то выкидываю
            "message": "Все заявки по маршрутам",
        })
    } catch (e) {       // если сохранить всё же не удалось, вернём сообщение с ошибкой) мдя...
        res.status(500).json({
            "message": "Ошибка",
        })
        console.log(e)
    }
}
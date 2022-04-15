const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/User_driver')
const Driver_route = require('../models/Driver_routes');
const keys = require("../config/keys");

module.exports.login = async function (req, res){       // функция для входа водителя в аккаунт/проверка по паролю
    try{
        const candidate = await User.findOne({"name.login": req.query.login})     // получаю объект водителя
        if (candidate === null){
            res.status(404).json({      // если не нашел водителя
                "message": "Заявка не найдена",
            })
        } else if (candidate.name.password == req.query.password) {       // случай, если нашел
            res.status(201).json({      // пароли совпали
                message: "Введите новый пароль"
            })
        } else {
            res.status(201).json({      // пароли не совпали
                message: "Пароль неверен"
            })
        }
    } catch (e) {
        res.status(501).json({      // ошибки в серверной части
            "message": "Ошибка сервера. Попробуйте снова",
        })
        console.log(e)
    }
}

module.exports.newPassword = async function (req, res){     // функция для смены пароля водителя
    try{
        let candidate = await User.findOne({"name.login": req.query.login})     // получаю объект водителя
        console.log(candidate)
        if (candidate === null){
            res.status(404).json({      // если не нашел водителя
                "message": "Заявка не найдена",
            })
        } else {        // случай, если нашел
            switch (candidate.flag){
                case 0:
                    if (candidate.name.password == req.query.password){        // смена первоначального пароля
                        candidate.flag = 1      // флаг для повторного запроса, означает, что готово к смене пароля
                        await candidate.save()        // сохранение 
                        res.status(201).json({
                            message: "Введите новый пароль"
                        })
                    } else {     // если первоначальный пароль неверен
                        res.status(201).json({
                            message: "Пароль неверен"
                        })
                    }
                    break
                
                case 1:
                    if (candidate.name.password != req.query.password){        // смена пароля, который был уже изменен
                        candidate.flag = 2      // флаг, что пароль изменен и не соответствует первоначальному
                        candidate.name.password = req.query.password      // смена пароля в БД
                        await candidate.save()        // сохранение
                        res.status(201).json({
                            message: "Пароль изменен"
                        })
                    } else {     // если пароль не совпал со старым
                        res.status(201).json({
                            message: "Это старый пароль, попробуйте еще раз"
                        })
                    }
                    break
                
                case 2:
                    if (candidate.name.password == req.query.password){        // смена пароля, который был уже изменен
                        candidate.flag = 1      // флаг для повторного запроса, означает, что готово к смене пароля
                        await candidate.save()        // сохранение
                        res.status(201).json({
                            message: "Введите новый пароль"
                        })
                    } else {     // если пароль не совпал со старым
                        res.status(201).json({
                            message: "Пароль неверен"
                        })
                    }
                    break
            }
        }
    } catch (e) {
        res.status(501).json({      // ошибки в серверной части
            "message": "Ошибка сервера. Попробуйте снова",
        })
        console.log(e)
    }
}

// module.exports.register = async function (req, res){
//     //нам придут email и password
//     //нужно отслеживать уникальность email
//     const candidate = await  User.findOne({email: req.body.email});

//     if(candidate){
//         //если нашли уже сущ. пользователя - вернем ошибку
//         res.status(201).json({
//             message: 'Пользователь с таким email уже зарегестрирован.'
//         })
//     } else{
//         //если он новый, то создаем его
//         const salt = bcrypt.genSaltSync(10);
//         const password = req.body.password;
//         const user = new User({
//             email: req.body.email,
//             password: bcrypt.hashSync(password, salt)
//         })
//         try {
//             await user.save()
//             res.status(201).json(user)
//         } catch (e){
//             //Обработать ошибку
//             console.log(e);
//         }

//     }
// }

module.exports.driverGetInfo = async function (req, res){
    const candidate = await User.findOne({"name.login": req.query.login})
    if(candidate){
        res.status(200).json(candidate);
    }
    else{
        res.status(201).json("Водитель не найден");
    }
        
}

module.exports.driverGetRouteById = async function(req, res) {
    //тут мы нашли общий объект
    const RouteById = await Driver_route.findOne({_id: req.query._id});
    //взяли из него этот самый массив с кучей "подобъектов"
    const RouteArray = RouteById.route;
    res.status(200).json(RouteArray);
}

module.exports.plusOne = async function (req,res){
    const candidate = await User.findOne({"name.login": req.query.login});
    if(candidate){
        candidate.quanPassengers = candidate.quanPassengers + 1;
        candidate.save();
        res.status(200).json({message:"Пассажир добавлен"})
    }
    else{
        res.status(201).json({message:"Водитель не найден"});
    } 
}

module.exports.minusOne = async function (req,res){
    const candidate = await User.findOne({"name.login": req.query.login});
    if (candidate){
        candidate.quanPassengers = candidate.quanPassengers - 1;
        candidate.save();
        res.status(200).json({message:"Пассажир удален"})
    }
    else{
        res.status(201).json({message:"Водитель не найден"});
    } 
}

module.exports.deletePassengers = async function (req,res){
    const candidate = await User.findOne({"name.login": req.query.login});
    if (candidate){
        ccandidate.quanPassengers = 0;
        candidate.save();
        res.status(200).json({message: "Пассажиры обнулены"})
    }
    else{
        res.status(201).json({message:"Водитель не найден"});
    } 
}

// все что выше больно трогать

module.exports.getWorkAuto = async function (req, res){      // функция для изменения флага в записи водителя
    if (!(await User.findOneAndUpdate({"name.login": req.query.login}, { $set: {"workAuto": req.query.workAuto}})) ){      // находит и изменяет данные
        res.status(404).json({
            "message": "Запись не найдена",
        })
    } else{
        try{
            res.status(201).json({      // если все хорошо
                "message": "Флаг изменен",
            })
        } catch (e){       // если сохранить всё же не удалось, вернём сообщение с ошибкой) мдя...
            res.status(501).json({
                "message": "Ошибка сервера",
            })
            console.log(e)
        }
    }
}

module.exports.editGPSDriver = async function(req, res){     // изменение данных GPS по логину водителя
    if (!(await User.findOneAndUpdate({"name.login": req.query.login}, {"gps.latitude": req.query.latitude, "gps.longitude": req.query.longitude}))){      // находит и изменяет данные
        res.status(404).json({      // если заявка не найдена, перекинет сюда. появится ошибка о ненахождении записи
            "message": "Запись не найдена",
        })
    } else{   
        try{        // обработчик ошибок
            res.status(201).json({      // если все хорошо
                "message": "GPS данные обновлены",
            })
        } catch (e) {       // если сохранить всё же не удалось, вернём сообщение с ошибкой) мдя...
            res.status(501).json({
                "message": "Ошибка изменения данных. Попробуйте снова",
            })
            console.log(e)
        }
    }
}

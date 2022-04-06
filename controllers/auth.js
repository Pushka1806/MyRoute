const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/User_driver')
const Driver_route = require('../models/Driver_routes');
const keys = require("../config/keys");

module.exports.login = async function (req, res){
    const candidate = await User.findOne({"_id.login": req.body.login})
    if(candidate){
        //нашли - проверяем пароль
     
//         const passwordResult = bcrypt.compareSync(req.body.login, candidate._id.login);
//         passwordResylt = alert(req.body.login, candidate._id.login);
        if(req.body.password == candidate._id.password || candidate.flag == 1 ){
            //гененируем токен, т.к. пароль правильный
            //const token = jsonwebtoken.sign({
            //    login: candidate.login,
            //    userid: candidate._id
            //}, keys.jwt, {expiresIn: 60 * 60})
            if(candidate.flag == 0){
                 candidate.flag = 1;
                 candidate.save();
                res.status(200).json({
                message: "Введите новый пароль"
                })
            }
            else if(candidate.flag == 1){
                if(candidate._id.password != req.body.password){
                     candidate.flag = 2;
                     candidate._id.password = req.body.password;
                     candidate.save();
                    res.status(200).json({
                        message:"OK"})
//                     message: "Пароль изменён"})
                }
                else{
                    res.status(201).json({
                        message: "Это старый пароль"
                     })
                }
            }
            else{    
                res.status(200).json({
                    message: "OK"
                })
            }
        }
        else{
            //пароли не совпали
            res.status(201).json({
                message: "Неверный пароль"
            })
        }
    } else{
        //если не нашли пользователя
        res.status(201).json({
            message: "Пользователь не найден"
        })
    }
}

module.exports.register = async function (req, res){
    //нам придут email и password
    //нужно отслеживать уникальность email
    const candidate = await  User.findOne({email: req.body.email});

    if(candidate){
        //если нашли уже сущ. пользователя - вернем ошибку
        res.status(201).json({
            message: 'Пользователь с таким email уже зарегестрирован.'
        })
    } else{
        //если он новый, то создаем его
        const salt = bcrypt.genSaltSync(10);
        const password = req.body.password;
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })
        try {
            await user.save()
            res.status(201).json(user)
        } catch (e){
            //Обработать ошибку
            console.log(e);
        }

    }
}
module.exports.driverGetInfo = async function (req, res){
    const candidate = await User.findOne({"_id.login": req.query.login})
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
    const candidate = await User.findOne({"_id.login": req.query.login});
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
    const candidate = await User.findOne({"_id.login": req.query.login});
    if(candidate){
       candidate.quanPassengers = candidate.quanPassengers - 1;
       candidate.save();
        res.status(200).json({message:"Пассажир удален"})
    }
    else{
        res.status(201).json({message:"Водитель не найден"});
    } 
}
module.exports.deletePassengers = async function (req,res){
    const candidate = await User.findOne({"_id.login": req.query.login});
    if(candidate){
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
    if (!(await User.findOneAndUpdate({"_id.login": req.body.login}, { $set: {"flag": req.body.flag}})) ){      // находит и изменяет данные
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
    if (!(await User.findOneAndUpdate({"_id.login": req.body.login}, {"gps": req.body.gps}))){      // находит и изменяет данные
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

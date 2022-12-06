const driverUser = require('../models/User_driver')     // схема к файлу с данными водителей

// все готово
// из пожеланий, нужно переделать все под id вместо login
// функции по изменению количества пассажиров необходимо пересмотреть, если идет несколько запросов в одно время

// вырезал register 
// выкинул driverGetRouteById, в файле stops есть его аналог

module.exports.login = async function (req, res){
     const newDriver = new User_driver({      
            _id: req.body.name,
            flag:0,
            routeID: req.body.car,
            route_work:"none",
            current_stop: "none",
            quanPassengers: 0,
            workAuto: true
        })
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



// функция для входа водителя в аккаунт/проверка по паролю
module.exports.login = async function (req, res){       
    try{
        // нахожу запись водителя по его логину (номеру маршрутки)
        const candidate = await driverUser.findOne({"name.login": req.body.login})
        if (candidate === null){        // если записи нет, вернет null
            res.status(404).json({      // если не нашел водителя
                message: "Запись не найдена"
            })
        } else if (candidate.name.password == req.body.password) {       // проверка пароля
            res.status(201).json({      // пароли совпали
                message: "Пароль верный"
            })
        } else {
            res.status(201).json({      // пароли не совпали
                message: "Пароль неверен"
            })
        }
    } catch (e) {
        res.status(501).json({      // ошибки в серверной части
            message: "Ошибка сервера. Попробуйте снова"
        })
        console.log(e)
    }
}

// функция для смены пароля водителя
/*
происходит в два этапа:
1) идет проверка старого пароля. если пароли совпали переводит флаг в значение "1" (запись готова к смене пароля)
2) ввод нового пароля. флаг переводится в значение "2" (пароль изменен и не сооьветствует первоначальному)
флаг "0" сигнализирует, что пароль начальный (его необходимо сменить)
*/
module.exports.newPassword = async function (req, res){     
    try{
        // нахожу запись водителя по его логину (номеру маршрутки)
        let candidate = await driverUser.findOne({"name.login": req.query.login})
        if (candidate === null){        // если записи нет, вернет null
            res.status(404).json({      // если не нашел водителя
                message: "Запись не найдена"
            })
        } else {        // случай, если нашел
            // произвоже проверку флага
            switch (candidate.flag){
                // смена первоначального пароля (об этом указывает флаг "0")
                // простая смена флага для смены пароля
                case 0:     
                    // проверка пароля, заданного при занесении маршрутки в БД
                    if (candidate.name.password == req.query.password){
                        // флаг для повторного запроса, означает, что готово к смене пароля
                        candidate.flag = 1      
                        await candidate.save()        // сохранение 
                        // запрос на новый пароль
                        res.status(201).json({
                            message: "Введите новый пароль"
                        })
                    } else {     
                        // если первоначальный пароль неверен
                        res.status(201).json({
                            message: "Пароль неверен"
                        })
                    }
                    break
                
                // непосредственно смена пароля, смена флага на значение "2"
                case 1:
                    // проверка на старый пароль
                    if (candidate.name.password != req.query.password){
                        // флаг, что пароль изменен и не соответствует первоначальному
                        candidate.flag = 2      
                        // смена пароля в БД
                        candidate.name.password = req.query.password      
                        await candidate.save()        // сохранение
                        res.status(201).json({
                            message: "Пароль изменен"
                        })
                    } else {     
                        // если пароль совпал со старым
                        res.status(201).json({
                            message: "Это старый пароль, попробуйте еще раз"
                        })
                    }
                    break
                
                // смена пароля, который был уже изменен ранее
                // простая смена флага для смены пароля
                case 2:
                    // проверка пароля
                    if (candidate.name.password == req.query.password){
                        // флаг для повторного запроса, означает, что готово к смене пароля
                        candidate.flag = 1      
                        await candidate.save()        // сохранение
                        // запрос на новый пароль
                        res.status(201).json({
                            message: "Введите новый пароль"
                        })
                    } else {     
                        // если пароль не совпал со старым
                        res.status(201).json({
                            message: "Пароль неверен"
                        })
                    }
                    break
            }
        }
    } catch (e) {
        res.status(501).json({      // ошибки в серверной части
            message: "Ошибка сервера. Попробуйте снова"
        })
        console.log(e)
    }
}

// функция для получения массива маршрута следования для машины
module.exports.getDriverRouterID = async function (req, res){       
    try{
        // нашли запись по логину, выделили массив с маршрутами
        const candidate = (await driverUser.findOne({"name.login": req.query.login})).routeID      
        if (candidate === null){        // если записи нет, вернет null
            res.status(404).json({
                message: "Запись не найдена"
            })
        } else {
            // если найдет запись, возвращает массив с маршрутами
            res.status(201).json(candidate)
        }
    } catch(e) {
        res.status(501).json({      // ошибки в серверной части
            message: "Ошибка сервера. Попробуйте снова"
        })
        console.log(e)
    }
}

// функция для добавления одного пассажира в запись водителя (поштучно!)
module.exports.plusOne = async function (req,res){      
    try{
        // нашли по логину запись водителя
        let candidate = await driverUser.findOne({"name.login": req.query.login})       
        if (candidate === null){        // если записи нет, вернет null
            res.status(404).json({
                message: "Запись не найдена"
            })
        } else {
            // добавляю пассажира в запись (+1 к общему количеству)
            candidate.quanPassengers++      
            await candidate.save()      // сохраняю
            res.status(201).json({      // все ок, если ок
                message: "Пассажир добавлен"
            })
        }
    } catch(e) {
        res.status(501).json({      // ошибки в серверной части
            message: "Ошибка сервера. Попробуйте снова"
        })
        console.log(e)
    }
}

// функция для вычитания одного пассажира в запись водителя (поштучно!)
module.exports.minusOne = async function (req,res){     
    try{
        // нашли по логину запись водителя
        let candidate = await driverUser.findOne({"name.login": req.query.login})       
        if (candidate === null){        // если записи нет, вернет null
            res.status(404).json({
                message: "Запись не найдена"
            })
        } else {
            // отнимаю пассажира из записи (-1 от общего количества)
            candidate.quanPassengers--      
            await candidate.save()      // сохраняю
            res.status(201).json({      // все ок, если ок
                message: "Пассажир вычтен"
            })
        }
    } catch(e) {
        res.status(501).json({      // ошибки в серверной части
            message: "Ошибка сервера. Попробуйте снова"
        })
        console.log(e)
    }
}

// функция для обнуление количества пассажиров в записи водителя по логину
module.exports.deletePassengers = async function (req,res){     
    try{
        // нашли по логину запись водителя
        let candidate = await driverUser.findOne({"name.login": req.query.login})       
        if (candidate === null){        // если записи нет, вернет null
            res.status(404).json({
                message: "Запись не найдена"
            })
        } else {
            // обнуляю пассажиров у водителя
            candidate.quanPassengers = 0      
            await candidate.save()      // сохраняю
            res.status(201).json({      // все ок, если ок
                message: "Количество пассажиров обнулено"
            })
        }
    } catch(e) {
        res.status(501).json({      // ошибки в серверной части
            message: "Ошибка сервера. Попробуйте снова"
        })
        console.log(e)
    } 
}

// функция для изменения флага в записи водителя
module.exports.setWorkAuto = async function (req, res){      
    try{
        // нахожу запись, меняю флаг
        if (!(await driverUser.findOneAndUpdate({"name.login": req.query.login}, { $set: {"workAuto": req.query.workAuto}}))){
            res.status(404).json({      // если не нашел водителя
                message: "Запись не найдена"
            })
        } else {
            res.status(201).json({      // все ок, если ок
                message: "Флаг изменен"
            })
        }
    } catch(e) {
        res.status(501).json({      // ошибки в серверной части
            message: "Ошибка сервера. Попробуйте снова"
        })
        console.log(e)
    }
}

// функция для изменения данных GPS по логину водителя
module.exports.setGPSDriver = async function(req, res){     
    try{
        // нахожу запись, меняю поля координат
        if (!(await driverUser.findOneAndUpdate({"name.login": req.query.login}, {"gps.latitude": req.query.latitude, "gps.longitude": req.query.longitude}))){        
            res.status(404).json({      // если не нашел водителя
                message: "Запись не найдена"
            })
        } else {
            res.status(201).json({      // все ок, если ок
                message: "GPS данные обновлены"
            })
        }
    } catch(e) {
        res.status(501).json({      // ошибки в серверной части
            message: "Ошибка сервера. Попробуйте снова"
        })
        console.log(e)
    }
}

// функция для обнуления записи водителя
module.exports.resetDriver = async function (req,res){      
    try{
        // нашли по логину запись водителя
        let candidate = await driverUser.findOne({"name.login": req.query.login})       
        if (candidate === null){        
            res.status(404).json({
                message: "Запись не найдена"
            })
        } else {
            // обнуляю данные:
            //  -маршрутов следования
            //  -маршрута работы
            //  -следующей остановки
            //  -количества пассажиров
            //  -флага работы маршрутки
            candidate.route_work = ""
            candidate.current_stop = ""
            candidate.quanPassengers = 0
            candidate.workAuto = false
            await candidate.save()      // сохраняю
            res.status(201).json({      // все ок, если ок
                message: "Данные обнулены"
            })
        }
    } catch(e) {
        res.status(501).json({      // ошибки в серверной части
            message: "Ошибка сервера. Попробуйте снова"
        })
        console.log(e)
    }
}

// функция для получения "флага пароля" водителя
module.exports.getDriverFlag = async function (req, res){       
    try{
        // нашли запись по логину, выделили массив с маршрутами
        const candidate = (await driverUser.findOne({"name.login": req.query.login})).flag       
        if (candidate === null){        // если записи нет, вернет null
            res.status(404).json({
                message: "Запись не найдена"
            })
        } else {
            // если найдет запись, возвращает флаг
            res.status(201).json(candidate)
        }
    } catch(e) {
        res.status(501).json({      // ошибки в серверной части
            message: "Ошибка сервера. Попробуйте снова"
        })
        console.log(e)
    }
}

// функция для принудительноой смены "флага пароля" водителя
module.exports.setDriverFlag = async function (req, res){       
    try{
        // нашли запись по логину, выделили массив с маршрутами
        var candidate = await driverUser.findOne({"name.login": req.query.login})      
        if (candidate === null){        // если записи нет, вернет null
            res.status(404).json({
                message: "Запись не найдена"
            })
        } else {
            // меняю флаг
            candidate.flag = req.query.flag
            await candidate.save()      // сохраняю
            res.status(201).json({      // все ок, если ок
                massage: "Флаг изменен"
            })
        }
    } catch(e) {
        res.status(501).json({      // ошибки в серверной части
            message: "Ошибка сервера. Попробуйте снова"
        })
        console.log(e)
    }
}

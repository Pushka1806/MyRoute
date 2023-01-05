const route_model = require('../models/Driver_routes')



module.exports.getAllById = function (req, res){
   
}

module.exports.getStopsByRouteStart = function (req, res) {
    res.status(201).json("aboba")
    console.log("aboba")
    try {
        //const route = (await route_model.findOne({ "_id": req.query.route }))
        //let startPoint = false
        //let availableStops = new Array()
        //for (let stop of route.route) {
        //    while (startPoint != true) {
        //        if (stop === req.query.start) {
        //            startPoint = true
        //        }
        //        else {
        //            continue
        //        }
        //    }
        //    availableStops.push(stop)
        //}
        //res.status(201).json(availableStops)
    } catch (e) {
        res.status(501).json({      // ошибки в серверной части
            message: "Ошибка сервера. Попробуйте снова"
        })
        console.log(e)
    }

}

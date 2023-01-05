const Driver_route = require('../models/Driver_routes')



module.exports.getAllById = function (req, res){
   res.status(201).json("OK")
}

module.exports.getStopsByRouteStart = function (req, res){
   try {
        const route = await Driver_route.findOne({ "_id": req.query.route })
        let startPoint = false
        let availableStops = new Array()
        for (let stop of route.route) {
            while (startPoint != true) {
                if (stop === req.query.start) {
                    startPoint = true
                }
                else {
                    continue
                }
            }
            availableStops.push(stop)
        }
        res.status(201).json(availableStops)
    } catch (e) {
        res.status(501).json({      // ошибки в серверной части
            message: "Ошибка сервера. Попробуйте снова"
        })
        console.log(e)
    }

}

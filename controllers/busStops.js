const routes = require('../models/Driver_routes')

module.exports.getStopsByRouteStart =  async function (req, res) {
    const allStops = await routes.findOne({ "_id": req.query.route })
    let startPoint = false
    let availableStops = new Array()
    for (let stop of allStops.route) {
        if (stop.name === req.query.start) {
            startPoint = true
        }
        if (startPoint) {
            availableStops.push(stop)
        }
    }
    res.status(201).json(availableStops)
    
}

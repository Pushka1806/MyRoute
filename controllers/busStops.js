const routes = require('../models/Driver_routes')

module.exports.getStopsByRouteStart =  async function (req, res) {
    const allStops = await routes.findOne({ "_id": req.query.route })
    let startPoint = false
    let availableStops = new Array()
    for (let stop of allStops.route) {
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
    
}

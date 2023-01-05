const routes = require('../models/Driver_routes')

module.exports.getStopsByRouteStart =  async function (req, res) {
    const availableStops = await routes.findOne({ "_id": req.query.route })
    res.status(201).json(availableStops)
}

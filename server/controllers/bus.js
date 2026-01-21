const { Bus, BusLocation, BusRoute } = require('../models/Bus');

// @desc    Update Bus Location (Simulated by Sensor/Driver App)
// @route   POST /api/bus/location
// @access  Public (protected by API Key ideally, or Admin)
exports.updateBusLocation = async (req, res, next) => {
    try {
        const { busNumber, lat, lng, speed, deviceId } = req.body;

        // Verify deviceId match
        const bus = await Bus.findOne({ busNumber, deviceId });
        if (!bus) return res.status(404).json({ success: false, message: 'Bus/Device not found' });

        const location = await BusLocation.create({
            bus: bus._id,
            lat,
            lng,
            speed
        });

        // TODO: Emit Socket Event 'busLocationUpdate'

        res.status(200).json({ success: true, data: location });
    } catch (err) {
        next(err);
    }
};

// @desc    Get All Live Buses
// @route   GET /api/bus/live
// @access  Private
exports.getLiveBusLocations = async (req, res, next) => {
    try {
        // Get latest location for each bus
        // Aggregation is best here, or just query all buses and find latest loc.
        // Optimization: Store lastLocation ref in Bus model, but for now:
        const buses = await Bus.find().populate('route');

        const liveData = await Promise.all(buses.map(async (bus) => {
            const lastLoc = await BusLocation.findOne({ bus: bus._id }).sort({ timestamp: -1 });
            return {
                bus,
                location: lastLoc
            };
        }));

        res.status(200).json({ success: true, data: liveData });
    } catch (err) {
        next(err);
    }
};

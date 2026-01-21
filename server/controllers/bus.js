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
        const buses = await Bus.find();

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

// @desc    Add a new bus
// @route   POST /api/bus
// @access  Private (Admin)
exports.createBus = async (req, res, next) => {
    try {
        const { busNumber, driverName, route, capacity, deviceId } = req.body;
        const bus = await Bus.create({ busNumber, driverName, route, capacity, deviceId });

        // Create initial default location so it appears on map immediately
        // Default Lat/Lng (Trivandrum)
        await BusLocation.create({
            bus: bus._id,
            lat: 8.5241,
            lng: 76.9366,
            speed: 0
        });

        res.status(201).json({ success: true, data: bus });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all buses (Management view)
// @route   GET /api/bus
// @access  Private (Admin)
exports.getBuses = async (req, res, next) => {
    try {
        const buses = await Bus.find();
        res.status(200).json({ success: true, data: buses });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a bus
// @route   DELETE /api/bus/:id
// @access  Private (Admin)
exports.deleteBus = async (req, res, next) => {
    try {
        const bus = await Bus.findById(req.params.id);
        if (!bus) return res.status(404).json({ success: false, message: 'Bus not found' });

        await bus.deleteOne();
        await BusLocation.deleteMany({ bus: bus._id }); // Cleanup locations

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

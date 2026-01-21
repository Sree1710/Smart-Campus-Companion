const mongoose = require('mongoose');

// Bus Route Schema
const BusRouteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    stops: [{
        name: String,
        lat: Number,
        lng: Number,
        estimatedTime: String
    }]
});

const BusRoute = mongoose.model('BusRoute', BusRouteSchema);

// Bus Schema
const BusSchema = new mongoose.Schema({
    busNumber: { type: String, required: true, unique: true },
    driverName: String,
    driverPhone: String,
    route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BusRoute'
    },
    deviceId: { type: String, required: true, unique: true } // For matching sensor data
});

const Bus = mongoose.model('Bus', BusSchema);

// Bus Location Schema (Time Series ideal, but standard collection for now)
const BusLocationSchema = new mongoose.Schema({
    bus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: true
    },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    speed: Number, // km/h
    timestamp: {
        type: Date,
        default: Date.now,
        expires: 86400 // TTL index: auto delete after 24 hours
    }
});

const BusLocation = mongoose.model('BusLocation', BusLocationSchema);

module.exports = { Bus, BusRoute, BusLocation };

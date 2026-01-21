const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { Bus, BusLocation } = require('./models/Bus');

dotenv.config({ path: path.join(__dirname, '.env') });
mongoose.connect(process.env.MONGO_URI);

const simulate = async () => {
    try {
        console.log("--- SIMULATING BUS MOVEMENTS ---");
        const buses = await Bus.find();

        if (buses.length === 0) {
            console.log("No buses found to simulate. Create a bus in Admin panel first.");
            process.exit();
        }

        // Simulating locations around Trivandrum (approx)
        const baseLat = 8.5061;
        const baseLng = 76.9531;

        for (let i = 0; i < buses.length; i++) {
            const bus = buses[i];
            const lat = baseLat + (Math.random() * 0.05 - 0.025);
            const lng = baseLng + (Math.random() * 0.05 - 0.025);

            console.log(`Updating Bus ${bus.busNumber} to [${lat}, ${lng}]`);

            await BusLocation.create({
                bus: bus._id,
                lat,
                lng,
                speed: Math.floor(Math.random() * 60)
            });
        }

        console.log("Simulation complete. Check map.");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

simulate();

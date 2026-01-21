const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('./models/User');
const { Bus, BusLocation } = require('./models/Bus');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

mongoose.connect(process.env.MONGO_URI);

const users = [
    {
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'password123',
        role: 'admin'
    },
    {
        name: 'Student User',
        email: 'student@test.com',
        password: 'password123',
        role: 'student',
        studentDetails: {
            rollNumber: 'CS101',
            branch: 'CSE',
            batch: '2023-2027'
        }
    }
];

const buses = [
    {
        busNumber: 'BUS-01',
        driverName: 'Ramesh Kumar',
        driverPhone: '9876543210',
        route: 'City Center to Campus',
        capacity: 50
    },
    {
        busNumber: 'BUS-02',
        driverName: 'Suresh Singh',
        driverPhone: '9876543211',
        route: 'Station to Campus',
        capacity: 40
    }
];

const importData = async () => {
    try {
        await User.deleteMany();
        await Bus.deleteMany();
        await BusLocation.deleteMany();

        await User.create(users);
        const createdBuses = await Bus.create(buses);

        // Seed initial locations
        const locations = [
            {
                bus: createdBuses[0]._id,
                lat: 8.5241, 
                lng: 76.9366,
                speed: 40
            },
            {
                bus: createdBuses[1]._id,
                lat: 8.5291, 
                lng: 76.9400,
                speed: 35
            }
        ];
        
        await BusLocation.create(locations);

        console.log('Data Imported...'.green.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const deleteData = async () => {
    try {
        await User.deleteMany();
        await Bus.deleteMany();
        await BusLocation.deleteMany();

        console.log('Data Destroyed...'.red.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    deleteData();
} else {
    importData();
}

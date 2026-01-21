const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('./models/User');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected`.green);

        const users = await User.find({});
        console.log(`Found ${users.length} users`.cyan);
        users.forEach(u => {
            console.log(`- ${u.name} (${u.role}): ${u.email}`);
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkData();

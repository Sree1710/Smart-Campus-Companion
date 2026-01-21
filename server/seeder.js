const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('./models/User');
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
        name: 'Teacher One',
        email: 'teacher@test.com',
        password: 'password123',
        role: 'teacher',
        teacherDetails: {
            department: 'Computer Science',
            designation: 'HOD'
        }
    },
    {
        name: 'Student One',
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

const importData = async () => {
    try {
        await User.deleteMany();

        await User.create(users);

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

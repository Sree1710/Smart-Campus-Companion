const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Class = require('./models/Class');
const User = require('./models/User');
const Subject = require('./models/Subject');

dotenv.config({ path: path.join(__dirname, '.env') });
mongoose.connect(process.env.MONGO_URI);

const debug = async () => {
    try {
        console.log("--- DEBUGGING CLASSES ---");
        const classes = await Class.find().populate('students');

        if (classes.length === 0) console.log("No classes found.");

        for (const cls of classes) {
            console.log(`\nClass ID: ${cls._id}`);
            console.log(`Name: '${cls.name}'`); // Quotes to see whitespace
            console.log(`Student Count: ${cls.students.length}`);
            cls.students.forEach(s => console.log(` - Student: ${s.name} (${s.email})`));

            // Find subjects linked to this class
            const subjects = await Subject.find({ class: cls._id }).populate('teacher');
            console.log(`Linked Subjects:`);
            subjects.forEach(sub => console.log(` - ${sub.name} (${sub.code}) by ${sub.teacher?.name}`));
        }

        console.log("\n-------------------------");

        // Also check if any students have 'mca' in their details but aren't linked
        const orphaned = await User.find({ role: 'student' });
        console.log("\n--- CHECKING ALL STUDENTS ---");
        orphaned.forEach(s => {
            console.log(`Student: ${s.name} (${s.email}) - Rol: ${s.studentDetails?.rollNumber} - ClassName: '${s.studentDetails?.className}' (Note: this field might not be in DB unless we saved it extra)`);
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debug();

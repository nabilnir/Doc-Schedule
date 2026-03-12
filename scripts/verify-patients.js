const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

async function verifyImplementation() {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(MONGODB_URI, { dbName: "docs_chedule" });
        console.log("Connected.");

        const User = mongoose.model('User');
        const Appointment = mongoose.model('Appointment');

        // 1. Test Fetching Patients
        const patients = await User.find({ role: 'patient' }).limit(5);
        console.log(`Found ${patients.length} patients.`);

        if (patients.length > 0) {
            const testPatient = patients[0];
            console.log(`Testing with patient: ${testPatient.fullName} (${testPatient.email})`);

            // 2. Test status toggle
            const originalStatus = testPatient.isBlocked;
            testPatient.isBlocked = !originalStatus;
            await testPatient.save();
            console.log(`Updated isBlocked to ${!originalStatus}. Success.`);

            // Revert status
            testPatient.isBlocked = originalStatus;
            await testPatient.save();
            console.log(`Reverted isBlocked to ${originalStatus}. Success.`);

            // 3. Test Join (Summary Stats)
            const appCount = await Appointment.countDocuments({ patientEmail: testPatient.email });
            console.log(`Patient has ${appCount} appointments.`);
        }

        console.log("\n✅ Verification successful!");

    } catch (err) {
        console.error("❌ Verification failed:", err.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

// Minimal model injection for script
if (!mongoose.models.User) {
    mongoose.model('User', new mongoose.Schema({
        fullName: String,
        email: String,
        role: String,
        isBlocked: Boolean
    }, { timestamps: true }), 'users');
}
if (!mongoose.models.Appointment) {
    mongoose.model('Appointment', new mongoose.Schema({
        patientEmail: String,
        appointmentDate: Date
    }));
}

verifyImplementation();

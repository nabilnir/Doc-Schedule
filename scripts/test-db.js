const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
    try {
        console.log("Connecting with URI:", MONGODB_URI);
        await mongoose.connect(MONGODB_URI, {
            dbName: "docs_chedule"
        });

        console.log("Connected successfully");
        console.log("Database Name:", mongoose.connection.name);

    } catch (err) {
        console.error("❌ Connection failed:", err.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

testConnection();

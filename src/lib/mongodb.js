import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is undefined!");
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}


// Global cache (hot reload safe)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Already connected
  if (cached.conn) {
    if (mongoose.connection.name === "test") {
      console.warn("⚠️ Cached connection is using 'test' database. Dropping and reconnecting...");
      cached.conn = null;
      cached.promise = null;
    } else {
      console.log("✅ MongoDB already connected to:", mongoose.connection.name);
      return cached.conn;
    }
  }

  try {
    if (!cached.promise) {
      cached.promise = mongoose
        .connect(MONGODB_URI, {
          bufferCommands: false,
          dbName: "docs_chedule"
        })
        .then((mongooseInstance) => {
          console.log("MongoDB connected successfully");
          const currentDB = mongooseInstance.connection.name;
          console.log("DB Name:", currentDB);

          if (currentDB === 'test') {
            console.warn("⚠️ WARNING: Connected to 'test' database instead of 'docs_chedule'!");
          }
          return mongooseInstance;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  }
}

export default connectDB;
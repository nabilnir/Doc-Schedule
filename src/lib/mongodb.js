import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
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
    console.log("✅ MongoDB already connected");
    return cached.conn;
  }

  try {
    if (!cached.promise) {
      cached.promise = mongoose
        .connect(MONGODB_URI, { bufferCommands: false })
        .then((mongooseInstance) => {
          console.log("🔥 MongoDB connected successfully");
          console.log("📦 DB Name:", mongooseInstance.connection.name);
          console.log("🔗 Ready State:", mongooseInstance.connection.readyState); // should be 1
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
// lib/mongodb.js
import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    // যদি অলরেডি কানেক্ট করা থাকে, তাহলে নতুন করে কানেক্ট করার দরকার নেই
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection.asPromise();
    }

    // কানেকশন লজিক (এখানে dbName যোগ করা হয়েছে)
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.NEXT_MONGODB_NAME, // 'docs_chedule' ডাটাবেস সিলেক্ট করবে
    });

    console.log(`Connected to MongoDB Database: ${process.env.NEXT_MONGODB_NAME}`);
    
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
  }
};
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String },
    role: { type: String, enum: ["patient", "doctor"], default: "patient" },
    image: { type: String },
    provider: { type: String, enum: ["credentials", "google", "github"], default: "credentials" },
    firebaseUid: { type: String },
    otp: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
}, { timestamps: true });

// Please keep the comparePassword method for the login process.
UserSchema.methods.comparePassword = async function (inputPassword) {
    if (!this.password) return false;
    return bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
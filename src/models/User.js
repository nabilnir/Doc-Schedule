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
    resetOtp: { type: String, default: null },
    resetOtpExpires: { type: Date, default: null },
}, { timestamps: true });

UserSchema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) return;
    this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (inputPassword) {
    if (!this.password) return false;
    return bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
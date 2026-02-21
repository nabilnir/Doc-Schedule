import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            // nullable for OAuth users (Google / GitHub)
        },
        role: {
            type: String,
            enum: ["patient", "doctor"],
            default: "patient",
        },
        image: {
            type: String,
        },
        // For OAuth users: store provider info
        provider: {
            type: String,
            enum: ["credentials", "google", "github"],
            default: "credentials",
        },
        firebaseUid: {
            type: String,
        },
    },
    { timestamps: true }
);

// Hash password before saving (only if it was modified)
UserSchema.pre("save", function (next) {
    if (!this.isModified("password") || !this.password) return next();

    bcrypt.hash(this.password, 10, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = async function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;

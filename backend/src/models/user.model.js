import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        displayName: String,
        avatar: String,
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
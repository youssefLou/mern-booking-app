import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface UserType extends Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

const userSchema: Schema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
});

userSchema.pre<UserType>("save", async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next(); 
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;

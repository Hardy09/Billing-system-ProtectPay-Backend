"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
exports.UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    balance: { type: Number, required: true },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        postCode: { type: Number, required: true }
    }
});
// export const User =  mongoose.model<IUser>('User', UserSchema);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingSchema = void 0;
const mongoose_1 = require("mongoose");
exports.BillingSchema = new mongoose_1.Schema({
    billingType: { type: String, required: true },
    amount: { type: Number, required: true },
    userId: { type: String, required: true },
    date: { type: String, required: true },
});
//export const BillingStruct =  mongoose.model<BillingInterface>('Billing', UserSchema);

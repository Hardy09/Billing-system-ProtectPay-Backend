import mongoose, {Schema, Document} from 'mongoose';

export interface BillingInterface extends Document {
    billingType : string;
    amount: number;
    userId : string;
    date : string;
}


export const BillingSchema: Schema = new Schema({
    billingType : {type: String, required: true},
    amount : {type: Number, required: true},
    userId : {type: String, required: true},
    date : {type: String, required: true},
});

//export const BillingStruct =  mongoose.model<BillingInterface>('Billing', UserSchema);

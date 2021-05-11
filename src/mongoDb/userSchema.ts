import mongoose, {Schema, Document} from 'mongoose';

export interface Address extends Document {
    street: string;
    city: string;
    postCode: string;
}

// export interface IUser extends Document {
//     email: string;
//     firstName: string;
//     lastName: string;
//     address?: Address;
// }

export interface IUser extends Document {
    name : string;
    email: string;
    phone: number;
    balance: number;
    address?: Address;
}


export const UserSchema: Schema = new Schema({
    name : {type: String, required: true},
    email : {type: String, required: true, unique: true},
    phone : {type: Number, required: true},
    balance : {type: Number, required: true},
    address: {
        street: {type: String,required: true},
        city: {type: String,required: true},
        postCode: {type: Number,required: true}
    }
});

// export const User =  mongoose.model<IUser>('User', UserSchema);

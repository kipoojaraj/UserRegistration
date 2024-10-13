import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string;
    password: string;
    age: number;
    gender: string;
    address: string;
}

const UserSchema: Schema<IUser> = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true }, 
    gender: { type: String, required: true }, 
    address: { type: String, required: true } 
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;

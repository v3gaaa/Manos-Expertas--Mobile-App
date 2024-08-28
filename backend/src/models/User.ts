import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  profilePicture: string;
}

const UserSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  profilePicture: { type: String, required: false }
});

export default mongoose.model<IUser>('User', UserSchema);
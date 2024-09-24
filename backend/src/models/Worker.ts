import mongoose, { Document, Schema } from 'mongoose';

export interface IWorker extends Document {
  name: string;
  lastName: string;
  profession: string;
  phoneNumber: string;
  profilePicture: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Worker schema
const WorkerSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  profession: { type: String, required: true},
  phoneNumber: { type: String, required: true },
  profilePicture: { type: String, required: false },
  address: {
    street: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    zipCode: { type: String, required: false },
  },
  description: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Export the Worker model
export default mongoose.model<IWorker>('Worker', WorkerSchema);

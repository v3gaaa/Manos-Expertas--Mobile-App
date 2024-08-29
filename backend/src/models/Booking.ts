import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
    worker: mongoose.Schema.Types.ObjectId;  // Reference to Worker
    user: mongoose.Schema.Types.ObjectId;    // Reference to User
    startDate: Date;
    endDate: Date;
    completed: Boolean; 
    createdAt: Date; 
    updatedAt: Date;
}

// Define the Booking schema
const BookingSchema: Schema = new mongoose.Schema({
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    completed: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Export the Booking model
export default mongoose.model<IBooking>('Booking', BookingSchema);

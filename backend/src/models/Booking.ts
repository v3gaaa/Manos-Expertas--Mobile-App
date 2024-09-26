import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
    worker: mongoose.Schema.Types.ObjectId;  // Reference to Worker
    user: mongoose.Schema.Types.ObjectId;    // Reference to User
    startDate: Date;
    endDate: Date;
    startHour: string; // New field for start hour in "HH:MM" format
    endHour: string;   // New field for end hour in "HH:MM" format
    completed: boolean; 
    createdAt: Date; 
    updatedAt: Date;
}

// Define the Booking schema
const BookingSchema: Schema = new mongoose.Schema({
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startHour: { type: String, required: true, match: /^([01]\d|2[0-3]):([0-5]\d)$/ }, // Regex for "HH:MM" format
    endHour: { type: String, required: true, match: /^([01]\d|2[0-3]):([0-5]\d)$/ },   // Regex for "HH:MM" format
    completed: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Export the Booking model
export default mongoose.model<IBooking>('Booking', BookingSchema);

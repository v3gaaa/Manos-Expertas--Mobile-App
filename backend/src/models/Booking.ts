import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
    worker: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    startDate: Date;
    endDate: Date;
    hoursPerDay: number;
    totalHours: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema: Schema = new mongoose.Schema({
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    hoursPerDay: { type: Number, required: true, min: 1, max: 8 },
    totalHours: { type: Number, required: true },
    status: { type: String, required: true, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IBooking>('Booking', BookingSchema);
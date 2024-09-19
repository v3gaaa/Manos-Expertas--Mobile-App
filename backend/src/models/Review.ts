import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
    worker: mongoose.Schema.Types.ObjectId; // Reference to Worker
    user: mongoose.Schema.Types.ObjectId;  // Reference to User
    booking: mongoose.Schema.Types.ObjectId;  // Reference to Booking
    comment: string;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
}

// Define the Review schema
const ReviewSchema: Schema = new mongoose.Schema({
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    comment: { type: String, required: false },
    rating: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Export the Review model
export default mongoose.model<IReview>('Review', ReviewSchema);
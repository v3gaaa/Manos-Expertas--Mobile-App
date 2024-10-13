import express, { Request, Response } from 'express';

// Extend the Request interface to include the user property
declare module 'express-serve-static-core' {
    interface Request {
        user?: any;
    }
}
import mongoose from 'mongoose';
import Review from '../models/Review';
import { body, param, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Set up rate limiter: maximum of 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

// Middleware for authentication
const authMiddleware = (req: Request, res: Response, next: Function) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).send('Token is required');

    jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey', (err, user) => {
        if (err) return res.status(403).send('Invalid token');
        req.user = user; // Attach user information to request object
        next();
    });
};

// Create a new review
router.post('/reviews', limiter, authMiddleware, [
    body('worker').isMongoId().withMessage('Invalid worker ID format'),
    body('user').isMongoId().withMessage('Invalid user ID format'),
    body('booking').isMongoId().withMessage('Invalid booking ID format'),
    body('comment').optional().isString().trim().escape(),
    body('rating').isNumeric().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { worker, user, booking, comment, rating } = req.body;
    const review = new Review({ worker, user, booking, comment, rating });

    try {
        const newReview = await review.save();
        console.log('Review successfully created:', newReview);
        res.status(201).json(newReview);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: (error as Error).message });
    }
});

// Get all reviews
router.get('/reviews', limiter, async (req: Request, res: Response) => {
    console.log('Fetching all reviews');
    try {
        const reviews = await Review.find().populate('worker').populate('user').populate('booking');
        console.log('All reviews fetched successfully:', reviews.length);
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: (error as Error).message });
    }
});

// Get all reviews by worker ID
router.get('/reviews/worker/:workerId', limiter, [
    param('workerId').isMongoId().withMessage('Invalid worker ID format'),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const workerId = req.params.workerId;
    console.log(`Fetching reviews for worker ID: ${workerId}`);
    try {
        const reviews = await Review.find({ worker: workerId })
            .populate('worker')
            .populate('user')
            .populate('booking');
        console.log(`Reviews fetched for worker ${workerId}:`, reviews.length);
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews by worker ID:', error);
        res.status(500).json({ message: (error as Error).message });
    }
});

// Get the average rating of a worker
router.get('/reviews/worker/:workerId/average-rating', [
    param('workerId').isMongoId().withMessage('Invalid worker ID format'),
], async (req: Request, res: Response) => {
    const workerId = req.params.workerId;
    console.log(`Fetching average rating for worker ID: ${workerId}`);
    try {
        const result = await Review.aggregate([
            {
                $match: { 
                    worker: new mongoose.Types.ObjectId(workerId)
                }
            },
            {
                $group: {
                    _id: '$worker',
                    averageRating: { $avg: '$rating' }
                }
            }
        ]);

        const response = {
            workerId,
            averageRating: result.length > 0 ? Number(result[0].averageRating.toFixed(1)) : 0
        };
        
        console.log('Average rating for worker %s:', workerId, response.averageRating);
        res.json(response);
    } catch (error) {
        console.error('Error fetching average rating:', error);
        res.status(500).json({ message: (error as Error).message });
    }
});

// Get the number of reviews of a worker
router.get('/reviews/worker/:workerId/count', [
    param('workerId').isMongoId().withMessage('Invalid worker ID format'),
], async (req: Request, res: Response) => {
    const workerId = req.params.workerId;
    console.log(`Fetching review count for worker ID: ${workerId}`);
    try {
        const count = await Review.countDocuments({ worker: new mongoose.Types.ObjectId(workerId) });
        console.log('Review count for worker %s:', workerId, count);
        res.json({ workerId, count });
    } catch (error) {
        console.error('Error fetching review count:', error);
        res.status(500).json({ message: (error as Error).message });
    }
});

// Get workers with highest/lowest ratings
router.get('/reviews/workers/:sortOrder(highest|lowest)-rated', async (req: Request, res: Response) => {
    const sortOrderParam = req.params.sortOrder;
    const sortOrder = sortOrderParam === 'highest' ? -1 : 1;
    if (sortOrderParam !== 'highest' && sortOrderParam !== 'lowest') {
        console.error('Invalid sortOrder parameter:', sortOrderParam);
        return res.status(400).json({ message: 'Invalid sortOrder parameter' });
    }
    console.log(`Fetching ${sortOrderParam}-rated workers`);
    try {
        const workers = await Review.aggregate([
            {
                $group: {
                    _id: '$worker',
                    averageRating: { $avg: '$rating' }
                }
            },
            {
                $sort: { averageRating: sortOrder }
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: 'workers',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'workerDetails'
                }
            }
        ]);

        console.log(`${sortOrderParam}-rated workers fetched:`, workers.length);
        res.json(workers);
    } catch (error) {
        console.error(`Error fetching ${sortOrderParam}-rated workers:`, error);
        res.status(500).json({ message: (error as Error).message });
    }
});

// Delete a review
router.delete('/reviews/:id', [
    param('id').isMongoId().withMessage('Invalid review ID format'),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    console.log(`Deleting review with ID: ${req.params.id}`);
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            console.log('Review not found');
            return res.status(404).json({ message: 'Review not found' });
        }
        console.log('Review deleted successfully');
        res.json({ message: 'Review deleted' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: (error as Error).message });
    }
});

export default router;

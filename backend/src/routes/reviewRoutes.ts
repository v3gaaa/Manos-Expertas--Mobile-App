import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Review from '../models/Review';

const router = express.Router();

// Create a new review
router.post('/reviews', async (req: Request, res: Response) => {
    console.log('Creating new review with body:', req.body);
    const { worker, user, booking, comment, rating } = req.body;
    const review = new Review({ worker, user, booking, comment, rating });
    
    try {
      const newReview = await review.save();
      console.log('Review successfully created:', newReview);
      res.json(newReview);
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ message: error });
    }
});

// Get all reviews
router.get('/reviews', async (req: Request, res: Response) => {
    console.log('Fetching all reviews');
    try {
      const reviews = await Review.find().populate('worker').populate('user').populate('booking');
      console.log('All reviews fetched successfully:', reviews.length);
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: error });
    }
});

// Get all reviews by worker ID
router.get('/reviews/worker/:workerId', async (req: Request, res: Response) => {
    console.log(`Fetching reviews for worker ID: ${req.params.workerId}`);
    try {
      const workerId = req.params.workerId;
      const reviews = await Review.find({ worker: workerId })
        .populate('worker')
        .populate('user')
        .populate('booking');
      console.log(`Reviews fetched for worker ${workerId}:`, reviews.length);
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews by worker ID:', error);
      res.status(500).json({ message: error });
    }
});

// Get the average rating of a worker
router.get('/reviews/worker/:workerId/average-rating', async (req: Request, res: Response) => {
    try {
        const workerId = req.params.workerId;
        
        // Verificar si el workerId es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(workerId)) {
            return res.status(400).json({ message: 'Invalid worker ID format' });
        }

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

        // Si no hay reseñas, devolver 0 como promedio
        const response = {
            workerId,
            averageRating: result.length > 0 ? Number(result[0].averageRating.toFixed(1)) : 0
        };
        
        res.json(response);
    } catch (error) {
        console.error('Error fetching average rating:', error);
        res.status(500).json({ message: (error as Error).message });
    }
});

// Get the number of reviews of a worker
router.get('/reviews/worker/:workerId/count', async (req: Request, res: Response) => {
    console.log(`Fetching review count for worker ID: ${req.params.workerId}`);
    try {
        const workerId = req.params.workerId;
        
        // Verificar si el workerId es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(workerId)) {
            return res.status(400).json({ message: 'Invalid worker ID format' });
        }

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
router.delete('/reviews/:id', async (req: Request, res: Response) => {
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
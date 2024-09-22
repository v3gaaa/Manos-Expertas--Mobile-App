import express, { Request, Response } from 'express';
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
  
      // Find reviews by worker ID
      const reviews = await Review.find({ worker: workerId }).populate('worker').populate('user').populate('booking');
      console.log(`Reviews fetched for worker ${workerId}:`, reviews.length);
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews by worker ID:', error);
      res.status(500).json({ message: error });
    }
});

// Get the average rating of a worker
router.get('/reviews/worker/:workerId/average-rating', async (req: Request, res: Response) => {
    console.log(`Fetching average rating for worker ID: ${req.params.workerId}`);
    try {
      const workerId = req.params.workerId;
  
      const result = await Review.aggregate([
        {
          $match: { worker: workerId } // Match reviews for the specific worker
        },
        {
          $group: {
            _id: '$worker',           // Group by worker ID
            averageRating: { $avg: '$rating' } // Calculate average rating
          }
        }
      ]);
  
      if (result.length > 0) {
        console.log(`Average rating for worker ${workerId}:`, result[0].averageRating);
        res.json({ workerId, averageRating: result[0].averageRating });
      } else {
        console.log(`No reviews found for worker ${workerId}`);
        res.status(404).json({ message: 'No reviews found for this worker' });
      }
    } catch (error) {
      console.error('Error fetching average rating:', error);
      res.status(500).json({ message: error });
    }
});

// Get the number of reviews of a worker by worker ID
router.get('/reviews/worker/:workerId/count', async (req: Request, res: Response) => {
    console.log(`Fetching review count for worker ID: ${req.params.workerId}`);
    try {
      const workerId = req.params.workerId;
      const count = await Review.countDocuments({ worker: workerId });
      console.log(`Review count for worker ${workerId}:`, count);
      res.json({ workerId, count });
    } catch (error) {
      console.error('Error fetching review count:', error);
      res.status(500).json({ message: error });
    }
});

// Get workers with the lowest average rating
router.get('/reviews/workers/lowest-rated', async (req: Request, res: Response) => {
    console.log('Fetching workers with the lowest average rating');
    try {
        const workers = await Review.aggregate([
            {
                $group: {
                    _id: '$worker', 
                    averageRating: { $avg: '$rating' } 
                }
            },
            {
                $sort: { averageRating: 1 } 
            },
            {
                $limit: 10 
            }
        ])
        .lookup({
            from: 'workers', 
            localField: '_id', 
            foreignField: '_id', 
            as: 'workerDetails' 
        });

        console.log('Lowest-rated workers fetched:', workers.length);
        res.json(workers);
    } catch (error) {
        console.error('Error fetching lowest-rated workers:', error);
        res.status(500).json({ message: error });
    }
});

// Get workers with the highest average rating
router.get('/reviews/workers/highest-rated', async (req: Request, res: Response) => {
    console.log('Fetching workers with the highest average rating');
    try {
        const workers = await Review.aggregate([
            {
                $group: {
                    _id: '$worker', 
                    averageRating: { $avg: '$rating' } 
                }
            },
            {
                $sort: { averageRating: -1 } 
            },
            {
                $limit: 10 
            }
        ])
        .lookup({
            from: 'workers', 
            localField: '_id', 
            foreignField: '_id', 
            as: 'workerDetails' 
        });

        console.log('Highest-rated workers fetched:', workers.length);
        res.json(workers);
    } catch (error) {
        console.error('Error fetching highest-rated workers:', error);
        res.status(500).json({ message: error });
    }
});

// Delete a review by ID
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
      res.status(500).json({ message: error });
    }
});

export default router;
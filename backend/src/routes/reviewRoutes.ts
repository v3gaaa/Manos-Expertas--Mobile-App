import express, { Request, Response } from 'express';
import Review from '../models/Review';

const router = express.Router();

// Create a new review
router.post('/reviews', async (req: Request, res: Response) => {
    const { worker, user, booking, comment, rating } = req.body;
    const review = new Review({ worker, user, booking, comment, rating });
    
    try {
      const newReview = await review.save();
      res.json(newReview);
    } catch (error) {
      res.status(500).json({ message: error });
    }
});


// Get all reviews
router.get('/reviews', async (req: Request, res: Response) => {
    try {
      const reviews = await Review.find().populate('worker').populate('user').populate('booking');
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: error });
    }
});

// Get all reviews by worker ID
router.get('/reviews/worker/:workerId', async (req: Request, res: Response) => {
    try {
      const workerId = req.params.workerId;
  
      // Find reviews by worker ID
      const reviews = await Review.find({ worker: workerId }).populate('worker').populate('user').populate('booking');
      
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: error });
    }
});

// Get the average rating of a worker
router.get('/reviews/worker/:workerId/average-rating', async (req: Request, res: Response) => {
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
        res.json({ workerId, averageRating: result[0].averageRating });
      } else {
        res.status(404).json({ message: 'No reviews found for this worker' });
      }
    } catch (error) {
      res.status(500).json({ message: error });
    }
});

// Get the number of reviews of a worker by worker ID
router.get('/reviews/worker/:workerId/count', async (req: Request, res: Response) => {
    try {
      const workerId = req.params.workerId;
  
      const count = await Review.countDocuments({ worker: workerId });
  
      res.json({ workerId, count });
    } catch (error) {
      res.status(500).json({ message: error });
    }
});


// Get workers with the lowest average rating
router.get('/reviews/workers/lowest-rated', async (req: Request, res: Response) => {
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

        res.json(workers);
    } catch (error) {
        res.status(500).json({ message: error});
    }
});

// Get workers with the highest average rating
router.get('/reviews/workers/highest-rated', async (req: Request, res: Response) => {
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

        res.json(workers);
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

// Delete a review by ID
router.delete('/reviews/:id', async (req: Request, res: Response) => {
    try {
      const review = await Review.findByIdAndDelete(req.params.id);
      if (!review) return res.status(404).json({ message: 'Review not found' });
      res.json({ message: 'Review deleted' });
    } catch (error) {
      res.status(500).json({ message: error });
    }
});



export default router;
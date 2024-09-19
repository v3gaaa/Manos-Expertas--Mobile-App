import express, { Request, Response } from 'express';
import Worker from '../models/Worker';

const router = express.Router();

// Get all workers
router.get('/workers', async (req: Request, res: Response) => {
  try {
    const workers = await Worker.find();
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get('/workers/search', async (req: Request, res: Response) => {
  const { query } = req.query;

  console.log('Search query:', query); // Debugging the query

  try {
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const workers = await Worker.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { profession: { $regex: query, $options: 'i' } },
      ],
    });

    console.log('Fetched workers:', workers); // Debugging the workers

    if (workers.length === 0) {
      return res.status(404).json({ message: 'No workers found' });
    }

    res.json(workers);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
});

router.get('/workers/professions', async (req: Request, res: Response) => {
  try {
    const professions = await Worker.distinct('profession'); // Get unique professions
    res.json(professions);
  } catch (error) {
    // TypeScript fix for 'error' is of type 'unknown'
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
});

router.get('/workers/profession/:profession?', async (req: Request, res: Response) => {
  const { profession } = req.params;

  try {
    let workers;
    if (!profession || profession === '') {
      // Fetch all workers if no profession is specified
      workers = await Worker.find();
    } else {
      // Fetch workers by specific profession
      workers = await Worker.find({ profession: { $regex: profession, $options: 'i' } });
    }

    if (workers.length === 0) {
      return res.status(404).json({ message: 'No workers found' });
    }

    res.json(workers);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
});



// Get a worker by ID
router.get('/workers/:id', async (req: Request, res: Response) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Create a new worker
router.post('/workers', async (req: Request, res: Response) => {
  const { name, lastName, profession, phoneNumber, profilePicture, address, description } = req.body;
  const worker = new Worker({ name, lastName, profession, phoneNumber, profilePicture, address, description });
  
  try {
    const newWorker = await worker.save();
    res.status(201).json(newWorker);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// Update a worker by ID
router.put('/workers/:id', async (req: Request, res: Response) => {
  try {
    const worker = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json(worker);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// Delete a worker by ID
router.delete('/workers/:id', async (req: Request, res: Response) => {
  try {
    const worker = await Worker.findByIdAndDelete(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });
    res.json({ message: 'Worker deleted' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});



export default router;
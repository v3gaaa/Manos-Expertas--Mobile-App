import express, { Request, Response } from 'express';
import Worker from '../models/Worker';

const router = express.Router();

// Get all workers
router.get('/workers', async (req: Request, res: Response) => {
  console.log('Fetching all workers');
  try {
    const workers = await Worker.find();
    res.json(workers);
  } catch (error) {
    console.error('Error fetching workers:', error);
    res.status(500).json({ message: error });
  }
});

// Search workers by query
router.get('/workers/search', async (req: Request, res: Response) => {
  const { query } = req.query;
  console.log('Search query received:', query);

  try {
    if (!query || typeof query !== 'string' || query.trim() === '') {
      console.log('Invalid search query:', query);
      return res.status(400).json({ message: 'Search query is required' });
    }

    const workers = await Worker.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { profession: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    });

    if (workers.length === 0) {
      console.log('No workers found for query:', query);
      return res.status(404).json({ message: 'No workers found' });
    }

    res.json(workers);
  } catch (error) {
    console.error('Error searching workers:', error);
    res.status(500).json({ message: 'An unknown error occurred' });
  }
});

// Get unique professions
router.get('/workers/professions', async (req: Request, res: Response) => {
  console.log('Fetching unique professions');
  try {
    const professions = await Worker.distinct('profession'); // Get unique professions
    res.json(professions);
  } catch (error) {
    console.error('Error fetching professions:', error);
    const errorMessage = (error as Error).message || 'An unknown error occurred';
    res.status(500).json({ message: errorMessage });
  }
});

// Get workers by profession
router.get('/workers/profession/:profession?', async (req: Request, res: Response) => {
  const { profession } = req.params;
  console.log('Fetching workers by profession:', profession);

  try {
    let workers;
    if (!profession || profession === '') {
      console.log('No specific profession provided, fetching all workers');
      workers = await Worker.find();
    } else {
      console.log('Fetching workers with profession:', profession);
      workers = await Worker.find({ profession: { $regex: profession, $options: 'i' } });
    }

    if (workers.length === 0) {
      console.log('No workers found for profession:', profession);
      return res.status(404).json({ message: 'No workers found' });
    }

    res.json(workers);
  } catch (error) {
    console.error('Error fetching workers by profession:', error);
    res.status(500).json({ message: (error as Error).message || 'An unknown error occurred' });
  }
});

// Get a worker by ID
router.get('/workers/:id', async (req: Request, res: Response) => {
  console.log('Fetching worker by ID:', req.params.id);
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      console.log('Worker not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.json(worker);
  } catch (error) {
    console.error('Error fetching worker by ID:', error);
    res.status(500).json({ message: error });
  }
});

// Create a new worker
router.post('/workers', async (req: Request, res: Response) => {
  console.log('Creating new worker with body:', req.body);
  const { name, lastName, profession, phoneNumber, profilePicture, address, description } = req.body;
  const worker = new Worker({ name, lastName, profession, phoneNumber, profilePicture, address, description });
  
  try {
    const newWorker = await worker.save();
    res.status(201).json(newWorker);
  } catch (error) {
    console.error('Error creating new worker:', error);
    res.status(400).json({ message: error });
  }
});

// Update a worker by ID
router.put('/workers/:id', async (req: Request, res: Response) => {
  console.log('Updating worker with ID:', req.params.id, 'with body:', req.body);
  try {
    const worker = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!worker) {
      console.log('Worker not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.json(worker);
  } catch (error) {
    console.error('Error updating worker:', error);
    res.status(400).json({ message: error });
  }
});

// Delete a worker by ID
router.delete('/workers/:id', async (req: Request, res: Response) => {
  console.log('Deleting worker by ID:', req.params.id);
  try {
    const worker = await Worker.findByIdAndDelete(req.params.id);
    if (!worker) {
      console.log('Worker not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.json({ message: 'Worker deleted' });
  } catch (error) {
    console.error('Error deleting worker:', error);
    res.status(500).json({ message: error });
  }
});

// Get workers by name, lastName, and profession
router.get('/workers/search/:name/:lastName/:profession', async (req: Request, res: Response) => {
  const { name, lastName, profession } = req.params;
  console.log('Fetching workers by name, lastName, and profession:', { name, lastName, profession });

  try {
    if (!name || !lastName || !profession) {
      return res.status(400).json({ message: 'Name, last name, and profession are required' });
    }

    const workers = await Worker.find({
      name: { $regex: name, $options: 'i' },
      lastName: { $regex: lastName, $options: 'i' },
      profession: { $regex: profession, $options: 'i' },
    });

    if (workers.length === 0) {
      console.log('No workers found for name:', name, ', lastName:', lastName, ', profession:', profession);
      return res.status(404).json({ message: 'No workers found' });
    }

    res.json(workers);
  } catch (error) {
    console.error('Error fetching workers by name, lastName, and profession:', error);
    res.status(500).json({ message: 'An unknown error occurred' });
  }
});

export default router;

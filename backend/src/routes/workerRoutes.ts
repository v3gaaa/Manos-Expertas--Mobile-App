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
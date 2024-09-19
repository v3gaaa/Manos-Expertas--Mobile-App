import express, { Request, Response } from 'express';
import Booking from '../models/Booking';

const router = express.Router();

// Get all bookings
router.get('/bookings', async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find().populate('worker').populate('user');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Get a booking by ID
router.get('/bookings/:id', async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('worker').populate('user');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Get all bookings by worker ID
router.get('/bookings/worker/:workerId', async (req: Request, res: Response) => {
  try {
    const workerId = req.params.workerId;

    // Find bookings by worker ID
    const bookings = await Booking.find({ worker: workerId }).populate('worker').populate('user');
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Create a new booking
router.post('/bookings', async (req: Request, res: Response) => {
  const { worker, user, startDate, endDate } = req.body;
  const booking = new Booking({ worker, user, startDate, endDate });
  
  try {
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// Update a booking by ID
router.put('/bookings/:id', async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// Delete a booking by ID
router.delete('/bookings/:id', async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

export default router;
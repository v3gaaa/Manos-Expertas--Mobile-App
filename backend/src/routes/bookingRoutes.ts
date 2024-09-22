import express, { Request, Response } from 'express';
import Booking from '../models/Booking';

const router = express.Router();

// Get all bookings
router.get('/bookings', async (req: Request, res: Response) => {
  try {
    console.log("Fetching all bookings");
    const bookings = await Booking.find().populate('worker').populate('user');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: error });
  }
});

// Get a booking by ID
router.get('/bookings/:id', async (req: Request, res: Response) => {
  try {
    console.log(`Fetching booking by ID: ${req.params.id}`);
    const booking = await Booking.findById(req.params.id).populate('worker').populate('user');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking by ID:', error);
    res.status(500).json({ message: error });
  }
});

// Get all bookings by worker ID
router.get('/bookings/worker/:workerId', async (req: Request, res: Response) => {
  try {
    console.log(`Fetching bookings for worker ID: ${req.params.workerId}`);
    const bookings = await Booking.find({ worker: req.params.workerId }).populate('worker').populate('user');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings by worker ID:', error);
    res.status(500).json({ message: error });
  }
});

// Create a new booking
router.post('/bookings', async (req: Request, res: Response) => {
  console.log('Creating new booking with body:', req.body);
  const { worker, user, startDate, endDate } = req.body;
  const booking = new Booking({ worker, user, startDate, endDate });
  
  try {
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error creating new booking:', error);
    res.status(400).json({ message: error });
  }
});

// Update a booking by ID
router.put('/bookings/:id', async (req: Request, res: Response) => {
  console.log(`Updating booking with ID: ${req.params.id}, body:`, req.body);
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(400).json({ message: error });
  }
});

// Delete a booking by ID
router.delete('/bookings/:id', async (req: Request, res: Response) => {
  console.log(`Deleting booking with ID: ${req.params.id}`);
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: error });
  }
});

export default router;
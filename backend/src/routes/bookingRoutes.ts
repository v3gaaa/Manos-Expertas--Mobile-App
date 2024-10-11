import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Booking from '../models/Booking';
import Worker from '../models/Worker';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Set up rate limiter: maximum of 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Apply rate limiter to all requests
router.use(limiter);

// Obtener todas las reservas
router.get('/bookings', async (_req: Request, res: Response) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

//Obtener una reserva por su id
router.get('/bookings/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }
    const booking = await Booking.findOne({ _id: { $eq: bookingId } }).populate('worker').populate('user');
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Crear una nueva reserva
router.post('/bookings', async (req, res) => {
  try {
    const { worker, user, startDate, endDate, hoursPerDay } = req.body;
    
    // Calcular el total de horas
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) + 1;
    const totalHours = days * hoursPerDay;

    const newBooking = new Booking({
      worker,
      user,
      startDate,
      endDate,
      hoursPerDay,
      totalHours
    });

    await newBooking.save();
    res.status(201).json(newBooking);
    console.log('Booking created successfully:', newBooking);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

// Obtener todas las reservas de un trabajador
router.get('/bookings/worker/:workerId', async (req, res) => {
  try {
    const bookings = await Booking.find({ worker: req.params.workerId }).populate('user');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Obtener todas las reservas de un usuario
router.get('/bookings/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId }).populate('worker');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Verificar disponibilidad de un trabajador
router.get('/bookings/availability/:workerId', async (req, res) => {
  try {
    const { date } = req.query;
    const bookings = await Booking.find({
      worker: req.params.workerId,
      startDate: { $lte: new Date(date as string) },
      endDate: { $gte: new Date(date as string) }
    });

    const totalHoursBooked = bookings.reduce((sum, booking) => sum + booking.hoursPerDay, 0);
    const availableHours = 8 - totalHoursBooked;

    res.json({ availableHours });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});



// Update booking status
router.put('/bookings/:bookingId/status', async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    // Validate the status
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});
export default router;

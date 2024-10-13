import express, { Request, Response } from 'express';
import Booking from '../models/Booking';
import Worker from '../models/Worker';

const router = express.Router();

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
    const booking = await Booking.findById(req.params.bookingId).populate('worker').populate('user');
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
    const { startDate, endDate } = req.query;
    const workerId = req.params.workerId;

    // Convertir las fechas de string a Date
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    // Buscar todas las reservas que se superponen con el rango de fechas dado
    const bookings = await Booking.find({
      worker: workerId,
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } },
        { startDate: { $gte: start, $lte: end } },
        { endDate: { $gte: start, $lte: end } }
      ]
    });

    // Crear un objeto para almacenar las horas reservadas por día
    const bookedHoursByDay: { [key: string]: number } = {};

    // Calcular las horas reservadas para cada día
    bookings.forEach(booking => {
      let currentDate = new Date(Math.max(booking.startDate.getTime(), start.getTime()));
      const bookingEnd = new Date(Math.min(booking.endDate.getTime(), end.getTime()));

      while (currentDate <= bookingEnd) {
        const dateString = currentDate.toISOString().split('T')[0];
        bookedHoursByDay[dateString] = (bookedHoursByDay[dateString] || 0) + booking.hoursPerDay;
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    // Determinar la disponibilidad para cada día
    const availability: { [key: string]: boolean } = {};
    let currentDate = new Date(start);
    while (currentDate <= end) {
      const dateString = currentDate.toISOString().split('T')[0];
      availability[dateString] = (bookedHoursByDay[dateString] || 0) < 8;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json({ availability });
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

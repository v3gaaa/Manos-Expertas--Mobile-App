import express, { Request, Response } from 'express';
import Booking from '../models/Booking';
import Worker from '../models/Worker';
import User from '../models/User';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configurar transporte de nodemailer para enviar correos
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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

    // Obtener información del trabajador y usuario
    const workerInfo = await Worker.findById(worker);
    const userInfo = await User.findById(user);

    if (!workerInfo || !userInfo) {
      throw new Error('Worker or User not found');
    }

    // Enviar correo con los detalles de la reserva
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userInfo.email,
      subject: 'Confirmación de tu reserva en Manos Expertas',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmación de Reserva</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background-color: #F7B32B;
                    color: #ffffff;
                    text-align: center;
                    padding: 20px;
                    border-radius: 5px 5px 0 0;
                }
                .content {
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 0 0 5px 5px;
                    border: 1px solid #e0e0e0;
                }
                .details {
                    background-color: #f5f5f5;
                    padding: 15px;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 12px;
                    color: #888888;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Confirmación de Reserva</h1>
            </div>
            <div class="content">
                <p>Hola ${userInfo.name},</p>
                <p>Tu reserva ha sido confirmada. Aquí están los detalles:</p>
                <div class="details">
                    <p><strong>Trabajador:</strong> ${workerInfo.name} ${workerInfo.lastName}</p>
                    <p><strong>Fecha de inicio:</strong> ${new Date(startDate).toLocaleDateString()}</p>
                    <p><strong>Fecha de fin:</strong> ${new Date(endDate).toLocaleDateString()}</p>
                    <p><strong>Horas por día:</strong> ${hoursPerDay}</p>
                    <p><strong>Total de horas:</strong> ${totalHours}</p>
                </div>
                <p>Podras encontrar la informacion para contactar al trabajador dentro de tu aplicacion.</p>
                <p>¡Gracias por usar Manos Expertas!</p>
            </div>
            <div class="footer">
                <p>Este es un correo automático, por favor no respondas a esta dirección.</p>
            </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent to:', userInfo.email);

    res.status(201).json(newBooking);
    console.log('Booking created successfully:', newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
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

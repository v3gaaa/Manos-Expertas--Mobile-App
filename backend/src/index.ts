import express, { Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import workerRoutes from './routes/workerRoutes';
import bookingRoutes from './routes/bookingRoutes';
import reviewRoutes from './routes/reviewRoutes';
import uploadRoutes from './routes/uploadRoutes';

//Security Routes
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import slowDown from 'express-slow-down';

// To run: npx ts-node src/index.ts

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '300kb' })); // Body limit is 300kb to prevent large uploads on a Ddos attack


// Rate limiting to prevent DDoS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);


// Speed limiting to prevent brute force attacks
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests per 15 minutes, then delay each request
  delayMs: () => 500 // Cada solicitud por encima del límite tendrá un retraso fijo de 500ms
});
app.use('/api', speedLimiter);


// Sanitize input to prevent NoSQL injections
app.use(mongoSanitize());

// Error handling middleware for JSON parsing issues
app.use(bodyParser.json({ strict: false }));
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON' });
  }
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('Connected to MongoDB');

    const client = mongoose.connection.getClient();
    const dbase = client.db('ManosExpertas');

  })
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Routes
app.use('/api', userRoutes);
app.use('/api', workerRoutes);
app.use('/api', bookingRoutes);
app.use('/api', reviewRoutes);
app.use('/api', uploadRoutes);

//Main route
app.get('/api', (req: Request, res: Response) => {
  res.send('Server running');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/api`));


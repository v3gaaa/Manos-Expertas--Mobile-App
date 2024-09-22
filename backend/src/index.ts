import express, { Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import workerRoutes from './routes/workerRoutes';
import bookingRoutes from './routes/bookingRoutes';
import reviewRoutes from './routes/reviewRoutes';

// To run: npx ts-node src/index.ts

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Routes
app.use('/api', userRoutes);
app.use('/api', workerRoutes);
app.use('/api', bookingRoutes);
app.use('/api', reviewRoutes);

//Main route
app.get('/api', (req: Request, res: Response) => {
  res.send('Server running');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/api`));


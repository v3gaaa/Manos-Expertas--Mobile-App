import express, { Request, Response } from 'express';
import User from '../models/User';

const router = express.Router();

// Get all users
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Get a user by ID
router.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// Create a new user
router.post('/users', async (req: Request, res: Response) => {
  const { name, lastName, email, password, phoneNumber, profilePicture, address } = req.body;
  const user = new User({ name, lastName, email, password, phoneNumber, profilePicture, address });
  
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// Update a user by ID
router.put('/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// Delete a user by ID
router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

export default router;

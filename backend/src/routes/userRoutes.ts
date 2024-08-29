import express, { Request, Response } from 'express';
import User, {IUser} from '../models/User';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

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

// Get a user by email
router.get('/users/email/:email', async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error });
  }
} );

// Login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Hash the input password with the user's salt
    const hashedInputPassword = CryptoJS.SHA512(password + user.salt).toString();

    // Compare the hashed password with the stored password
    if (user.password !== hashedInputPassword) return res.status(401).json({ message: 'Invalid password' });

    // Generate JWT token
    const token = generateToken(user);

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});


function generateToken(user: IUser) {
  // Genera un token utilizando el ID del usuario y una clave secreta
  const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
  return token;
}


// Signup
router.post('/signup', async (req: Request, res: Response) => {
  const { name, lastName, email, password, phoneNumber, profilePicture, address, salt } = req.body;
  const user = new User({ name, lastName, email, password, phoneNumber, profilePicture, address, salt });
  
  try {
    const newUser = await user.save();
    const token = generateToken(newUser);
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});


export default router;

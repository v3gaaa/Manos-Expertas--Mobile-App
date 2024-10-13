import express, { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

const router = express.Router();

// Get all users
router.get('/users', async (req: Request, res: Response) => {
  try {
    console.log('Fetching all users');
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error });
  }
});

// Get a user by ID
router.get('/users/:id', async (req: Request, res: Response) => {
  try {
    console.log(`Fetching user by ID: ${req.params.id}`);
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: error });
  }
});

// Create a new user
router.post('/users', async (req: Request, res: Response) => {
  console.log('Creating new user with body:', req.body);
  const { name, lastName, email, password, phoneNumber, profilePicture, address } = req.body;
  const user = new User({ name, lastName, email, password, phoneNumber, profilePicture, address });
  
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ message: error });
  }
});

// Update a user by ID
router.put('/users/:id', async (req: Request, res: Response) => {
  console.log(`Updating user by ID: ${req.params.id} with body:`, req.body);
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ message: error });
  }
});

// Delete a user by ID
router.delete('/users/:id', async (req: Request, res: Response) => {
  console.log(`Deleting user by ID: ${req.params.id}`);
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: error });
  }
});

// Get a user by email
router.get('/users/email/:email', async (req: Request, res: Response) => {
  console.log(`Fetching user by email: ${req.params.email}`);
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ message: error });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  console.log('Login attempt with body:', req.body);
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
    console.log('User logged in successfully:', user);

    res.json({ user, token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: error });
  }
});

function generateToken(user: IUser) {
  // Generate a token using the user's ID and a secret key
  const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
  return token;
}

// Signup
router.post('/signup', async (req: Request, res: Response) => {
  console.log('Signup attempt with body:', req.body);
  const { name, lastName, email, password, phoneNumber, profilePicture, address } = req.body;

  // Generar salt y hashear la contraseña con SHA-512
  const salt = CryptoJS.lib.WordArray.random(16).toString();
  const hashedPassword = CryptoJS.SHA512(password + salt).toString();

  // Crear nuevo usuario con la contraseña hasheada
  const user = new User({ name, lastName, email, password: hashedPassword, phoneNumber, profilePicture, address, salt });

  try {
    const newUser = await user.save();
    const token = generateToken(newUser);
    console.log('User signed up successfully:', newUser);
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(400).json({ message: error });
  }
});

// Update a user by ID
router.put('/users/:id', async (req: Request, res: Response) => {
  const { name, lastName, phoneNumber, profilePicture, address } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, lastName, phoneNumber, profilePicture, address },  // Only allow certain fields to be updated
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ message: error });
  }
});

// Create a new admin user
router.post('/admin', async (req: Request, res: Response) => {
  console.log('Creating new admin with body:', req.body);
  const { name, lastName, email, password, phoneNumber, profilePicture, address, salt } = req.body;
  const user = new User({ name, lastName, email, password, phoneNumber, profilePicture, address, admin: true, salt });
  
  try {
    const newAdmin = await user.save();
    res.status(201).json(newAdmin);
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(400).json({ message: error });
  }
});



export default router;

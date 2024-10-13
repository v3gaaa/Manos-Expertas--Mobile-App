import express, { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import { body, param, validationResult } from 'express-validator';

const router = express.Router();

// Middleware for authentication
const authMiddleware = (req: Request, res: Response, next: Function) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).send('Token is required');

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        return res.status(500).send('Internal Server Error: JWT secret is not defined.');
    }
    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) return res.status(403).send('Invalid token');
        req.user = user; // Attach user information to request object
        next();
    });
};

// Get all users
router.get('/users', async (req: Request, res: Response) => {
    try {
        console.log('Fetching all users');
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: (error as Error).message });
    }
});

// Get a user by ID
router.get('/users/:id', [
    param('id').isMongoId().withMessage('Invalid user ID format'),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        console.log(`Fetching user by ID: ${req.params.id}`);
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: (error as Error).message });
    }
});

// Create a new user
router.post('/users', [
    body('name').isString().trim().escape().withMessage('Name is required'),
    body('lastName').isString().trim().escape().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phoneNumber').optional().isString().trim().escape(),
    body('profilePicture').optional().isString().trim().escape(),
    body('address').optional().isObject().withMessage('Address must be an object'),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, lastName, email, password, phoneNumber, profilePicture, address } = req.body;
    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(); // Generate a salt
    const hashedPassword = CryptoJS.SHA512(password + salt).toString(); // Hash password with salt

    const user = new User({ name, lastName, email, password: hashedPassword, phoneNumber, profilePicture, address, salt });
  
    try {
        const newUser = await user.save();
        const token = generateToken(newUser);
        res.status(201).json({ user: newUser, token });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(400).json({ message: (error as Error).message });
    }
});

// Update a user by ID
router.put('/users/:id', [
    param('id').isMongoId().withMessage('Invalid user ID format'),
    body('name').optional().isString().trim().escape(),
    body('lastName').optional().isString().trim().escape(),
    body('phoneNumber').optional().isString().trim().escape(),
    body('profilePicture').optional().isString().trim().escape(),
    body('address').optional().isObject().withMessage('Address must be an object'),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        console.log('Updating user by ID: %s with body:', req.params.id, req.body);
        const updateFields = ['name', 'lastName', 'phoneNumber', 'profilePicture', 'address'];
        const updateData: any = {};
        updateFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(400).json({ message: (error as Error).message });
    }
});

// Delete a user by ID
router.delete('/users/:id', [
    param('id').isMongoId().withMessage('Invalid user ID format'),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        console.log(`Deleting user by ID: ${req.params.id}`);
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: (error as Error).message });
    }
});

// Get a user by email
router.get('/users/email/:email', [
    param('email').isEmail().withMessage('Invalid email format'),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        console.log(`Fetching user by email: ${req.params.email}`);
        const user = await User.findOne({ email: { $eq: req.params.email } });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error('Error fetching user by email:', error);
        res.status(500).json({ message: (error as Error).message });
    }
});

// Login
router.post('/login', [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        console.log('Login attempt with body:', req.body);
        const user = await User.findOne({ email: { $eq: email } });
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
        res.status(500).json({ message: (error as Error).message });
    }
});

// Token generation function
function generateToken(user: IUser) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT secret is not defined');
    }
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
    return token;
}

// Create a new admin user
router.post('/admin', [
    body('name').isString().trim().escape().withMessage('Name is required'),
    body('lastName').isString().trim().escape().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phoneNumber').optional().isString().trim().escape(),
    body('profilePicture').optional().isString().trim().escape(),
    body('address').optional().isObject().withMessage('Address must be an object'),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, lastName, email, password, phoneNumber, profilePicture, address } = req.body;
    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(); // Generate a salt
    const hashedPassword = CryptoJS.SHA512(password + salt).toString(); // Hash password with salt

    const user = new User({ name, lastName, email, password: hashedPassword, phoneNumber, profilePicture, address, admin: true, salt });
  
    try {
        const newAdmin = await user.save();
        res.status(201).json(newAdmin);
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(400).json({ message: (error as Error).message });
    }
});

export default router;
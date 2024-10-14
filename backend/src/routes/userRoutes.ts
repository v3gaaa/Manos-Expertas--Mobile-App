import express, { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

// Configurar transporte de nodemailer para enviar correos
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

//console log if the email and password are correct
transporter.verify(function(error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('NodeMailer is ready to send emails');
  }
});

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

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ name, lastName, email, password: hashedPassword, phoneNumber, profilePicture, address });
    const newUser = await user.save();

    // Enviar correo de bienvenida
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Bienvenido a Manos Expertas',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bienvenido a Manos Expertas</title>
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
                <h1>Bienvenido a Manos Expertas</h1>
            </div>
            <div class="content">
                <p>Hola ${name},</p>
                <p>¡Gracias por unirte a Manos Expertas! Estamos emocionados de tenerte como parte de nuestra comunidad.</p>
                <p>Con tu cuenta, podrás:</p>
                <ul>
                    <li>Buscar profesionales calificados para tus proyectos</li>
                    <li>Programar servicios fácilmente</li>
                    <li>Gestionar tus reservas y pagos</li>
                </ul>
                <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
                <p>¡Esperamos que disfrutes de nuestros servicios!</p>
                <p>Saludos,<br>El equipo de Manos Expertas</p>
            </div>
            <div class="footer">
                <p>Este es un correo automático, por favor no respondas a esta dirección.</p>
            </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);

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
    if (!user) {
      return res.status(404).json({ message: 'El usuario no fue encontrado' });
    }

    // Compare the input password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generate JWT token
    const token = generateToken(user);
    console.log('User logged in successfully:', user);

    res.json({ user, token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
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

  try {
    // Verificar si ya existe un usuario con ese correo
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }

    // Generar salt y hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, lastName, email, password: hashedPassword, phoneNumber, profilePicture, address });
    const newUser = await user.save();

    const token = generateToken(newUser);
    console.log('User signed up successfully:', newUser);
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(400).json({ message: 'No se pudo registrar el usuario. Por favor intente nuevamente.' });
  }
});

// Solicitar restablecimiento de contraseña
router.post('/request-password-reset', async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Generar un código de verificación de 6 dígitos
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Guardar el código temporalmente en el usuario
    user.resetCode = resetCode;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Código de Restablecimiento de Contraseña - Manos Expertas',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Restablecimiento de Contraseña</title>
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
                .code {
                    font-size: 24px;
                    font-weight: bold;
                    text-align: center;
                    color: #F7B32B;
                    margin: 20px 0;
                    padding: 10px;
                    background-color: #f5f5f5;
                    border-radius: 5px;
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
                <h1>Restablecimiento de Contraseña</h1>
            </div>
            <div class="content">
                <p>Hola,</p>
                <p>Has solicitado restablecer tu contraseña para tu cuenta en Manos Expertas. Utiliza el siguiente código de verificación para completar el proceso:</p>
                <div class="code">${resetCode}</div>
                <p>Este código es válido por 30 minutos. Si no has solicitado este cambio, por favor ignora este correo o contacta a nuestro equipo de soporte.</p>
                <p>Gracias,<br>El equipo de Manos Expertas</p>
            </div>
            <div class="footer">
                <p>Este es un correo automático, por favor no respondas a esta dirección.</p>
            </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Correo de restablecimiento enviado' });
  } catch (error) {
    console.error('Error solicitando restablecimiento de contraseña:', error);
    res.status(500).json({ message: 'Error al solicitar restablecimiento de contraseña' });
  }
});

// Restablecer contraseña
router.post('/reset-password', async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar el código de restablecimiento
    if (user.resetCode !== code) {
      return res.status(400).json({ message: 'Código de verificación incorrecto' });
    }

    // Actualizar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.resetCode = undefined; // Eliminar el código después de usarlo
    await user.save();

    res.json({ success: true, message: 'Contraseña restablecida con éxito' });
  } catch (error) {
    console.error('Error restableciendo la contraseña:', error);
    res.status(500).json({ message: 'Error al restablecer la contraseña' });
  }
});



// Generate a random 6-digit code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store verification codes temporarily (consider using Redis for production)
const verificationCodes: { [email: string]: string } = {};

// Send verification email
async function sendVerificationEmail(email: string, code: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification for Manos Expertas',
    html: `
      <h1>Verify Your Email</h1>
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>Please enter this code in the app to complete your registration.</p>
    `
  };

  await transporter.sendMail(mailOptions);
}

// Request email verification
router.post('/request-verification', async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const code = generateVerificationCode();
    verificationCodes[email] = code;

    await sendVerificationEmail(email, code);

    res.json({ message: 'Verification code sent' });
  } catch (error) {
    console.error('Error requesting verification:', error);
    res.status(500).json({ message: 'Error sending verification code' });
  }
});

// Verify email and complete registration
router.post('/verify-and-register', async (req: Request, res: Response) => {
  const { email, code, ...userData } = req.body;

  try {
    if (verificationCodes[email] !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Create new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const user = new User({ 
      ...userData, 
      email, 
      password: hashedPassword,
      salt: salt  // Add the salt to the user object
    });
    const newUser = await user.save();

    // Clear verification code
    delete verificationCodes[email];

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error('Error verifying and registering:', error);
    res.status(500).json({ message: 'Error registering user', error: (error as any).message });
  }
});

export default router;
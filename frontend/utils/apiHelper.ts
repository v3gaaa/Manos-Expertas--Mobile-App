//const API_URL = 'http://10.0.0.12:5000/api';  // En vez de poner [10.0.0.17] metanse la ip de su compu con ipconfig y usen esa.
//const API_URL = 'https://f381-189-163-123-144.ngrok-free.app/api';
import { Platform } from 'react-native';

// Define API_URL based on the platform
const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:5000/api'  // Localhost for web
  : 'https://f381-189-163-123-144.ngrok-free.app/api';  // ngrok URL for other platforms
  
export interface IUser{
  name: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  profilePicture: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  admin: boolean;
  salt: string;
}

// Función para iniciar sesión
export async function logIn(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error('Error en la solicitud de inicio de sesión');
    }
    const { token, user } = await response.json();
    
    return { token, user };
  } catch (error) {
    console.error('Error in logIn:', error);
    return null;
  }
}

// Función para registrarse
export async function signUp(user: IUser) {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error('Error en la solicitud de registro');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in signUp:', error);
    return null;
  }
}

// Función para obtener todos los usuarios
export async function getUsers() {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los usuarios');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getUsers:', error);
    return null;
  }
}

// Función para obtener un usuario por email
export async function getUserByEmail(email: string) {
  try {
    const response = await fetch(`${API_URL}/users/email/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener el usuario por email');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getUserByEmail:', error);
    return null;
  }
}

export async function getWorkersByProfession(profession: string) {
  try {
    const response = await fetch(`${API_URL}/workers/profession/${profession}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los trabajadores por profesión');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getWorkersByProfession:', error);
    return null;
  }
}

export async function getWorkersByQuery(query: string) {
  try {
    const response = await fetch(`${API_URL}/workers/search?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error fetching workers by query');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getWorkersByQuery:', error);
    return null;
  }
}

export async function getProfessions() {
  try {
    const response = await fetch(`${API_URL}/workers/professions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error fetching professions');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getProfessions:', error);
    return [];
  }
}

export async function getWorkerById(id: string) {
  try {
    const response = await fetch(`${API_URL}/workers/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error al obtener los datos del trabajador');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getWorkerById:', error);
    return null;
  }
}

// Función para crear una nueva reserva
export async function createBooking(bookingData: { worker: string; user: string; startDate: Date; endDate: Date, startHour: string, endHour: string }) {
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error('Error creating booking');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in createBooking:', error);
    return null;
  }
}

// Función para obtener a los trabajadores con peor rating
export async function getWorstWorkers() {
  try {
    const response = await fetch(`${API_URL}/reviews/workers/lowest-rated`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching worst workers');
    }

    const data = await response.json();

    console.log(data);

    const workers = data.flatMap((worker: { averageRating: number; workerDetails: Worker[] }) =>
      worker.workerDetails.map((details) => ({
        ...details, // spread the worker details
        rating: worker.averageRating, // add the average rating
      }))
    );

    return workers;
  } catch (error) {
    console.error('Error in getWorstWorkers:', error);
    return null;
  }
}
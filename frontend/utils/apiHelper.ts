//const API_URL = 'http://10.0.0.12:5000/api';  // En vez de poner [10.0.0.17] metanse la ip de su compu con ipconfig y usen esa.
//const API_URL = 'https://f381-189-163-123-144.ngrok-free.app/api';
import { Platform } from 'react-native';
import axios from 'axios';

// Define API_URL based on the platform
const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:5000/api'  // Localhost for web
  : 'http://10.43.120.99:5000/api';  // ngrok URL for other platforms
  // : 'http://10.43.96.163:5000/api'
  
export interface IUser {
  _id?: string;  // Add _id as an optional field
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
  

export interface IWorker {
  name: string;
  lastName: string;
  profession: string;
  phoneNumber: string;
  profilePicture: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  description: string;
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
        ...details, 
        rating: worker.averageRating, 
      }))
    );

    return workers;
  } catch (error) {
    console.error('Error in getWorstWorkers:', error);
    return null;
  }
}

// Función para crear trabajador
export async function createWorker(worker: IWorker) {
  try {
    console.log('Creating new worker with body (frontend):', worker);
    const response = await fetch(`${API_URL}/workers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(worker),
    });

    if (!response.ok) {
      throw new Error('Error al crear el trabajador');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in createWorker:', error);
    return null;
  }
}

// Función para subir una imagen
export async function uploadImage(uri: string): Promise<string | null> {
  const formData = new FormData();
  const fileName = uri.split('/').pop();
  const type = `image/${fileName?.split('.').pop()}`; 

  try {
      const response = await fetch(uri);
      if (!response.ok) {
          throw new Error('Failed to fetch image');
      }
      
      const blob = await response.blob(); 

      formData.append('file', blob, fileName); 

      const uploadResponse = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData,
      });

      if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.message || 'Failed to upload image');
      }

      const data = await uploadResponse.json();
      
      const imageUrl = `${API_URL}/files/${data.fileId}`; 
      
      return imageUrl; 
  } catch (error) {
      console.error('Error uploading image:', error);
      return null;
  }
}

// Función para obtener un trabajador por name, lastName y profession
export async function getWorkersByNameAndProfession(name: string, lastName: string, profession: string) {
  try {
    const response = await fetch(`${API_URL}/workers/search/${name}/${lastName}/${profession}`, {
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
    console.error('Error in getWorkersByNameAndProfession:', error);
    return null;
  }
}

// Updating user profile in the database
export async function updateUser(user: IUser) {
  try {
    const response = await fetch(`${API_URL}/users/${user._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error('Error updating user profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in updateUser:', error);
    return null;
  }
}

// Función para crear un admin user
export async function createAdminUser(user: IUser) {
  try {
    console.log('Creating new admin user with body (frontend):', user);
    const response = await fetch(`${API_URL}/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error('Error creating admin user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in createAdminUser:', error);
    return null;
  }
}

// Función para editar un trabajador
export async function editWorker(workerId: string, worker: IWorker) {
  try {
    console.log('Editing worker with body (frontend):', worker);
    const response = await fetch(`${API_URL}/workers/${workerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(worker),
    });

    if (!response.ok) {
      throw new Error('Error al editar el trabajador');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in editWorker:', error);
    return null;
  }
}

// Verificar disponibilidad de un trabajador
export async function checkWorkerAvailability(workerId: string, date: Date) {
  try {
    const response = await axios.get(`${API_URL}/bookings/availability/${workerId}`, {
      params: { date: date.toISOString() },
    });
    return response.data;
  } catch (error) {
    console.error('Error checking availability:', error);
    return { availableHours: 0 };  // Maneja error devolviendo 0 horas disponibles
  }
}

// Crear una nueva reserva
export async function createBooking(bookingData: {
  worker: string;
  user: string;
  startDate: Date;
  endDate: Date;
  hoursPerDay: number;
}) {
  try {
    const response = await axios.post(`${API_URL}/bookings`, bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error('Error al crear la reserva');
  }
}

// Función para obtener las reservas de un trabajador
export async function getWorkerBookings(workerId: string) {
  try {
    const response = await fetch(`${API_URL}/bookings/worker/${workerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener las reservas del trabajador');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getWorkerBookings:', error);
    return null;
  }
}

// Función para obtener las reservas de un usuario
export async function getUserBookings(userId: string) {
  try {
    const response = await fetch(`${API_URL}/bookings/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener las reservas del usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getUserBookings:', error);
    return null;
  }
}

// Función para obtener reservas por id
export async function getBookingById(bookingId: string) {
  try {
    const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener la reserva');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getBookingById:', error);
    return null;
  }
}
//const API_URL = 'http://10.0.0.12:5000/api';  // En vez de poner [10.0.0.17] metanse la ip de su compu con ipconfig y usen esa.
//const API_URL = 'https://f381-189-163-123-144.ngrok-free.app/api';
import { Platform } from 'react-native';
import axios from 'axios';

// Define API_URL based on the platform
const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:5000/api'  // Localhost for web
  : 'http://192.168.1.88:5000/api';  // ngrok URL for other platforms
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


export interface IReview {
  _id?: string;
  worker: string;
  user: string;
  booking: string;
  comment?: string;
  rating: number;
}

export async function logIn(email: string, password: string) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    // Si la respuesta no es exitosa, devolver el estado y el mensaje de error del servidor
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, status: response.status, message: errorData.message };
    }

    const { token, user } = await response.json();
    return { success: true, token, user };
  } catch (error) {
    console.error('Error in logIn:', error);
    return { success: false, status: 500, message: 'Error en la solicitud de inicio de sesión' };
  }
}

export async function signUp(user: IUser) {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    // Si la respuesta no es exitosa, devolver el estado y el mensaje de error del servidor
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, status: response.status, message: errorData.message };
    }

    const data = await response.json();
    return { success: true, ...data };
  } catch (error) {
    console.error('Error in signUp:', error);
    return { success: false, status: 500, message: 'Error en la solicitud de registro' };
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

export async function getWorkerById(id: string): Promise<IWorker | null> {
  try {
    const response = await axios.get(`${API_URL}/workers/${id}`);
    if (response.status !== 200) {
      throw new Error('Error al obtener los datos del trabajador');
    }
    const workerData = response.data;
    
    // Fetch reviews for the worker
    const reviewsResponse = await axios.get(`${API_URL}/reviews/worker/${id}`);
    if (reviewsResponse.status === 200) {
      workerData.reviews = reviewsResponse.data;
    }

    return workerData;
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

export async function uploadImage(uri: string): Promise<string | null> {
  const formData = new FormData();
  const fileName = uri.split('/').pop();
  const fileType = 'image/' + uri.split('.').pop();

  formData.append('file', {
    uri,
    name: fileName,
    type: fileType,
  } as any);

  try {
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url; // This now returns the Cloudinary secure_url
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

// Get all reviews
export async function getAllReviews() {
  try {
    const response = await axios.get(`${API_URL}/reviews`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    return null;
  }
}

// Get all reviews by worker ID
export async function getReviewsByWorkerId(workerId: string) {
  try {
    const response = await axios.get(`${API_URL}/reviews/worker/${workerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews by worker ID:', error);
    return null;
  }
}

// Get the average rating of a worker
export async function getWorkerAverageRating(workerId: string) {
  try {
    const response = await axios.get(`${API_URL}/reviews/worker/${workerId}/average-rating`);
    return response.data;
  } catch (error) {
    console.error('Error fetching worker average rating:', error);
    return null;
  }
}

// Get the number of reviews of a worker by worker ID
export async function getWorkerReviewCount(workerId: string) {
  try {
    const response = await axios.get(`${API_URL}/reviews/worker/${workerId}/count`);
    return response.data;
  } catch (error) {
    console.error('Error fetching worker review count:', error);
    return null;
  }
}

// Get workers with the lowest average rating
export async function getLowestRatedWorkers() {
  try {
    const response = await axios.get(`${API_URL}/reviews/workers/lowest-rated`);
    return response.data;
  } catch (error) {
    console.error('Error fetching lowest-rated workers:', error);
    return null;
  }
}

// Get workers with the highest average rating
export async function getHighestRatedWorkers() {
  try {
    const response = await axios.get(`${API_URL}/reviews/workers/highest-rated`);
    return response.data;
  } catch (error) {
    console.error('Error fetching highest-rated workers:', error);
    return null;
  }
}

// Delete a review by ID
export async function deleteReview(reviewId: string) {
  try {
    const response = await axios.delete(`${API_URL}/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw new Error('Error al eliminar la reseña');
  }
}


// Update booking status
export async function updateBookingStatus(bookingId: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') {
  try {
    const response = await axios.put(`${API_URL}/bookings/${bookingId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw new Error('Error al actualizar el estado de la reserva');
  }
}

// Create a new review
export async function createReview(review: {
  worker: string;
  user: string;
  booking: string;
  rating: number;
  comment?: string;
}) {
  try {
    const response = await axios.post(`${API_URL}/reviews`, review);
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error('Error al crear la reseña');
  }
}

export async function getAllWorkers() {
  try {
    const response = await fetch(`${API_URL}/workers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Error fetching all workers');
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getAllWorkers:', error);
    return null;
  }
}

// Función para solicitar restablecimiento de contraseña
export async function requestPasswordReset(email: string) {
  try {
    const response = await fetch(`${API_URL}/request-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, status: response.status, message: errorData.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in requestPasswordReset:', error);
    return { success: false, status: 500, message: 'Error al solicitar restablecimiento de contraseña' };
  }
}

export async function resetPassword(email: string, code: string, newPassword: string) {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, {
      email,
      code,
      newPassword,
    });

    if (response.status === 200) {
      return { success: true, message: response.data.message };
    }

    return { success: false, message: response.data.message };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { success: false, message: 'Error al restablecer la contraseña' };
  }
}


export async function getWorkerAverageRatings(workerIds: string[]) {
  try {
    const response = await axios.post(`${API_URL}/reviews/workers/average-ratings`, { workerIds });
    return response.data;
  } catch (error) {
    console.error('Error fetching average ratings for workers:', error);
    return null;
  }
}


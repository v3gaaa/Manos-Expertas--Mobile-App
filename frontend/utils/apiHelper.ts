const API_URL = 'http://localhost:5000/api';

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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
    return null;
  }
}

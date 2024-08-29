const API_URL = 'http://localhost:3000/api';


export interface IUser extends Document {
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
    createdAt: Date;
    updatedAt: Date;
}

export async function logIn(email: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}

export async function signUp(user: IUser) {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    body: JSON.stringify(user),
  });
  return response.json();
}

export async function getUsers() {
  const response = await fetch(`${API_URL}/users`);
  return response.json();
}

export async function getUserByEmail(email: string) {
  const response = await fetch(`${API_URL}/users/${email}`);
  return response.json();
}


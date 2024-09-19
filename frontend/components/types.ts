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
    salt: string;
  }
  
  export interface IWorker {
    name: string;
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
    createdAt: Date;
    updatedAt: Date;
  }
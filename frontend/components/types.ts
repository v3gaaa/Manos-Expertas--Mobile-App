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
    _id: string;
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
    reviews?: Array<{
      user: {
        name: string;
      };
      rating: number;
      comment: string;
    }>;  
    createdAt: Date;
    updatedAt: Date;
  }
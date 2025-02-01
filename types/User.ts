export interface User {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  name: string;
  phoneNumber: string;
  email: string;
  username: string;
  password: string;
  role: string;
}
export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  clientName: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Pending';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
# Invoice Management System

A full-stack MERN application for managing invoices with user authentication.

## Quick Start Guide

1. Start MongoDB locally:
   ```bash
   mongod
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start both frontend and backend:
   ```bash
   # Terminal 1 - Start the backend server
   npm run server

   # Terminal 2 - Start the frontend development server
   npm run dev
   ```

4. Create your first account:
   - Open http://localhost:5173 in your browser
   - Click "Don't have an account? Sign up"
   - Fill in your details:
     - Name: Your name
     - Email: your.email@example.com
     - Password: your password
   - Click "Sign up"

5. You can now log in with your created credentials

## Features

- User authentication (register/login)
- Create, read, update, and delete invoices
- Filter invoices by status
- Responsive design
- Secure API with JWT authentication

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests
- Lucide React for icons

### Backend
- Node.js + Express
- MongoDB for database
- JWT for authentication
- bcryptjs for password hashing

## Detailed Setup Instructions

### Prerequisites
1. Node.js (v14 or higher)
2. MongoDB (local installation or MongoDB Atlas)
3. Git

### Environment Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd invoice-management-system
   ```

2. Create `.env` file in the root directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/invoice-system
   JWT_SECRET=your-secret-key
   ```

   Note: For local development, you can use these exact values. For production, use more secure values.

3. Install dependencies:
   ```bash
   # Install all dependencies
   npm install
   ```

### Running the Application

1. Start MongoDB:
   - If using local MongoDB:
     ```bash
     mongod
     ```
   - If using MongoDB Atlas, ensure your connection string is correct in `.env`

2. Start the backend server:
   ```bash
   npm run server
   ```
   The server will run on http://localhost:5000

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will run on http://localhost:5173

4. Open http://localhost:5173 in your browser

### First Time Setup

1. Register a new account:
   - Click "Don't have an account? Sign up" on the login page
   - Fill in your details
   - Submit the form

2. Log in with your credentials

3. Start creating invoices!

## API Documentation

### Authentication Endpoints

```
POST /api/auth/register
Body: {
  "name": "Your Name",
  "email": "your.email@example.com",
  "password": "your-password"
}

POST /api/auth/login
Body: {
  "email": "your.email@example.com",
  "password": "your-password"
}
```

### Invoice Endpoints (Requires Authentication)

```
GET /api/invoices
Authorization: Bearer <your-jwt-token>

POST /api/invoices
Authorization: Bearer <your-jwt-token>
Body: {
  "invoiceNumber": "INV-001",
  "clientName": "Client Name",
  "date": "2024-03-15",
  "amount": 1000,
  "status": "Pending"
}

PUT /api/invoices/:id
Authorization: Bearer <your-jwt-token>
Body: {
  "status": "Paid"
  // other fields to update
}

DELETE /api/invoices/:id
Authorization: Bearer <your-jwt-token>
```

## Common Issues & Solutions

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally
   - Check if the MongoDB connection string is correct in `.env`
   - Verify MongoDB port is not blocked

2. **Authentication Issues**
   - Clear browser storage and try logging in again
   - Ensure you're using the correct credentials
   - Check if JWT_SECRET in `.env` matches between sessions

3. **API Errors**
   - Verify the backend server is running
   - Check browser console for specific error messages
   - Ensure all required fields are provided in requests

## Project Structure

```
├── src/                  # Frontend source code
│   ├── components/       # Reusable React components
│   ├── context/         # React context providers
│   ├── pages/           # Page components
│   ├── services/        # API service functions
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main App component
│   └── main.tsx         # Application entry point
├── server/              # Backend source code
│   └── index.js         # Express server setup
├── .env                 # Environment variables
└── README.md            # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
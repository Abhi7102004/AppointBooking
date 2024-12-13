College Appointment System Backend API

This project is a backend system for a college appointment management platform. It allows students to book appointments with professors, while professors can manage their availability and appointments. The system includes secure authentication and role-based access control.

#Features
Authentication:

Students and professors can sign up, log in, and log out using JWT authentication.
Passwords are securely hashed using bcrypt.
Role-Based Functionality:

Students can book appointments with professors, view their requests, and cancel appointments.
Professors can set their availability, view appointment requests, and respond to them (accept/reject).
Appointment Management:

Professors specify available slots.
Students can book available slots for appointments.
Appointment status transitions from pending to accepted/rejected.
Data Integrity:

Relationships between users, availability, and appointments are maintained in MongoDB.

#Tech Stack
Backend Framework: Express.js
Database: MongoDB
Authentication: JWT and bcrypt
Testing: E2E test cases with tools like Postman collections

Installation
Clone the repository:

git clone <repository-url>
cd college-appointment-system
Install dependencies:

npm install
Set up environment variables in a .env file:

.env
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/collegeAppointments
JWT_SECRET=<your-secret-key>
Start the server:

bash
Copy code
npm start

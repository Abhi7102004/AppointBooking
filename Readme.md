# College Appointment System Backend API

A robust backend system for managing college appointments between students and professors. This platform enables secure appointment scheduling with role-based access control and comprehensive appointment management features.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📑 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [License](#license)

## 🎯 Overview

The College Appointment System provides a secure and efficient platform for managing academic appointments. It features JWT-based authentication, role-specific functionalities, and comprehensive appointment management capabilities.

## ✨ Key Features

### 🔐 Authentication & Security
- Secure JWT-based authentication system
- Role-based access control (Students/Professors)
- Password encryption using bcrypt
- Session management

### 👥 Role-Based Features

#### Students Can:
- Schedule appointments with professors
- View and manage appointment requests
- Cancel existing appointments
- Track appointment status

#### Professors Can:
- Define available time slots
- Review appointment requests
- Accept or reject appointments
- Manage their schedule

### 📅 Appointment Management
- Real-time slot availability
- Automated status updates
- Conflict prevention
- Email notifications (coming soon)

## 🛠 Technology Stack

- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Security**: bcrypt
- **Testing**: Postman Collections

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB
- npm or yarn

### Installation

1. **Clone the Repository**
```bash
git clone https://github.com/Abhi7102004/AppointBooking
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment**
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/collegeAppointments
JWT_SECRET=your_secure_secret_key
```

4. **Start the Server**
```bash
npm run start
```

## 🔄 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/signup` | Register new user | All |
| POST | `/login` | User authentication | All |
| PUT | `/logout` | End user session | All |

### Appointment Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| GET | `/appointment/pending-requests` | View pending appointments | Professor |
| POST | `/appointment/book-slot` | Schedule new appointment | Student |
| PUT | `/appointment/cancel-slot/:slotId` | Cancel appointment | Student |
| POST | `/appointment/requests/:requestId/respond` | Accept/reject appointments | Professor |
| GET | `/appointment/active-requests` | View active appointments | All |

### Availability Endpoints

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| POST | `/availability/add-slot` | Add available time slots | Professor |
| GET | `/availability/check-availability/:professor` | View professor's availability


### Test Coverage
- Unit Tests: Controllers, Services, Models
- Integration Tests: API Endpoints
- E2E Tests: Complete User Flows


## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
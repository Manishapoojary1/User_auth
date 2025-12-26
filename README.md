# 🔐 Secure User Authentication System

## 📌 Project Overview
This project is a secure user authentication system that allows users to register, log in, and access protected resources.  
It follows best security practices such as password hashing and token-based authentication.

## 🎯 Objectives
- Provide secure user registration and login
- Protect user data using authentication and authorization
- Implement session/token-based access control
- Build a clean and simple authentication workflow

## 🛠️ Technologies Used
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcrypt for password hashing
- **Tools:** Git, GitHub, VS Code, Postman

## ✨ Features
- User Registration
- Secure Login
- Password Encryption
- JWT-based Authentication
- Protected API Routes
- Logout Functionality

## 📂 Project Structure
```text
User_auth/
│── server.js
│── package.json
│── .env
│
├── routes/
│   ├── auth.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   └── User.js
│
└── README.md

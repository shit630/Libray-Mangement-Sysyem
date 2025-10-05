# 📚 Library Management System

A full-stack **Library Management System** built with **React (Vite)** for the frontend and **Node.js + Express.js** for the backend.  
It provides user authentication, role-based access, book management, and borrowing functionality with a clean UI and secure backend.

🔗 **Live Demo:** [Library Management System](https://libray-mangement-sysyem-e4a5.vercel.app)  
💻 **GitHub Repo:** [Libray-Mangement-Sysyem](https://github.com/shit630/Libray-Mangement-Sysyem)

---

## 📑 Table of Contents
- [Introduction](#-introduction)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Configuration](#-configuration)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Introduction
The **Library Management System** is designed to streamline how libraries manage books and users. It includes role-based access (admin & user), book CRUD operations, borrowing requests, and email notifications.  

Admins can manage books and users, while users can browse books, borrow, and review them.

---

## ✨ Features
- 👤 User authentication (JWT-based login & registration)  
- 🔑 Role-based access (Admin, User)  
- 📖 CRUD operations for books (add, edit, delete, view)  
- 📩 Borrow request handling with email notifications  
- 🌗 Dark/Light mode using context API  
- 📱 Responsive UI with modern React components  

---

## 🛠 Tech Stack
**Frontend:**
- React (Vite)
- React Router
- Context API
- TailwindCSS

**Backend:**
- Node.js
- Express.js
- MongoDB (via Mongoose)
- Cloudinary (for file uploads)
- Nodemailer (for emails)

**Deployment:**
- Vercel (Frontend + Backend)

---

## ⚙️ Installation

Clone the repo:

```bash
git clone https://github.com/shit630/Libray-Mangement-Sysyem.git
cd Libray-Mangement-Sysyem
```````
### Install Backend
```bash
cd backend
npm install
`````

### Install Frontend
```bash
cd ../frontend
npm install
````
----
## ▶️ Usage
### Start Backend
```bash
nodemon ./server.js
```

### Start Frontend
```bash
npm run dev
Visit the app at: http://localhost:5173
```

## 🔧 Configuration
#### Backend .env
Create a .env file inside the backend folder:
```bash
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
````
#### Frontend .env
Inside frontend:
```bash
VITE_API_URL=http://localhost:5000
```
Update with deployed backend URL when hosted.

----

## 📂 Project Structure
```bash
Libray-Mangement-Sysyem/
│── backend/              # Node.js + Express backend
│   ├── configs/          # Database & Cloudinary configs
│   ├── controllers/      # API controllers
│   ├── middleware/       # Authentication & role-based access
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   ├── utils/            # Utility functions (email, etc.)
│   └── server.js         # Backend entry point
│
│── frontend/             # React frontend
│   ├── public/           # Static assets
│   ├── src/              # Source code
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Context API (Theme, Auth)
│   │   ├── pages/        # App pages
│   │   └── App.jsx       # Main React App
│   └── vite.config.js    # Vite config
│
└── README.md             # Documentation
```
-----
## 🤝 Contributing

***Contributions are welcome!***
- Fork the repo
- Create a feature branch (git checkout -b feature-name)
- Commit changes (git commit -m 'Add feature')
- Push branch (git push origin feature-name)
- Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License – free to use and modify.


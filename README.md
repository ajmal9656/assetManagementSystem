# Asset Management System

A web-based **Asset Management System** built using **Node.js**, **Express.js**, **PostgreSQL**, **Sequelize ORM**, **Pug**, and **Bootstrap**. The system helps organizations efficiently manage assets throughout their lifecycle, from purchase to scrap, while maintaining a complete transaction history.

---

## Features

### Authentication
- Secure Admin Login
- Session-based Authentication
- Protected Routes
- Logout Functionality

### Dashboard
- Total Employees
- Assets In Stock
- Issued Assets
- Assets Under Repair
- Scrapped Assets

### Employee Management
- Add Employee
- Edit Employee
- Employee Status Management
- Search Employees

### Asset Category Management
- Add Category
- Edit Category

### Asset Management
- Add Asset
- Edit Asset
- Auto-generated Asset Code
- Unique Serial Number Validation
- Search Assets
- Filter by Category
- Filter by Status

### Asset Transactions
- Issue Asset
- Return Asset
- Repair Asset
- Mark Asset as In Stock
- Scrap Asset

### Asset History
- View complete lifecycle of an asset

### Stock View
- Branch-wise Asset Count
- Branch-wise Asset Value
- Total Stock Summary

---

## Tech Stack

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL
- Sequelize ORM

### Frontend
- Pug
- Bootstrap 5

### Authentication
- Express Session
- bcrypt

### Validation
- Express Validator

---

## Installation

Clone the repository

```bash
git clone https://github.com/ajmal9656/assetManagementSystem.git
```

Move into the project

```bash
cd asset_management
```

Install dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory.

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=asset_management
DB_USER=postgres
DB_PASSWORD=your_password

SESSION_SECRET=your_secret_key
ENABLE_QUERY=NO
NODE_ENV=development
```

---

## Running the Project

Development

```bash
npm run dev
```

Production

```bash
npm start
```

---

## Database

The project uses **PostgreSQL** with **Sequelize ORM**.

---

## Modules

- Dashboard
- Employee Management
- Asset Category Management
- Asset Management
- Asset Transactions
- Asset History
- Stock View

---

## Author

**Muhammed Ajmal S**

GitHub: https://github.com/ajmal9656

LinkedIn: https://www.linkedin.com/in/muhammed-ajmal-s-476029191/

---

## License

This project is developed for learning and demonstration purposes.
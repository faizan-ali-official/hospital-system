# Hospital System - Node.js Express Login System

## Features
- User registration and login with JWT access and refresh tokens
- MySQL database
- MVC structure (ES6 modules)

## Setup

1. **Clone the repository**

2. **Install dependencies**
```bash
npm install
```

3. **Create a MySQL database and user table**

Run the SQL in `config/create_tables.sql` on your MySQL server:
```sql
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. **Create a `.env` file in the root directory:**
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=hospital_db
ACCESS_TOKEN_SECRET=youraccesstokensecret
REFRESH_TOKEN_SECRET=yourrefreshtokensecret
PORT=3000
```

5. **Run the app**
```bash
npm run dev
```

## API Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get tokens
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout and invalidate refresh token
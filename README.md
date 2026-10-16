# Task Manager (Full Stack)

A full-stack task management application. The backend is a REST API built with **Node.js, Express, TypeScript and MySQL**, and the frontend is built with **React, TypeScript and Tailwind CSS**.

## Features
- Create, view, update and delete tasks (full CRUD)
- Task status (To do, In progress, Done) and priority (Low, Medium, High) with an optional due date
- Filter tasks by status
- Server-side validation of all inputs, with clear error messages
- Parameterised SQL queries (protects against SQL injection)
- Responsive UI styled with Tailwind CSS

## Tech Stack
| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express, TypeScript |
| Database | MySQL (mysql2) |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Version control | Git, GitHub |

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/tasks` | List all tasks (optional `?status=todo`) |
| GET | `/api/tasks/:id` | Get a single task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

Example request body for `POST /api/tasks`:
```json
{ "title": "Finish assignment", "description": "Backend part", "priority": "high", "due_date": "2026-11-01" }
```

## How to Run Locally

**Prerequisites:** Node.js 18+ and MySQL (for example via XAMPP).

1. **Database:** open MySQL (phpMyAdmin > SQL tab) and run the contents of `backend/schema.sql`.
2. **Backend:**
   ```bash
   cd backend
   copy .env.example .env
   npm install
   npm run dev
   ```
   (On Mac/Linux use `cp .env.example .env`.) The API runs on http://localhost:5000
3. **Frontend** (in a second terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open the URL shown in the terminal (usually http://localhost:5173).

## Project Structure
```
backend/
  src/server.ts        - Express app setup
  src/db.ts            - MySQL connection pool
  src/validate.ts      - input validation
  src/routes/tasks.ts  - CRUD routes
  schema.sql           - database tables
frontend/
  src/App.tsx          - main page and state
  src/api.ts           - functions that call the API
  src/components/      - TaskForm and TaskItem components
```

## Author
Komal Arude

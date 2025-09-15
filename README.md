# Full-Stack User Management Dashboard

A complete, full-stack web application for managing users. This project allows for the creation, viewing, editing, and deletion (CRUD) of user profiles through a clean and responsive user interface. It features a React frontend and a robust Node.js/Express backend connected to a PostgreSQL database via the Prisma ORM.

## ✨ Features

-   **Full CRUD Functionality:** Create, Read, Update, and Delete users.
-   **Dashboard View:** A clean, sortable table displays all users.
-   **Detailed User Pages:** View all information for a single user on a dedicated page.
-   **Robust Validation:**
    -   **Client-Side:** Instant feedback on the user form for required fields and correct formats (email, phone, etc.).
    -   **Server-Side:** Secure, non-bypassable validation to ensure data integrity.
-   **Centralized Error Handling:** A professional backend setup that gracefully handles all errors.
-   **Responsive UI:** A clean and modern user interface that works on all screen sizes.

## 🛠️ Tech Stack

| Category      | Technology                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------- |
| **Frontend** | React.js (Hooks), React Router, Axios, CSS                                                                  |
| **Backend** | Node.js, Express.js                                                                                         |
| **Database** | PostgreSQL                                                                                                  |
| **ORM** | Prisma                                                                                                      |
| **Backend Tools** | `express-validator` (for server-side validation), `express-async-errors` (for error handling), `cors` |

---

## 📂 Project Structure

```
/user-management-app
|
|-- /backend
|   |-- /middleware
|   |   |-- errorHandler.js       # Centralized error handler
|   |-- /prisma
|   |   |-- schema.prisma         # Database schema
|   |   |-- migrations/           # Database migrations
|   |-- /routes
|   |   |-- userRoutes.js         # API routes for users
|   |-- .env                      # Environment variables (MUST BE CREATED)
|   |-- index.js                  # Main server entry point
|   |-- package.json
|
|-- /frontend
|   |-- /src
|   |   |-- /components
|   |   |   |-- UserDetails.js
|   |   |   |-- UserForm.js
|   |   |   |-- UserList.js
|   |   |-- /services
|   |   |   |-- api.js            # Axios API calls
|   |   |-- App.js                # Main app component & routing
|   |   |-- index.css             # Global styles
|   |-- package.json
|
|-- README.md                     # You are here!
```

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

You must have the following installed:
-   Node.js (v16 or later)
-   npm (Node Package Manager)
-   A running PostgreSQL database instance

### 1. Clone the Repository

```bash
git clone https://github.com/kesava049/forty4_assignment.git
cd forty4-assignment
```

### 2. Backend Setup

First, let's get the server running.

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create the environment file
cp .env.example .env
```

Next, open the newly created `.env` file and add your PostgreSQL database connection string.

**.env**
```env
# Example PostgreSQL connection URL
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/your_database_name"
```

Now, set up the database using Prisma.

```bash
# Sync the Prisma schema with your database and run migrations
npx prisma migrate dev

# Generate the Prisma Client
npx prisma generate

# Start the backend server
npm index.js
```

Your backend server should now be running on **`http://localhost:4000`**.

### 3. Frontend Setup

Open a **new terminal window** and navigate to the `frontend` directory.

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm run dev
```

Your frontend application should now be running and will open automatically in your browser at **`http://localhost:3000`**.

---

## 📝 API Endpoints

The backend provides the following RESTful API endpoints:

| Method   | Endpoint          | Description                    |
| -------- | ----------------- | ------------------------------ |
| `GET`    | `/api/users`      | Get a list of all users.       |
| `GET`    | `/api/users/:id`  | Get a single user by their ID. |
| `POST`   | `/api/users`      | Create a new user.             |
| `PUT`    | `/api/users/:id`  | Update an existing user.       |
| `DELETE` | `/api/users/:id`  | Delete a user.                 |
# Teacher API

A RESTful API for teacher-student management, built with Node.js, TypeScript, and MySQL.

## Technologies Used

- TypeScript
- Express
- DrizzleORM
- MySQL
- Docker
- Zod (for validation)
- Vitest (for testing)

## Features

- Register students to teachers
- Retrieve common students across teachers
- Suspend students
- Retrieve students eligible for notifications

## Project Structure

```
/
├── src/
│   ├── api/
│   │   ├── controllers/   # Request handlers
│   │   ├── middlewares/   # Express middlewares
│   │   ├── routes/        # API route definitions
│   │   └── validations/   # Request validation schemas
│   ├── config/            # App configuration
│   ├── db/                # Database setup and migrations
│   │   ├── migrations/
│   │   ├── schema.ts      # DrizzleORM schema definitions
│   │   └── index.ts       # DB connection
│   ├── services/          # Business logic
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── app.ts             # Express app setup
│   └── index.ts           # Entry point
├── tests/                 # Test files
```

## Getting Started

### Prerequisites

- Node.js v16+
- Docker and Docker Compose (for running MySQL)

### Local Development Setup

1. Clone the repository:

```bash
git clone https://github.com/farhanabi/teacher-api.git
cd teacher-api
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Start MySQL with Docker:

```bash
docker compose up -d
```

5. Generate and run migrations:

```bash
pnpm db:generate
pnpm db:migrate
```

6. Start the development server:

```bash
pnpm run dev
```

The API will be available at http://localhost:3000.

## Running Tests

```bash
pnpm run test
```

## API Endpoints

### 1. Register Students

Register one or more students to a specified teacher.

- **URL**: `/api/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "teacher": "teacherken@gmail.com",
    "students": [
      "studentjon@gmail.com",
      "studenthon@gmail.com"
    ]
  }
  ```
- **Success Response**: `204 No Content`

### 2. Get Common Students

Retrieve students common to a given list of teachers.

- **URL**: `/api/commonstudents`
- **Method**: `GET`
- **Query Parameters**: `teacher` (can be repeated for multiple teachers)
- **Example**: `/api/commonstudents?teacher=teacherken@gmail.com&teacher=teacherjoe@gmail.com`
- **Success Response**:
  ```json
  {
    "students": [
      "commonstudent1@gmail.com",
      "commonstudent2@gmail.com"
    ]
  }
  ```

### 3. Suspend Student

Suspend a specified student.

- **URL**: `/api/suspend`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "student": "studentmary@gmail.com"
  }
  ```
- **Success Response**: `204 No Content`

### 4. Retrieve Notification Recipients

Retrieve a list of students who can receive a given notification.

- **URL**: `/api/retrievefornotifications`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "teacher": "teacherken@gmail.com",
    "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
  }
  ```
- **Success Response**:
  ```json
  {
    "recipients": [
      "studentbob@gmail.com",
      "studentagnes@gmail.com",
      "studentmiche@gmail.com"
    ]
  }
  ```

## Error Handling

All endpoints return appropriate HTTP status codes and error messages:

```json
{
  "message": "Some meaningful error message"
}
```

## Production Deployment

For production, build the project:

```bash
pnpm run build
```

Then run the compiled code:

```bash
pnpm start
```
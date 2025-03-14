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
│   │   ├── migrations/    # Generated migration files
│   │   ├── schema.ts      # DrizzleORM schema definitions
│   │   ├── seed.ts        # Database seeder
│   │   └── index.ts       # DB connection
│   ├── services/          # Business logic
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── app.ts             # Express app setup
│   └── index.ts           # Entry point
├── tests/                 # Test files
├── postman/               # Postman collection
├── .env.example           # Example environment variables
└── docker-compose.yml     # Docker configuration
```

## Database Schema

```
┌─────────────┐       ┌──────────────────┐       ┌─────────────┐
│   teachers  │       │  registrations   │       │   students  │
├─────────────┤       ├──────────────────┤       ├─────────────┤
│ id          │───────│ teacherId        │   ┌───│ id          │
│ email       │       │ studentId        │───┘   │ email       │
│ createdAt   │       │ createdAt        │       │ suspended   │
│ updatedAt   │       └──────────────────┘       │ createdAt   │
└─────────────┘                                  │ updatedAt   │
                                                 │             │
                                                 └─────────────┘
```

### Schema Details

**teachers**
- `id`: Integer, Primary Key, Auto Increment
- `email`: Varchar(255), Unique, Not Null
- `createdAt`: Timestamp, Default Now()
- `updatedAt`: Timestamp, Default Now(), On Update Now()

**students**
- `id`: Integer, Primary Key, Auto Increment
- `email`: Varchar(255), Unique, Not Null
- `suspended`: Boolean, Default False
- `createdAt`: Timestamp, Default Now()
- `updatedAt`: Timestamp, Default Now(), On Update Now()

**registrations**
- `teacherId`: Integer, Not Null, Foreign Key → teachers.id
- `studentId`: Integer, Not Null, Foreign Key → students.id
- `createdAt`: Timestamp, Default Now()
- Primary Key: (teacherId, studentId)

## Getting Started

### Prerequisites

- Node.js v16+
- Docker and Docker Compose (for running MySQL)
- pnpm

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
> Note: By default, the MySQL credentials are set to `root:password`. You can modify these in the `.env` file if needed.

4. Start MySQL with Docker:

```bash
docker compose up -d
```

> Note: Wait for MySQL to be fully running (use `docker compose ps` to check status)

5. Run database migrations to create the schema:

```bash
pnpm db:migrate
```

6. Seed the database with initial data:

```bash
pnpm db:seed
```

7. Start the development server:

```bash
pnpm run dev
```

The API will be available at http://localhost:3000.

8. Run tests:

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

## Testing with Postman

A Postman collection is included in the `postman` directory, which contains requests for all API endpoints. To use it:

1. Import the collection into Postman
2. Set the `baseUrl` variable to your API URL (defaults to `http://localhost:3000`)
3. Run the requests to test the API

The collection includes the following requests:
- Health Check
- Register Students
- Get Common Students (Single Teacher)
- Get Common Students (Multiple Teachers)
- Suspend Student
- Retrieve Notification Recipients (With and Without Mentions)
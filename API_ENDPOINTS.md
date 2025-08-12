# HustleHub API Endpoints

This document outlines the available API endpoints for the HustleHub application.

## Authentication

### `POST /api/auth/signup`

Registers a new user.

**Request Body:**

```json
{
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "password": "yourpassword",
  "role": "freelancer", // or "employer"
  "username": "johndoe",
  "referral_code": "optional-referral-code"
}
```

**Response:**

```json
{
  "message": "User created successfully."
}
```

### `POST /api/auth/login`

Logs in an existing user.

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

**Response:**

```json
{
  "message": "Login successful.",
  "user": { ... }, // User object
  "token": "your-auth-token"
}
```

### `POST /api/auth/logout`

Logs out the currently authenticated user.

### `GET /api/auth/me`

Retrieves the profile of the currently authenticated user.

### `PATCH /api/auth/me`

Updates the profile of the currently authenticated user.

**Request Body:**

```json
{
  "bio": "Your updated bio.",
  "skills": ["skill1", "skill2"]
}
```

## Jobs

### `GET /api/jobs/`

Retrieves a list of all open jobs.

**Query Parameters:**

*   `category`: Filter jobs by category ID.

### `GET /api/jobs/recommended/`

Retrieves a list of recommended jobs for the authenticated freelancer.

**Query Parameters:**

*   `category`: Filter recommended jobs by category ID.

### `GET /api/jobs/{id}/`

Retrieves a single job by its ID.

### `POST /api/jobs/`

Creates a new job. (Requires authentication as an employer)

### `PATCH /api/jobs/{id}/`

Updates an existing job. (Requires authentication as the job owner)

### `DELETE /api/jobs/{id}/`

Deletes a job. (Requires authentication as the job owner)

## Job Categories

### `GET /api/job-categories/`

Retrieves a list of all job categories.

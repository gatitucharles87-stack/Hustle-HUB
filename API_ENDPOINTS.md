# HustleHub API Endpoints

This document outlines the required backend API endpoints to support the full functionality of the HustleHub frontend application.

## 1. Authentication

Handles user registration, login, and session management.

### `POST /api/auth/signup`

-   **Description**: Registers a new user.
-   **Role**: Public
-   **Request Body**:
    ```json
    {
      "fullName": "string",
      "email": "string",
      "password": "string",
      "role": "enum('freelancer', 'employer')",
      "availability": { // Optional, for freelancers
        "isRemote": "boolean",
        "serviceAreas": "string[]"
      }
    }
    ```
-   **Response**: `{ "token": "string", "user": { ... } }`

### `POST /api/auth/login`

-   **Description**: Authenticates an existing user.
-   **Role**: Public
-   **Request Body**: `{ "email": "string", "password": "string" }`
-   **Response**: `{ "token": "string", "user": { ... } }`

### `POST /api/auth/logout`

-   **Description**: Logs out the current user by invalidating their token.
-   **Role**: Authenticated
-   **Response**: `{ "message": "Logout successful" }`

### `GET /api/auth/me`

-   **Description**: Retrieves the profile of the currently authenticated user.
-   **Role**: Authenticated
-   **Response**: `{ "user": { ... } }`

---

## 2. User Profiles

Handles fetching and updating user profiles.

### `GET /api/users/:userId`

-   **Description**: Gets the public profile of a specific user (freelancer or employer).
-   **Role**: Public
-   **Response**: `{ "user": { ... } }`

### `PUT /api/users/me`

-   **Description**: Updates the profile of the currently authenticated user.
-   **Role**: Authenticated
-   **Request Body**: `{ "fullName": "string", "bio": "string", "avatarUrl": "string" }`
-   **Response**: `{ "user": { ... } }`

### `PUT /api/users/me/availability`

-   **Description**: Updates a freelancer's availability settings.
-   **Role**: Freelancer
-   **Request Body**: `{ "isRemote": "boolean", "serviceAreas": "string[]" }`
-   **Response**: `{ "message": "Availability updated" }`

### `PUT /api/users/me/password`

-   **Description**: Updates the password for the currently authenticated user.
-   **Role**: Authenticated
-   **Request Body**: `{ "currentPassword": "string", "newPassword": "string" }`
-   **Response**: `{ "message": "Password updated successfully" }`

---

## 3. Jobs

Handles job creation, listing, application, and management.

### `POST /api/jobs`

-   **Description**: Creates a new job posting.
-   **Role**: Employer
-   **Request Body**: `{ "title": "string", "description": "string", "category": "string", "jobType": "enum('remote', 'local')", "location": "string", "budget": "number", "deadline": "date" }`
-   **Response**: `{ "job": { ... } }`

### `GET /api/jobs`

-   **Description**: Gets a list of all available jobs with filtering and pagination.
-   **Role**: Public
-   **Query Parameters**: `?keyword=string&category=string&county=string&subCounty=string&area=string&minBudget=number&maxBudget=number&page=number&limit=number`
-   **Response**: `{ "jobs": [{ ... }], "totalPages": "number", "currentPage": "number" }`

### `GET /api/jobs/:jobId`

-   **Description**: Gets the details of a single job.
-   **Role**: Public
-   **Response**: `{ "job": { ... } }`

### `PUT /api/jobs/:jobId`

-   **Description**: Allows the job owner to update a job posting.
-   **Role**: Employer (Owner)
-   **Response**: `{ "job": { ... } }`

### `POST /api/jobs/:jobId/apply`

-   **Description**: Allows a freelancer to apply for a job.
-   **Role**: Freelancer
-   **Response**: `{ "application": { ... } }`

### `GET /api/jobs/my-listings`

-   **Description**: Gets all job listings created by the authenticated employer.
-   **Role**: Employer
-   **Response**: `{ "jobs": [{ ... }] }`

### `GET /api/jobs/my-applications`

-   **Description**: Gets all job applications submitted by the authenticated freelancer.
-   **Role**: Freelancer
-   **Response**: `{ "applications": [{ ... }] }`

### `GET /api/jobs/:jobId/applicants`

-   **Description**: Gets a list of freelancers who applied for a specific job.
-   **Role**: Employer (Owner)
-   **Response**: `{ "applicants": [{ ... }] }`

### `PUT /api/jobs/:jobId/applicants/:applicantId`

-   **Description**: Accepts or rejects a job applicant.
-   **Role**: Employer (Owner)
-   **Request Body**: `{ "status": "enum('accepted', 'rejected')" }`
-   **Response**: `{ "message": "Applicant status updated" }`

---

## 4. Freelancers (Discovery)

Handles searching and listing freelancers.

### `GET /api/freelancers`

-   **Description**: Gets a list of available freelancers with filtering.
-   **Role**: Public
-   **Query Parameters**: `?keyword=string&category=string&county=string&subCounty=string&area=string&minRating=number`
-   **Response**: `{ "freelancers": [{ ... }] }`

---

## 5. Skill Barter

Handles the skill trading marketplace.

### `POST /api/barter`

-   **Description**: Creates a new skill barter post.
-   **Role**: Authenticated
-   **Request Body**: `{ "title": "string", "description": "string", "skillsOffered": "string", "skillsWanted": "string" }`
-   **Response**: `{ "barterPost": { ... } }`

### `GET /api/barter`

-   **Description**: Gets a list of all active skill barter posts.
-   **Role**: Authenticated
-   **Query Parameters**: `?keyword=string`
-   **Response**: `{ "barterPosts": [{ ... }] }`

### `POST /api/barter/:postId/offer`

-   **Description**: Makes an offer on a barter post.
-   **Role**: Authenticated
-   **Response**: `{ "message": "Offer sent" }`

---

## 6. Commissions & Earnings

Handles financial tracking for freelancers.

### `GET /api/commissions`

-   **Description**: Gets the commission and earnings history for the authenticated freelancer.
-   **Role**: Freelancer
-   **Response**: `{ "summary": { ... }, "history": [{ ... }] }`

---

## 7. Gamification & Badges

Handles XP and badge achievements for freelancers.

### `GET /api/gamification/me`

-   **Description**: Gets the current XP, level, and progress for the authenticated freelancer.
-   **Role**: Freelancer
-   **Response**: `{ "currentXp": "number", "nextLevelXp": "number" }`

### `GET /api/badges/me`

-   **Description**: Gets the list of all badges and their unlocked status for the authenticated freelancer.
-   **Role**: Freelancer
-   **Response**: `{ "badges": [{ ... }] }`

---

## 8. Loyalty & Referrals

Handles the referral program and loyalty points for all users.

### `GET /api/loyalty/me`

-   **Description**: Gets the loyalty point balance and history for the authenticated user.
-   **Role**: Authenticated
-   **Response**: `{ "summary": { ... }, "history": [{ ... }] }`

### `GET /api/referrals/me`

-   **Description**: Gets the referral history and unique referral link for the authenticated user.
-   **Role**: Authenticated
-   **Response**: `{ "referralLink": "string", "history": [{ ... }] }`

---

## 9. Settings

Handles user notification preferences.

### `GET /api/settings/notifications`

-   **Description**: Gets the current notification settings for the authenticated user.
-   **Role**: Authenticated
-   **Response**: `{ "settings": { "jobAlerts": "boolean", "applicationUpdates": "boolean", ... } }`

### `PUT /api/settings/notifications`

-   **Description**: Updates the notification settings for the authenticated user.
-   **Role**: Authenticated
-   **Request Body**: `{ "jobAlerts": "boolean", "applicationUpdates": "boolean", ... }`
-   **Response**: `{ "message": "Settings updated" }`

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

### `POST /api/token/`

-   **Description**: Authenticates an existing user and provides access and refresh tokens.
-   **Role**: Public
-   **Request Body**: `{ "email": "string", "password": "string" }`
-   **Response**: `{ "access": "string", "refresh": "string" }`

### `POST /api/token/refresh/`

-   **Description**: Refreshes an expired access token using a refresh token.
-   **Role**: Public
-   **Request Body**: `{ "refresh": "string" }`
-   **Response**: `{ "access": "string" }`

### `POST /api/auth/logout`

-   **Description**: Logs out the current user by blacklisting their refresh token.
-   **Role**: Authenticated
-   **Request Body**: `{ "refresh_token": "string" }`
-   **Response**: `{ "message": "Successfully logged out." }`

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
-   **Response**: `{ "message": "Application submitted successfully" }`

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

### `POST /api/skill-barter-posts`

-   **Description**: Creates a new skill barter post.
-   **Role**: Authenticated
-   **Request Body**: `{ "title": "string", "description": "string", "skillsOffered": "string", "skillsWanted": "string" }`
-   **Response**: `{ "barterPost": { ... } }`

### `GET /api/skill-barter-posts`

-   **Description**: Gets a list of all active skill barter posts.
-   **Role**: Authenticated
-   **Query Parameters**: `?keyword=string`
-   **Response**: `{ "barterPosts": [{ ... }] }`

### `POST /api/skill-barter-posts/:postId/offer`

-   **Description**: Makes an offer on a barter post.
-   **Role**: Authenticated
-   **Response**: `{ "message": "Offer sent" }`

---

## 6. Commissions & Earnings

Handles financial tracking for freelancers.

### `GET /api/commission-logs`

-   **Description**: Gets the commission and earnings history for the authenticated freelancer/employer.
-   **Role**: Authenticated
-   **Response**: `{ "summary": { ... }, "history": [{ ... }] }`

---

## 7. Gamification & Badges

Handles XP and badge achievements for freelancers.

### `GET /api/xp-logs/me`

-   **Description**: Gets the current XP, level, and progress for the authenticated freelancer.
-   **Role**: Freelancer
-   **Response**: `{ "currentXp": "number", "nextLevelXp": "number", "currentLevel": "number" }`

### `GET /api/user-badges`

-   **Description**: Gets the list of all badges earned by the authenticated freelancer.
-   **Role**: Freelancer
-   **Query Parameters**: `?user_id=number` (to get badges for a specific user)
-   **Response**: `{ "badges": [{ ... }] }`

### `GET /api/badges`

-   **Description**: Gets the list of all available badges.
-   **Role**: Public
-   **Response**: `{ "badges": [{ ... }] }`

---

## 8. Loyalty & Referrals

Handles the referral program and loyalty points for all users.

### `GET /api/loyalty-point-logs`

-   **Description**: Gets the loyalty point balance and history for the authenticated user.
-   **Role**: Authenticated
-   **Response**: `{ "summary": { ... }, "history": [{ ... }] }`

### `GET /api/referrals`

-   **Description**: Gets the referral history and unique referral link for the authenticated user.
-   **Role**: Authenticated
-   **Response**: `{ "referralLink": "string", "history": [{ ... }] }`

---

## 9. Settings

Handles user notification preferences.

### `GET /api/notification-settings`

-   **Description**: Gets the current notification settings for the authenticated user.
-   **Role**: Authenticated
-   **Response**: `{ "settings": { "jobAlerts": "boolean", "applicationUpdates": "boolean", ... } }`

### `PUT /api/notification-settings`

-   **Description**: Updates the notification settings for the authenticated user.
-   **Role**: Authenticated
-   **Request Body**: `{ "jobAlerts": "boolean", "applicationUpdates": "boolean", ... }`
-   **Response**: `{ "message": "Settings updated" }`

## 10. Reviews

Handles user reviews.

### `GET /api/reviews`

-   **Description**: Gets a list of reviews. Can be filtered by `reviewee_id`.
-   **Role**: Public (can view reviews), Authenticated (can create reviews)
-   **Query Parameters**: `?reviewee_id=number`
-   **Response**: `{ "reviews": [{ ... }] }`

### `POST /api/reviews`

-   **Description**: Creates a new review.
-   **Role**: Authenticated
-   **Request Body**: `{ "reviewee": "number", "rating": "number", "comment": "string" }`
-   **Response**: `{ "review": { ... } }`

## 11. Locations

Handles geographical data.

### `GET /api/counties`

-   **Description**: Gets a list of all counties.
-   **Role**: Public
-   **Response**: `{ "counties": [{ ... }] }`

### `GET /api/sub-counties`

-   **Description**: Gets a list of sub-counties. Can be filtered by `county_id`.
-   **Role**: Public
-   **Query Parameters**: `?county_id=number`
-   **Response**: `{ "subCounties": [{ ... }] }`

### `GET /api/wards`

-   **Description**: Gets a list of wards. Can be filtered by `sub_county_id`.
-   **Role**: Public
-   **Query Parameters**: `?sub_county_id=number`
-   **Response**: `{ "wards": [{ ... }] }`

### `GET /api/neighborhood-tags`

-   **Description**: Gets a list of neighborhood tags.
-   **Role**: Public
-   **Response**: `{ "neighborhoodTags": [{ ... }] }`
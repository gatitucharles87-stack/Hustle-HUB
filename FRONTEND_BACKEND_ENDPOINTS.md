# HustleHub API: Frontend to Backend Mapping

This document provides a comprehensive guide for integrating the HustleHub frontend with the backend API. It outlines all available endpoints, their functionalities, request/response formats, and how they should be mapped to frontend components.

## 1. Authentication

Authentication is handled via JSON Web Tokens (JWT). The frontend must acquire a token pair (access and refresh) and include the access token in the `Authorization` header for all protected requests.

### 1.1. `POST /api/token/`

- **Description**: Obtains a new JWT access and refresh token pair.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- **Response**:
  ```json
  {
    "access": "...",
    "refresh": "..."
  }
  ```
- **Frontend Mapping**: This endpoint is used in the **Login Form**. Upon successful login, store the `access` and `refresh` tokens securely (e.g., in `localStorage` or a secure cookie).

### 1.2. `POST /api/token/refresh/`

- **Description**: Refreshes an expired access token using a valid refresh token.
- **Request Body**:
  ```json
  {
    "refresh": "your_refresh_token"
  }
  ```
- **Response**:
  ```json
  {
    "access": "new_access_token"
  }
  ```
- **Frontend Mapping**: Implement a request interceptor (e.g., using Axios) to automatically refresh the token when a `401 Unauthorized` error is received.

---

## 2. Feature-Based Endpoint Breakdown

### 2.1. User Management

#### Endpoints

-   **`POST /api/users/`**: Creates a new user (registration).
-   **`GET /api/users/{id}/`**: Retrieves the details of a specific user.
-   **`PUT /api/users/{id}/`**: Updates the details of a specific user.
-   **`GET /api/notification-settings/`**: Retrieves the notification settings for the logged-in user.
-   **`PUT /api/notification-settings/`**: Updates the notification settings for the logged-in user.

#### Logic Flow

1.  A new user is created via the registration form, which sends a `POST` request to `/api/users/`.
2.  Once logged in, the user can view their profile by fetching their data from `/api/users/{id}/`.
3.  The user can update their profile information with a `PUT` request to `/api/users/{id}/`.
4.  The user can manage their notification preferences via the `/api/notification-settings/` endpoint.

### 2.2. Job Lifecycle

#### Endpoints

-   **`GET /api/job-categories/`**: Retrieves a list of all job categories.
-   **`POST /api/jobs/`**: Creates a new job.
-   **`GET /api/jobs/`**: Retrieves a list of jobs with optional filters.
-   **`GET /api/jobs/{id}/`**: Retrieves the details of a specific job.
-   **`POST /api/job-applications/`**: Creates a new job application.
-   **`GET /api/job-applications/`**: Retrieves a list of job applications for the logged-in user.
-   **`POST /api/reviews/`**: Creates a new review for a completed job.

#### Logic Flow

1.  An employer creates a new job by sending a `POST` request to `/api/jobs/`. The form should include a dropdown populated with data from `/api/job-categories/`.
2.  Freelancers can search and filter for jobs by sending a `GET` request to `/api/jobs/`.
3.  A freelancer can view the details of a job by fetching data from `/api/jobs/{id}/`.
4.  To apply for a job, a freelancer sends a `POST` request to `/api/job-applications/`.
5.  Employers and freelancers can view their job applications via a `GET` request to `/api/job-applications/`.
6.  After a job is completed, the employer or freelancer can leave a review by sending a `POST` request to `/api/reviews/`.

### 2.3. Skill Bartering

#### Endpoints

-   **`POST /api/skill-barter-posts/`**: Creates a new skill barter post.
-   **`GET /api/skill-barter-posts/`**: Retrieves a list of skill barter posts.
-   **`POST /api/skill-barter-applications/`**: Creates a new application for a skill barter post.
-   **`POST /api/skill-barter-offers/`**: Creates a new offer for a skill barter post.

#### Logic Flow

1.  A user creates a new skill barter post with a `POST` request to `/api/skill-barter-posts/`.
2.  Other users can view available skill barter posts by fetching data from `/api/skill-barter-posts/`.
3.  A user can apply to a post by sending a `POST` request to `/api/skill-barter-applications/`.
4.  Alternatively, a user can make an offer on a post with a `POST` request to `/api/skill-barter-offers/`.

### 2.4. Gamification

#### Endpoints

-   **`GET /api/badges/`**: Retrieves a list of all available badges.
-   **`GET /api/user-badges/?user_id={id}`**: Retrieves a list of badges for a specific user.
-   **`GET /api/xp-logs/`**: Retrieves a list of all XP logs (admin only).
-   **`GET /api/loyalty-point-logs/`**: Retrieves a list of all loyalty point logs (admin only).

#### Logic Flow

1.  The frontend can display a list of all possible badges by fetching data from `/api/badges/`.
2.  A user's earned badges can be displayed by fetching data from `/api/user-badges/?user_id={id}`.
3.  XP and loyalty points are automatically awarded by the backend based on user actions (e.g., completing a job, referring a user). The admin can view these logs.

### 2.5. Notifications

#### Endpoints

-   **`GET /api/notifications/`**: Retrieves a list of notifications for the logged-in user.
-   **`GET /api/notifications/unread-count/`**: Retrieves the number of unread notifications.
-   **`POST /api/notifications/mark-as-read/`**: Marks one or more notifications as read.
-   **`POST /api/notifications/mark-all-as-read/`**: Marks all unread notifications for the user as read.
-   **`DELETE /api/notifications/{id}/`**: Deletes a single notification.

#### Logic Flow

1.  The frontend should periodically poll `/api/notifications/unread-count/` to display a badge on the notifications icon.
2.  When the user opens the notifications panel, the frontend should fetch the full list of notifications from `/api/notifications/`.
3.  As the user reads notifications, the frontend should mark them as read using `/api/notifications/mark-as-read/` or `/api/notifications/mark-all-as-read/`.

### 2.6. Location Services

#### Endpoints

-   **`GET /api/counties/`**: Retrieves a list of all counties.
-   **`GET /api/sub-counties/?county_id={id}`**: Retrieves a list of sub-counties for a given county.
-   **`GET /api/wards/?sub_county_id={id}`**: Retrieves a list of wards for a given sub-county.
-   **`GET /api/neighborhood-tags/`**: Retrieves a list of all neighborhood tags.

#### Logic Flow

1.  When a user needs to select a location, the frontend should first fetch the list of counties from `/api/counties/`.
2.  Once a county is selected, the frontend should fetch the corresponding sub-counties from `/api/sub-counties/?county_id={id}`.
3.  This process continues for wards, allowing for a hierarchical location selection.

---
This document provides a comprehensive overview of the backend API and its mapping to the frontend. As the application grows, this document should be updated to reflect any new endpoints or changes to existing ones.

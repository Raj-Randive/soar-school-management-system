
<!-- ![Logo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/th5xamgrr6se0x5ro4g6.png) -->


# School Management System API

A robust RESTful API for managing schools, users, and administrative roles, built with Node.js, Express, and MongoDB. This project is designed to simplify school administration tasks such as managing schools, associating admins, and implementing and user roles with Role-Based Access Control (RBAC).



## Features

- **Role-Based Access Control (RBAC)**:
  - Supports multiple user roles including `superadmin` and `schooladmin`.
  - Grants role-specific permissions to manage resources effectively.

- **CRUD Operations**:
  - **Schools**:
    - Create, Read, Update, and Delete school profiles.
    - Maintain school details and metadata for seamless management.
  - **Users**:
    - Manage user profiles, including creation, updates, and deletions.
    - Associate users with specific schools and roles.

- **Admin Management**:
  - Assign multiple `schooladmin` roles to a single school.
  - Allow `superadmin` users to oversee and manage all school admins.

- **Secure Authentication**:
  - Token-based authentication using JSON Web Tokens (JWT).
  - Enforces strict authorization checks for sensitive operations.

- **Error Handling**:
  - Provides clear and consistent error responses for better debugging and user experience.
  - Includes appropriate HTTP status codes:
    - `400 Bad Request`: For validation errors and invalid client inputs.
    - `401 Unauthorized`: For authentication failures.
    - `403 Forbidden`: For insufficient permissions.
    - `404 Not Found`: For resources that do not exist.
    - `500 Internal Server Error`: For unhandled exceptions and server issues.
  - Centralized error dispatcher ensures uniform error message formatting.
  - Logs errors for analysis and debugging.

- **Security Measures**:
  - Utilizes **Helmet** to enhance security by setting HTTP headers.
  - Encrypts passwords with **bcrypt.js** for safe storage.
  - Implements input validation to prevent injection attacks.

- **API Rate Limiting**:
  - Protects endpoints from abuse with request rate limiting.
  - Configurable rate limits based on user roles and endpoints.
  - Implemented using `express-rate-limit`


<br/>

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **RBAC Middleware**: Custom middleware for role-based access.


---

<br/>

## Installation and Setup(Locally)

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local or cloud instance)

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Raj-Randive/soar-school-management-system.git
   cd soar-school-management-system
   ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Environments Variables**: Create a `.env` file in the root directory with the following:
    ```bash
    SERVICE_NAME=SchoolManagement
    MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/schoolDB
    JWT_SECRET=your_jwt_secret
    REDIS_HOST=127.0.0.1
    REDIS_PORT=6379
    ```

4. **Start the Server**:
    ```bash
    node .\index.js
    ```

5. **Access API: The server will run on http://localhost:5111**:


<br/>
<br/>



## Running Tests

To run tests, run the following command

```bash
  npm run test
```


## Demo

gif or link to demo

<br/>

## API Documentation

[Documentation - Click here to see Postman API documenter](https://documenter.getpostman.com/view/26850434/2sAYJ6DfSX)


## Database Schema Design

[Database Schema Design - Click here to see database design](https://documenter.getpostman.com/view/26850434/2sAYJ6DfSX)

<br/>

## API Reference

### Request methods


| Method   | Description                              |
| -------- | ---------------------------------------- |
| `GET`    | Used to retrieve a single item or a collection of items. |
| `POST`   | Used when creating new items e.g. a new user, post, comment etc. |
| `PATCH`  | Used to update one or more fields on an item e.g. update e-mail of user. |
| `PUT`    | Used to replace a whole item (all fields) with new data. |
| `DELETE` | Used to delete an item.                  |

### Examples

#### <strong>USER-AUTH</strong>

| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `POST`    | `/api/auth/register`                             | Create a new user.                      |
| `POST`   | `/api/auth/login`                             | Logs in a user.                       |
| `POST`    | `/api/auth/logout`                          | Logs out a user. 


#### <strong>SCHOOLS</strong>

| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `POST`    | `/api/school/create`                             | Create a new school (superadmins only).                      |
| `GET`   | `/api/school`                             | List all schools (superadmins only).                       |
| `GET`    | `/api/school/:id`                          | Get details of a specific school. 
| `PUT`    | `/api/school/:id`                          | Update school details (superadmins only). 
| `DELETE`    | `/api/school/:id`                          | Delete a school (superadmins only).


#### <strong>CLASSROOMS</strong>

| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `POST`    | `/api/classroom/`                             | Add a new classroom (school-admins).                      |
| `GET`   | `/api/classroom/:school_id`                             | List all classrooms in a school.                       |
| `GET`    | `/api/classroom/:id/details`                          | Get details of a specific classroom. 
| `PUT`    | `/api/classroom/:id/update`                          | Update classroom details (school-admins). 
| `DELETE`    | `/api/classroom/:id`                          | Remove a classroom (school-admins). 

#### <strong>STUDENTS</strong>

| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `POST`    | `/api/student/:school_id`                             | Enroll a new student (schooladmins).                      |
| `GET`   | `/api/student/:school_id`                             | List all students in a school (schooladmins, superadmins).                       |
| `GET`    | `/api/student/details/:id`                          | Get details of a specific student (schooladmins, superadmins). 
| `PUT`    | `/api/student/:id`                          | Update student profile (schooladmins). 
| `DELETE`    | `/api/student/:id`                          | Mark a student as inactive (schooladmins). 



<br/>


<!-- ## Deployment

To deploy this project run

```bash
  npm run deploy
``` -->


## Authors

- [@raj-randive](https://github.com/Raj-Randive)


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://rajrandive.vercel.app/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rajrandive14/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/RajRandive_)


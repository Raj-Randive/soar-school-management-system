
<!-- ![Logo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/th5xamgrr6se0x5ro4g6.png) -->


# School Management System API

A robust RESTful API for managing schools, users, and administrative roles, built with Node.js, Express, and MongoDB. This project is designed to simplify school administration tasks such as managing schools, associating admins, and implementing and user roles with Role-Based Access Control (RBAC).



## Features

- **Role-Based Access Control (RBAC)**: Supports roles like `superadmin` and `schooladmin`.
- **CRUD Operations**:
  - Schools: Create, Read, Update, Delete.
  - Users: Manage user profiles and school associations.
- **Admin Management**: Assign multiple admins to a school.
- **Secure Authentication**: Authenticate and authorize users with token-based mechanisms.



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
    nodemon .\index.js
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


## API Documentation

[Documentation - Click here](https://documenter.getpostman.com/view/26850434/2sAYJ6DfSX)


## API Reference

#### Get all items

```http
  GET /api/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |


<br/>
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


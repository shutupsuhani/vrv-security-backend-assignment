
---

# **User Profile Management System with Role-based Access Control**

## **Project Overview**

This project is a **User Profile Management System** that allows **Admins**, **Managers**, and **Users** to perform specific operations based on their roles. It incorporates role-based access control (RBAC), enabling varying levels of access to user profiles. Admin users have the most permissions, while Managers and regular Users have limited access. 

The system provides the following features:
- **View Profile**: View user profiles based on access rights (e.g., Admin can view all profiles, Managers can view non-Admin profiles, and Users can only view their own profile).
- **Update Profile**: Allows users to update their own profile, with Admins and Managers having the ability to update other users’ profiles, except Admin profiles.
- **Delete Profile**: Only Admins can delete user profiles.
- **Role-based Permissions**: Ensures that each user type has the appropriate permissions for viewing, updating, and deleting profiles.
- **JWT Authentication**: Secure authentication using JSON Web Tokens (JWT) for verifying users and managing session-based access.

### **Technologies Used**
- **Node.js**: Backend server environment.
- **Express.js**: Web framework for building the RESTful API.
- **MongoDB**: Database to store user information and profiles.
- **Mongoose**: ODM for interacting with MongoDB.
- **JWT (JSON Web Tokens)**: For user authentication and managing access control.
- **Bcrypt**: For hashing passwords and securely storing them.
- **dotenv**: For managing environment variables securely.

---

## **Key Features**

### **1. Role-based Access Control**
- **Admin**: Can view, update, and delete any user's profile.
- **Manager**: Can view and update profiles (excluding Admin profiles), but cannot delete users.
- **User**: Can only view and update their own profile, and cannot delete any profile.

### **2. User Profile Management**
- **View Profile**: Users can view their own profile, Managers can view all non-Admin profiles, and Admins can view any user’s profile.
- **Update Profile**: Users can update their own profiles, while Admins and Managers can update profiles of non-Admin users.
- **Delete Profile**: Only Admins can delete user profiles.

### **3. Authentication & Security**
- **JWT Authentication**: Ensures that only authorized users can access and modify profiles.
- **Password Hashing**: Uses **bcrypt** to securely hash user passwords before storing them in the database.

---

## **Installation Instructions**

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-project-name.git
   ```
2. Navigate to the project directory:
   ```bash
   cd your-project-name
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add your environment variables (e.g., MongoDB connection string, JWT secret key):
   ```
   MONGODB_URI=your-mongo-db-connection-uri
   JWT_SECRET=your-jwt-secret-key
   PORT=5000
   ```
5. Start the server:
   ```bash
   npm start
   ```

---

## **API Endpoints**

### **1. View Profile**
- **GET** `/api/profile/view/:userId`
- Accessible by: Admin, Manager, and User (for their own profile)

### **2. Update Profile**
- **PUT** `/api/profile/update/:userId`
- Accessible by: Admin (any user), Manager (non-Admin users), and User (their own profile)

### **3. Delete Profile**
- **DELETE** `/api/profile/delete/:userId`
- Accessible by: Admin only

### **4. View All Users**
- **GET** `/api/profile/get-all`
- Accessible by: Admin only

---

## **Project Structure**
```
/config
  |-- db.js            # Database connection setup
/controllers
  |-- profileController.js  # Contains the logic for managing profiles
/middlewares
  |-- authMiddleware.js  # JWT authentication middleware
  |-- roleMiddleware.js  # Role-based access control middleware
/models
  |-- userModel.js      # Mongoose model for user schema
/routes
  |-- profileRoutes.js  # Contains all profile-related routes
```

---

## **How to Contribute**

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a pull request with a description of your changes.

---

## **Future Enhancements**
- Implement pagination for the user list.
- Add email verification and password reset features.
- Allow users to update their profile picture.
- Integrate third-party authentication (Google, Facebook, etc.).
- Improve security with rate limiting and IP blocking for failed login attempts.

---

## **Conclusion**

This project demonstrates the implementation of role-based access control (RBAC) for user profile management, providing secure authentication and authorization mechanisms. The system is scalable, easily extendable, and can be integrated with other features such as notifications and activity tracking. It is an ideal foundation for building more advanced user management systems with varying access levels.

---

This README will give recruiters a clear understanding of the project’s functionality and what has been implemented. You can adjust it further based on your specific use case.

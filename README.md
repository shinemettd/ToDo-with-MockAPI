# Task Manager Web Application

This is a simple web application for managing tasks. Users can log in, add new tasks, edit existing tasks, and delete tasks. The application uses a <strong>![MockAPI](https://mockapi.io)</strong> for storing user and tasks data.

## Features

- **User Authentication:**
  - Users can sign up with a username and password.
  - Existing users can log in.

- **Task Management:**
  - Users can add new tasks with a name, description, and deadline.
  - Tasks can be edited to update the name and description.
  - Users can delete tasks.

- **Responsive Design:**
  - The application provides a responsive design for a seamless experience on different devices.

## Usage

1. **Sign Up / Log In:**
   - Open the "login.html" page in your web browser.
   - Sign up with a new account or log in with existing credentials.

2. **Task Management:**
   - After logging in, you will be redirected to the "index.html" page.
   - Click the "New Task" button to add a new task.
   - Fill in the task details, and click "SUBMIT" to save the task.
   - Existing tasks are displayed on the page with options to edit and delete.

3. **Log Out:**
   - Click the "Log out" button in the top right corner to log out.

## Technologies Used

- HTML, CSS for the front-end interface.
- JavaScript for client-side logic.
- Mock API for storing user and task data.

## File Structure

- **index.html:** Main page for task management.
- **login.html:** Page for user authentication.
- **styles/:** Folder containing CSS stylesheets.
- **scripts/:** Folder containing JavaScript scripts.

## Mock API Usage

This application utilizes a mock API for handling user and task data. The mock API serves as a temporary storage solution for demonstration purposes, allowing users to interact with the application without the need for a real backend server.

## API Endpoints

- **User Endpoint:**
  - `POST /api/v1/user`: Create a new user.
  - `GET /api/v1/user`: Retrieve user data.

- **Task Endpoint:**
  - `POST /api/v1/user/{userId}/task`: Add a new task for the specified user.
  - `GET /api/v1/user/{userId}/task`: Retrieve tasks for the specified user.
  - `PUT /api/v1/user/{userId}/task/{taskId}`: Update an existing task.
  - `DELETE /api/v1/user/{userId}/task/{taskId}`: Delete a task.

 ### Note

- **Internet Connection:** Ensure an active internet connection to interact with the <strong>![MockAPI](https://mockapi.io)</strong>. 

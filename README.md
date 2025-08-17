Blogging Application
A full-featured blogging platform built with Node.js, Express, EJS templating, and MongoDB. This application enables users to create, edit, and manage blog posts, with dynamic user authentication and clean, responsive UI.

Table of Contents
Features
Installation
Usage
Project Structure
Contributing
License
Contact

Features
User registration and login authentication
Create, edit, publish and delete blog posts
View all posts, user-specific posts, and individual post pages
Comment system on posts
RESTful routes using Express
EJS templating for dynamic HTML
MongoDB storage for posts and users

Installation
To run this project locally:

bash
git clone https://github.com/sukriti-waani/blogging_application.git
cd blogging_application
npm install

Set up your environment variables (.env file):
MONGO_URI=your_mongodb_uri
SESSION_SECRET=your_session_secret

Then start the server:
npm start
The application will run on http://localhost:3000 by default.

Usage
Register a new account or log in
Create new posts from your dashboard
Edit or delete your posts at any time
Browse all posts on the homepage
Comment on posts

Project Structure
blogging_application/
│
├── middlewares/       # Custom middleware
├── models/            # Mongoose models
├── node_modules/      # Dependencies
├── public/            # Static assets
├── routes/            # Express routes
├── services/          # Modular business logic
├── views/             # EJS templates
├── index.js           # Entry point
├── package.json       # Project metadata
└── README.md          # Project documentation

Contributing
Contributions are welcome! Please open issues and submit pull requests for new features, improvements, or bugs.
See the issues page for tasks and enhancements.

Contact
Created by sukriti-waani.
For questions or feedback, open an issue or contact via GitHub.

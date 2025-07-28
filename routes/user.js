const { Router } = require("express");
const User = require("../models/user");

// Create a new router instance
const router = Router();

// Define a GET route for '/signin' that renders the 'signin' view/page
router.get("/signin", (req, res) => {
  // Render the 'signin' template/page when this route is accessed
  return res.render("signin");
});

// Define a GET route for '/signup' that renders the 'signup' view/page
router.get("/signup", (req, res) => {
  // Render the 'signup' template/page when this route is accessed
  return res.render("signup");
});

// Define a POST route handler for the '/signin' endpoint
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Extract 'email' and 'password' from the request body (submitted form data)
    const { email, password } = req.body;

    // Call a static method 'matchPasswordAndGenerateToken' on the User model
    // This method likely verifies the email and password and returns a JWT token if valid
    const token = await User.matchPasswordAndGenerateToken(email, password);

    // Log the generated token to the console for debugging purposes (ensure no sensitive data is exposed)
    console.log("token", token);

    // Set the token in a cookie named 'token' and redirect the user to the homepage ('/')
    // This enables the client to store the token for subsequent authenticated requests
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
});

// Define a POST route for '/signup' to handle form submissions for user registration
router.post("/signup", async (req, res) => {
  // Destructure fullName, email, and password from the request body (form data)
  const { fullName, email, password } = req.body;

  // Create a new user in the database using the provided data
  await User.create({
    fullName,
    email,
    password,
  });

  // After successful signup, redirect the user to the homepage ("/")
  return res.redirect("/");
});

// Define a GET route for '/logout'
router.get("/logout", (req, res) => {
  // Clear the 'token' cookie from the client
  res
    .clearCookie("token")

    // Redirect the user to the homepage ('/')
    .redirect("/");
});

// Export the router so it can be used in other parts of the application
module.exports = router;

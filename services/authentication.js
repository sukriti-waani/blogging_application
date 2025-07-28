// Import the 'jsonwebtoken' package which is used to create and verify JWT tokens
const JWT = require("jsonwebtoken");

// Define a secret key used for signing and verifying the JWT token
const secret = "$@123";

// Function to create a JWT token for a given user object
function createTokenForUser(user) {
  // Define the payload (data) to be embedded in the token
  const payload = {
    _id: user._id,                 // Include user's unique ID
    email: user.email,             // Include user's email
    profileImageURL: user.profileImageURL, // Include user's profile image URL
    role: user.role,               // Include user's role
  };

  // Sign the token using the payload and the secret key
  const token = JWT.sign(payload, secret);
  
  // Return the generated token
  return token;
}

// Function to validate a provided JWT token
function validateToken(token) {
  // Verify and decode the token using the secret key
  // NOTE: Typo here: 'toke' should be 'token'
  const payload = JWT.verify(token, secret);
  
  // Return the decoded payload if token is valid
  return payload;
}

// Export both functions to be usable in other parts of the application
module.exports = {
  createTokenForUser,
  validateToken,
};

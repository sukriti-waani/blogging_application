const { validateToken } = require("../services/authentication");

// install cookie-parser in terminal using: npm install cookie-parser
// This middleware depends on cookie-parser to read cookies from incoming requests

// Define a middleware function factory that checks for an authentication cookie
function checkForAuthenticationCookie(cookieName) {
  // Return a middleware function that Express can use
  return (req, res, next) => {
    // Extract the value of the specified cookie from the request's cookies
    const tokenCookieValue = req.cookies[cookieName];

    // If the cookie doesn't exist, skip authentication and proceed to the next middleware/handler
    if (!tokenCookieValue) {
      return next();
    }

    try {
      // Try to validate the token using the validateToken function (likely verifying JWT)
      const userPayload = validateToken(tokenCookieValue);

      // If token is valid, attach the decoded user information to the request object
      req.user = userPayload;
    } catch (error) {
      // If token verification fails (e.g., token invalid or expired), do nothing
    }

    // Proceed to the next middleware or route handler
    return next();
  };
}

// Export the authentication middleware function so it can be used elsewhere
module.exports = {
  checkForAuthenticationCookie,
};

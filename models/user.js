// Import required functions from 'crypto' module for hashing and generating random bytes
const { randomBytes, createHmac } = require("crypto");
// Import Schema and model functions from 'mongoose' for defining and creating MongoDB models
const { Schema, model } = require("mongoose");
const { createTokenForUser } = require("../services/authentication");

// Define a Mongoose schema for the 'User' model
const userSchema = new Schema(
  {
    // 'fullName' field must be a String and is required
    fullName: {
      type: String,
      required: true,
    },
    // 'email' field must be a String, required, and must be unique across users
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // 'salt' field stores the unique salt string for password hashing
    salt: {
      type: String,
    },
    // 'password' field stores the hashed password, must be required
    // Removed 'unique' constraint because different users can have the same hashed password by coincidence
    password: {
      type: String,
      required: true,
    },
    // 'profileImageURL' stores the URL of user's profile image with a default value if not provided
    profileImageURL: {
      type: String,
      default: "/images/default.png",
    },
    // 'role' indicates if the user is an 'ADMIN' or 'USER' with default as 'USER'
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  {
    // Enables automatic tracking of 'createdAt' and 'updatedAt' timestamps
    timestamps: true,
  }
);

// A pre-save hook to hash the password before saving the user document
userSchema.pre("save", function (next) {
  // 'this' refers to the current user document
  const user = this;

  // If the password is not modified, skip hashing and proceed to the next middleware
  if (!user.isModified("password")) return next();

  // Generate a random salt of 16 bytes and convert it to a hex string
  const salt = randomBytes(16).toString("hex");

  // Create a hashed password using HMAC with SHA256 algorithm and the generated salt
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password) // Use the plain password provided
    .digest("hex"); // Generate the final hash in hexadecimal format

  // Store the generated salt in the user document
  user.salt = salt;
  // Store the hashed password in the user document
  user.password = hashedPassword;

  // Proceed to the next middleware or save operation
  next();
});

// Define a static method 'matchPasswordAndGenerateToken' on the userSchema for verifying user credentials
userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
  // 'this' refers to the User model. Find the user by their email.
  const user = await this.findOne({ email });

  // If no user is found with the provided email, throw an error
  if (!user) throw new Error("User not found!");

  // Retrieve the salt stored in the user's record
  const salt = user.salt;
  // Retrieve the hashed password stored in the user's record
  const hashedPassword = user.password;

  // Hash the provided plain text password using the same salt
  const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  // Compare the hashed version of the provided password with the stored hash
  if (hashedPassword !== userProvidedHash)
    throw new Error("Incorrect Password");

  const token = createTokenForUser(user);
  return token;
});

// Create the User model from the defined schema
const User = model("user", userSchema);

// Export the User model so it can be used in other files like routes or controllers
module.exports = User;

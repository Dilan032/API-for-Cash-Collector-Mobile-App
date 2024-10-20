const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

// Function to generate JWT
const generateToken = (UserName) => {
    const token = jwt.sign(
        {UserName: UserName}, // Payload with the UserName
        process.env.TOKEN_KEY, // Secret key from .env
        {expiresIn: process.env.TOKEN_EXPIRATION_TIME} // Use expires time from (.env)
    );
    return token;
};

// Export the function 
module.exports = { generateToken };
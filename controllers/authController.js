// Import necessary modules and dependencies
const User = require('../models/user.js'); // Assuming you have a User model

const RegisterController = async (req, res) => {
  // Implement logic to create a new user and send the response
  try {
    const { username, email, password, role } = req.body;

    // Validation
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
     //save
     const user = await new User({
        username,
        email,
        password: hashedPassword,
        role,
        
      }).save();
    res.status(201).json({ message: 'User created successfully', user: user });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

module.exports = {
    RegisterController
}
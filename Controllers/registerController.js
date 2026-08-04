const bcrypt = require('bcrypt');
const User = require('../Models/users');

const registerController = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required',
        });
    }

    const duplicate = await User.findOne({ username });

    if (!duplicate) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                username,
                password: hashedPassword,
            });

            const savedUser = await newUser.save();
            return res.status(201).json({ message: 'User created', userId: savedUser._id });
        } catch (error) {
            console.error(error);
            // Handle duplicate key errors (E11000) gracefully
            if (error && error.code === 11000) {
                const dupField = Object.keys(error.keyValue || {})[0] || 'field';
                return res.status(400).json({ message: `Duplicate ${dupField}`, error: error.message });
            }
            return res.status(500).json({ message: 'Failed to create user', error: error.message });
        }
    } else {
        return res.status(400).json({ message: 'User already exists' });
    }

}
module.exports = registerController;
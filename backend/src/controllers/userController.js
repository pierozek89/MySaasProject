const { User, Client } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash'] }
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create user
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role, client_id } = req.body;
    
    // Check if client exists
    if (client_id) {
      const client = await Client.findByPk(client_id);
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [User.sequelize.Op.or]: [
          { username },
          { email }
        ]
      }
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    
    // Create the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await User.create({
      username,
      email,
      password_hash: hashedPassword,
      role: role || 'PRACOWNIK',
      client_id
    });
    
    // Return user without password
    const userData = user.get({ plain: true });
    delete userData.password_hash;
    
    res.status(201).json(userData);
  } catch (err) {
    console.error(err);
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Add other user controller methods (getById, update, delete) here
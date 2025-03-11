const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// Uncomment when implementing auth
// const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', userController.getUsers);
router.post('/', userController.createUser);
// Add other routes when you implement the controller methods

module.exports = router;
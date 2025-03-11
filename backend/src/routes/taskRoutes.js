const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
// Uncomment when implementing auth
// const { protect } = require('../middleware/authMiddleware');

// Routes that match your React frontend API calls
router.get('/', taskController.getAllTasks);
router.post('/', taskController.createTask);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
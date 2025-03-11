const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.get('/task/:taskId', commentController.getCommentsByTask);
router.post('/task/:taskId', commentController.createComment);
router.delete('/:commentId', commentController.deleteComment);

module.exports = router;
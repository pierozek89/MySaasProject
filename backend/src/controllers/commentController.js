const { Comment, User, Task } = require('../models');

// Get comments for a task
exports.getCommentsByTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    
    // Verify task exists
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const comments = await Comment.findAll({
      where: { task_id: taskId },
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create comment
exports.createComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content, user_id } = req.body;
    
    // Validate content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }
    
    // Verify task exists
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const comment = await Comment.create({
      task_id: taskId,
      user_id,
      content
    });
    
    // Get complete comment with user info
    const createdComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ]
    });
    
    res.status(201).json(createdComment);
  } catch (err) {
    console.error(err);
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    await comment.destroy();
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
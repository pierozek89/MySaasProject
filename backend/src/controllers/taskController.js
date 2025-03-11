const { Task, User, Client, Workstation, Comment, sequelize } = require('../models');

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      attributes: {
        include: [
          // Fix: Properly formatted SQL literal for PostgreSQL
          [
            sequelize.literal(`(SELECT COUNT(*) FROM "comments" WHERE "comments"."task_id" = "Task"."id")`),
            'commentCount'
          ]
        ]
      },
      include: [
        {
          model: User,
          as: 'AssignedUser',
          attributes: ['id', 'username']
        },
        {
          model: Workstation,
          attributes: ['id', 'name']
        },
        {
          model: Comment,
          as: 'Comments',
          attributes: ['id', 'content', 'created_at'],
          limit: 1,
          order: [['created_at', 'DESC']],
          include: [
            {
              model: User,
              attributes: ['username']
            }
          ]
        }
      ],
      order: [['updated_at', 'DESC']]
    });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { name, client_id, status, assigned_to, workstation_id, priority } = req.body;
    
    // Validation
    if (!name || name.length > 150) {
      return res.status(400).json({ message: 'Name is required and must be less than 150 characters' });
    }
    
    if (!workstation_id) {
      return res.status(400).json({ message: 'Workstation is required' });
    }

    // Verify client exists
    const client = await Client.findByPk(client_id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    // Verify workstation exists
    const workstation = await Workstation.findByPk(workstation_id);
    if (!workstation) {
      return res.status(404).json({ message: 'Workstation not found' });
    }
    
    const task = await Task.create({
      name,
      client_id,
      status,
      assigned_to,
      workstation_id,
      priority: priority || 'ZWYKŁY',
      created_by: req.user?.id // If you have auth middleware
    });
    
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'AssignedUser',
          attributes: ['id', 'username']
        },
        {
          model: User,
          as: 'Creator',
          attributes: ['id', 'username']
        },
        {
          model: Workstation,
          attributes: ['id', 'name']
        },
        {
          model: Comment,
          as: 'Comments',
          include: [
            {
              model: User,
              attributes: ['id', 'username']
            }
          ],
          order: [['created_at', 'DESC']]
        }
      ]
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    const { name, status, assigned_to, workstation_id, priority } = req.body;
    
    // Validate name if provided
    if (name && name.length > 150) {
      return res.status(400).json({ message: 'Name must be less than 150 characters' });
    }
    
    // Prevent changing from IN_PROGRESS or COMPLETED to NEW
    if (status === 'NOWE' && (task.status === 'W_TRAKCIE' || task.status === 'ZAKONCZONE')) {
      return res.status(400).json({ 
        message: 'Cannot change task status from In Progress or Completed back to New'
      });
    }
    
    await task.update({
      name: name || task.name,
      status: status || task.status,
      assigned_to: assigned_to || task.assigned_to,
      workstation_id: workstation_id || task.workstation_id,
      priority: priority || task.priority
    });
    
    res.json(task);
  } catch (err) {
    console.error(err);
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
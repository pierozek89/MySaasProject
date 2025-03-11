const { Workstation, Client } = require('../models');

// Get all workstations
exports.getAllWorkstations = async (req, res) => {
  try {
    const workstations = await Workstation.findAll({
      include: [
        {
          model: Client,
          attributes: ['id', 'name']
        }
      ],
      order: [['name', 'ASC']]
    });
    res.json(workstations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get workstations by client ID
exports.getWorkstationsByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    
    // Verify client exists
    const client = await Client.findByPk(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    const workstations = await Workstation.findAll({
      where: { client_id: clientId },
      order: [['name', 'ASC']]
    });
    
    res.json(workstations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create workstation
exports.createWorkstation = async (req, res) => {
  try {
    const { name, description, client_id } = req.body;
    
    // Verify client exists
    const client = await Client.findByPk(client_id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    const workstation = await Workstation.create({
      name,
      description,
      client_id
    });
    
    res.status(201).json(workstation);
  } catch (err) {
    console.error(err);
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Get workstation by ID
exports.getWorkstationById = async (req, res) => {
  try {
    const workstation = await Workstation.findByPk(req.params.id, {
      include: [
        {
          model: Client,
          attributes: ['id', 'name']
        }
      ]
    });
    
    if (!workstation) {
      return res.status(404).json({ message: 'Workstation not found' });
    }
    
    res.json(workstation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update workstation
exports.updateWorkstation = async (req, res) => {
  try {
    const workstation = await Workstation.findByPk(req.params.id);
    
    if (!workstation) {
      return res.status(404).json({ message: 'Workstation not found' });
    }
    
    const { name, description } = req.body;
    
    await workstation.update({
      name: name || workstation.name,
      description: description || workstation.description
    });
    
    res.json(workstation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete workstation
exports.deleteWorkstation = async (req, res) => {
  try {
    const workstation = await Workstation.findByPk(req.params.id);
    
    if (!workstation) {
      return res.status(404).json({ message: 'Workstation not found' });
    }
    
    await workstation.destroy();
    res.json({ message: 'Workstation deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
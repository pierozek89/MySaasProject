// CREATE NEW FILE: backend/src/controllers/clientController.js
const { Client } = require('../models');

// Get all clients
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.findAll({
      order: [['name', 'ASC']]
    });
    res.json(clients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create client
exports.createClient = async (req, res) => {
  try {
    const { name, subdomain } = req.body;
    
    // Check for duplicate
    if (subdomain) {
      const existingClient = await Client.findOne({ where: { subdomain } });
      if (existingClient) {
        return res.status(400).json({ message: 'Subdomain already exists' });
      }
    }
    
    const client = await Client.create({
      name,
      subdomain
    });
    
    res.status(201).json(client);
  } catch (err) {
    console.error(err);
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Get client by ID
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update client
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    const { name, subdomain } = req.body;
    
    // Check for duplicate subdomain
    if (subdomain && subdomain !== client.subdomain) {
      const existingClient = await Client.findOne({ where: { subdomain } });
      if (existingClient) {
        return res.status(400).json({ message: 'Subdomain already exists' });
      }
    }
    
    await client.update({
      name: name || client.name,
      subdomain: subdomain || client.subdomain
    });
    
    res.json(client);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete client
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    await client.destroy();
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
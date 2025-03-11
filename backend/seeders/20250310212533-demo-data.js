'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create a client
    const clientId = uuidv4();
    await queryInterface.bulkInsert('clients', [{
      id: clientId,
      name: 'Demo Company3',
      subdomain: 'demo23',
      created_at: new Date(),
      updated_at: new Date()
    }], {});

    // Create a workstation
    const workstationId = uuidv4();
    await queryInterface.bulkInsert('workstations', [{
      id: workstationId,
      client_id: clientId,
      name: 'Production Line A',
      description: 'Main assembly line',
      created_at: new Date(),
      updated_at: new Date()
    }], {});

    // Create a user
    const userId = uuidv4();
    await queryInterface.bulkInsert('users', [{
      id: userId,
      client_id: clientId,
      username: 'demo_user2',
      email: 'demo2@example.com',
      // Password is 'password'
      password_hash: '$2b$10$3JE4modCamKJ9R9qU6wVAeUn1s7U0j5fabkPpc.yK1fJMtSotnJRe', 
      role: 'POWER_USER',
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('workstations', null, {});
    await queryInterface.bulkDelete('clients', null, {});
  }
};
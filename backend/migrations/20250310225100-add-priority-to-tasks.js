'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tasks', 'priority', {
      type: Sequelize.ENUM('NISKI', 'ZWYKŁY', 'WYSOKI'),
      defaultValue: 'ZWYKŁY',
      allowNull: true
    });

    // Update the name column constraint
    await queryInterface.changeColumn('tasks', 'name', {
      type: Sequelize.STRING(150),
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tasks', 'priority');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_tasks_priority";');
  }
};
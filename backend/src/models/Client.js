'use strict';
module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subdomain: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'clients'
  });

  Client.associate = (models) => {
    Client.hasMany(models.User, { foreignKey: 'client_id' });
    Client.hasMany(models.Workstation, { foreignKey: 'client_id' });
    Client.hasMany(models.Task, { foreignKey: 'client_id' });
    // Add these models when you create them
    // Client.hasMany(models.Integration, { foreignKey: 'client_id' });
    // Client.hasMany(models.ActivityLog, { foreignKey: 'client_id' });
  };

  return Client;
};
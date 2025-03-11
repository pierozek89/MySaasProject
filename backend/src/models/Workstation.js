'use strict';
module.exports = (sequelize, DataTypes) => {
  const Workstation = sequelize.define('Workstation', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    client_id: {
      type: DataTypes.UUID,
      references: {
        model: 'clients',
        key: 'id'
      },
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    }
  }, {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'workstations'
  });

  Workstation.associate = (models) => {
    Workstation.belongsTo(models.Client, { foreignKey: 'client_id' });
    Workstation.hasMany(models.Task, { foreignKey: 'workstation_id' });
  };

  return Workstation;
};
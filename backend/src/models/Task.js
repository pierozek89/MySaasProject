'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
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
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        len: [1, 150]
      }
    },
    assigned_to: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    created_by: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    workstation_id: {
      type: DataTypes.UUID,
      references: {
        model: 'workstations',
        key: 'id'
      },
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('NOWE', 'W_TRAKCIE', 'ZAKONCZONE'),
      defaultValue: 'NOWE'
    },
    priority: {
      type: DataTypes.ENUM('NISKI', 'ZWYKŁY', 'WYSOKI'),
      defaultValue: 'ZWYKŁY',
      allowNull: true
    },
    category: {
      type: DataTypes.STRING
    }
  }, {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'tasks'
  });

  Task.associate = (models) => {
    Task.belongsTo(models.Client, { foreignKey: 'client_id' });
    Task.belongsTo(models.User, { foreignKey: 'assigned_to', as: 'AssignedUser' });
    Task.belongsTo(models.User, { foreignKey: 'created_by', as: 'Creator' });
    Task.belongsTo(models.Workstation, { foreignKey: 'workstation_id' });
    Task.hasMany(models.Comment, { foreignKey: 'task_id', as: 'Comments' });
  };

  return Task;
};
'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password_hash: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.ENUM('ADMIN_SYSTEMU', 'POWER_USER', 'PRACOWNIK'),
      defaultValue: 'PRACOWNIK'
    }
  }, {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'users',
    indexes: [
      {
        unique: true,
        fields: ['client_id', 'username']
      }
    ]
  });

  User.beforeCreate(async (user) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(user.password, salt);
    }
  });

  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password_hash);
  };

  User.associate = (models) => {
    User.belongsTo(models.Client, { foreignKey: 'client_id' });
    User.hasMany(models.Task, { foreignKey: 'assigned_to', as: 'AssignedTasks' });
    User.hasMany(models.Task, { foreignKey: 'created_by', as: 'CreatedTasks' });
    // Add these when you create the models
    // User.hasMany(models.Comment, { foreignKey: 'user_id' });
    // User.hasMany(models.ActivityLog, { foreignKey: 'user_id' });
  };

  return User;
};
module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define('Class', {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING(255)
    },
    annual_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'classes' // Explicit table name
  });

  Class.associate = (models) => {
    Class.hasMany(models.Student, {
      foreignKey: {
        name: 'class_id',
        allowNull: false
      },
      as: 'students',
      onDelete: 'RESTRICT', // Prevents class deletion if students exist
      onUpdate: 'CASCADE'   // Updates student class_ids if class id changes
    });
  };

  return Class;
};
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    father_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    mother_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    father_occupation: {
      type: DataTypes.STRING(100)
    },
    father_education: {
      type: DataTypes.STRING(100)
    },
    mother_occupation: {
      type: DataTypes.STRING(100)
    },
    mother_education: {
      type: DataTypes.STRING(100)
    },
    father_aadhar: {
      type: DataTypes.STRING(12)
    },
    mother_aadhar: {
      type: DataTypes.STRING(12)
    },
    address: {
      type: DataTypes.TEXT
    },
    contact_number: {
      type: DataTypes.STRING(15)
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
     is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    image_filename: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
   status: {
  type: DataTypes.ENUM('active', 'inactive'),
  defaultValue: 'active'
},
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }

  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'students' // Explicit table name
  });

  Student.associate = (models) => {
    Student.belongsTo(models.Class, {
      foreignKey: 'class_id',
      as: 'class',
      onDelete: 'RESTRICT', // Matches the hasMany association
      onUpdate: 'CASCADE'
    });
    Student.hasMany(models.FeePayment, {
      foreignKey: 'student_id',
      as: 'fee_payments',
      onDelete: 'CASCADE', // Deletes payments when student is deleted
      onUpdate: 'CASCADE'
    });
  };

  return Student;
};
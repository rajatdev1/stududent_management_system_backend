module.exports = (sequelize, DataTypes) => {
  const FeePayment = sequelize.define('FeePayment', {
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    payment_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    academic_year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    payment_method: {
      type: DataTypes.ENUM('cash', 'cheque', 'online'),
      defaultValue: 'cash'
    },
    transaction_reference: {
      type: DataTypes.STRING(100)
    },
    notes: {
      type: DataTypes.TEXT
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    tableName: 'fee_payments' // Explicit table name
  });

  FeePayment.associate = (models) => {
    FeePayment.belongsTo(models.Student, {
      foreignKey: 'student_id',
      as: 'student',
      onDelete: 'CASCADE', // Matches the hasMany association
      onUpdate: 'CASCADE'
    });
  };

  return FeePayment;
};
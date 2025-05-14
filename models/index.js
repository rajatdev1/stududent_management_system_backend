const db = require('../config/db');
const { DataTypes } = require('sequelize');

// Import models
const User = require('./user');
const Class = require('./class');
const Student = require('./student');
const FeePayment = require('./feePayment');

// Initialize models
const models = {
  User: User(db, DataTypes),
  Class: Class(db, DataTypes),
  Student: Student(db, DataTypes),
  FeePayment: FeePayment(db, DataTypes)
};

// Set up associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
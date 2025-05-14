const { Class } = require('../models');

// Get all classes
const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.findAll({
      order: [
        ['id', 'ASC']
      ]
    });
    res.send(classes);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Create class
const createClass = async (req, res) => {
  try {
    const { name, description, annual_fee } = req.body;
    const newClass = await Class.create({ name, description, annual_fee });
    res.status(201).send(newClass);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Get class by ID
const getClassById = async (req, res) => {
  try {
    const classObj = await Class.findByPk(req.params.id);
    if (!classObj) {
      return res.status(404).send({ error: 'Class not found' });
    }
    res.send(classObj);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Update class
const updateClass = async (req, res) => {
  try {
    const { name, description, annual_fee } = req.body;
    const [updated] = await Class.update(
      { name, description, annual_fee },
      { where: { id: req.params.id } }
    );
    if (!updated) {
      return res.status(404).send({ error: 'Class not found' });
    }
    const updatedClass = await Class.findByPk(req.params.id);
    res.send(updatedClass);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Delete class
const deleteClass = async (req, res) => {
  try {
    const deleted = await Class.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).send({ error: 'Class not found' });
    }
    res.send({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Initialize default classes if none exist
const initializeClasses = async (req, res) => {
  try {
    const classCount = await Class.count();
    
    if (classCount === 0) {
      const defaultClasses = [
        { name: 'Nursery', description: 'Nursery class', annual_fee: 10000 },
        { name: 'LKG', description: 'Lower Kindergarten', annual_fee: 12000 },
        { name: 'UKG', description: 'Upper Kindergarten', annual_fee: 12000 },
        { name: 'Class 1', description: 'First Standard', annual_fee: 15000 },
        { name: 'Class 2', description: 'Second Standard', annual_fee: 15000 },
        { name: 'Class 3', description: 'Third Standard', annual_fee: 15000 },
        { name: 'Class 4', description: 'Fourth Standard', annual_fee: 18000 },
        { name: 'Class 5', description: 'Fifth Standard', annual_fee: 18000 },
        { name: 'Class 6', description: 'Sixth Standard', annual_fee: 20000 },
        { name: 'Class 7', description: 'Seventh Standard', annual_fee: 20000 },
        { name: 'Class 8', description: 'Eighth Standard', annual_fee: 22000 },
        { name: 'Class 9', description: 'Ninth Standard', annual_fee: 25000 },
        { name: 'Class 10', description: 'Tenth Standard', annual_fee: 25000 }
      ];
      
      await Class.bulkCreate(defaultClasses);
      res.status(201).send({ message: 'Default classes initialized successfully' });
    } else {
      res.status(200).send({ message: 'Classes already exist' });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  getAllClasses,
  createClass,
  getClassById,
  updateClass,
  deleteClass,
  initializeClasses
};
const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { auth, isAdmin } = require('../middleware/auth');

// Get all classes
router.get('/', auth, classController.getAllClasses);

// Initialize default classes
router.post('/initialize', auth, isAdmin, classController.initializeClasses);

// Create new class
router.post('/', auth, isAdmin, classController.createClass);

// Get class by id
router.get('/:id', auth, classController.getClassById);

// Update class
router.put('/:id', auth, isAdmin, classController.updateClass);

// Delete class
router.delete('/:id', auth, isAdmin, classController.deleteClass);

module.exports = router;
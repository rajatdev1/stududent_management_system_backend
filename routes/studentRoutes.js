const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const upload = require('../config/multer');

router.get('/', auth, studentController.getAllStudents);
router.get('/class/:classId', auth, studentController.getStudentsByClass);
router.post('/', auth, upload.single('image'), studentController.createStudent);
router.put('/:id', auth, upload.single('image'), studentController.updateStudent);
router.get('/:id', auth, studentController.getStudentById);

router.delete('/:id', auth, studentController.deleteStudent);
router.get('/dashboard/stats', auth, studentController.getDashboardStats);
router.get('/class/:classId/count', studentController.getStudentCountByClass);


module.exports = router;
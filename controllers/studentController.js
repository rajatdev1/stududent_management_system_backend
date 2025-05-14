const { Student, Class, FeePayment } = require('../models');

const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

const handleFileUpload = (file) => {
  if (!file) return null;
  
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const ext = path.extname(file.originalname);
  const filename = `student-${uniqueSuffix}${ext}`;
  const filepath = path.join(__dirname, '../uploads/students', filename);
  
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.renameSync(file.path, filepath);
  
  return filename;
};

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        { model: Class, as: 'class' },
        { model: FeePayment, as: 'fee_payments' }
      ]
    });
    res.send(students);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};



const getStudentsByClass = async (req, res) => {
  try {
    const students = await Student.findAll({
      where: { class_id: req.params.classId },
      attributes: { 
        include: ['id', 'name', 'image_filename', 'status', /* other fields */] 
      },
      include: [
        { 
          model: Class, 
          as: 'class',
          attributes: ['id', 'name'] 
        },
        { 
          model: FeePayment, 
          as: 'fee_payments',
          attributes: ['id', 'amount', 'payment_date'] 
        }
      ]
    });

      const studentsWithUrls = students.map(student => {
      const studentData = student.get({ plain: true });
      return {
        ...studentData,
        image_url: studentData.image_filename 
          ? `${req.protocol}://${req.get('host')}/uploads/students/${studentData.image_filename}`
          : null,
        is_active: studentData.status === 'active'
      };
    });

    res.send(studentsWithUrls);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};


const createStudent = async (req, res) => {
  try {
    const studentData = req.body;
    if (!['active', 'inactive'].includes(studentData.status)) {
      studentData.status = 'active'; // Default value
    }
    if (req.file) {
      studentData.image_filename = handleFileUpload(req.file);
    }
    studentData.status = studentData.status || 'active';
    
    const newStudent = await Student.create(studentData);
    const studentWithDetails = await Student.findByPk(newStudent.id, {
      include: [
        { model: Class, as: 'class' },
        { model: FeePayment, as: 'fee_payments' }
      ]
    });
    res.status(201).send(studentWithDetails);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

// Update getStudentById to properly generate image_url
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [
        { model: Class, as: 'class' },
        { model: FeePayment, as: 'fee_payments' }
      ]
    });
    
    if (!student) {
      return res.status(404).send({ error: 'Student not found' });
    }

    const studentData = student.get({ plain: true });
    studentData.image_url = studentData.image_filename 
      ? `${req.protocol}://${req.get('host')}/uploads/students/${studentData.image_filename}`
      : null;

    res.send(studentData);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).send({ error: 'Student not found' });
    }

    const studentData = req.body;
    
    // Fix: Proper status conversion
    if (studentData.status !== undefined) {
      studentData.status = studentData.status === 'true' || studentData.status === true ? 'active' : 'inactive';
    }

    if (req.file) {
      // Delete old image if exists
      if (student.image_filename) {
        await unlinkAsync(path.join(__dirname, '../uploads/students', student.image_filename));
      }
      studentData.image_filename = handleFileUpload(req.file);
    }

    const [updated] = await Student.update(studentData, {
      where: { id: req.params.id }
    });

    const updatedStudent = await Student.findByPk(req.params.id, {
      include: [
        { model: Class, as: 'class' },
        { model: FeePayment, as: 'fee_payments' }
      ]
    });

    res.send(updatedStudent);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).send({ error: 'Student not found' });
    }
    res.send({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Get student count by class ID
const getStudentCountByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const count = await Student.count({
      where: { class_id: classId }
    });
    res.send({ count });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.count();
    const activeStudents = await Student.count({ where: { is_active: true } });
    
    const classes = await Class.findAll();
    const totalFeeExpected = classes.reduce((sum, cls) => sum + parseFloat(cls.annual_fee), 0);
    
    const feePayments = await FeePayment.findAll();
    const totalFeePaid = feePayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
    
    const stats = {
      totalStudents,
      activeStudents,
      inactiveStudents: totalStudents - activeStudents,
      activePercentage: (activeStudents / totalStudents) * 100,
      feePaidPercentage: (totalFeePaid / totalFeeExpected) * 100,
      feeDuePercentage: 100 - (totalFeePaid / totalFeeExpected) * 100,
      totalFeeExpected,
      totalFeePaid,
      totalFeeDue: totalFeeExpected - totalFeePaid
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
};

module.exports = {
  getAllStudents,
  getStudentsByClass,
  createStudent,
  getStudentById,
  getStudentCountByClass,
  updateStudent,
  deleteStudent,
  getDashboardStats,
    handleFileUpload
};
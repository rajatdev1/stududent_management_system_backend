const { FeePayment, Student } = require('../models');

const createFeePayment = async (req, res) => {
  try {
    const feeData = req.body;
    const newFeePayment = await FeePayment.create(feeData);
    const feeWithDetails = await FeePayment.findByPk(newFeePayment.id, {
      include: [{ model: Student, as: 'student' }]
    });
    res.status(201).send(feeWithDetails);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getFeePaymentsByStudent = async (req, res) => {
  try {
    const feePayments = await FeePayment.findAll({
      where: { student_id: req.params.studentId },
      include: [{ model: Student, as: 'student' }]
    });
    res.send(feePayments);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateFeePayment = async (req, res) => {
  try {
    const [updated] = await FeePayment.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) {
      return res.status(404).send({ error: 'Fee payment not found' });
    }
    const updatedFeePayment = await FeePayment.findByPk(req.params.id, {
      include: [{ model: Student, as: 'student' }]
    });
    res.send(updatedFeePayment);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const deleteFeePayment = async (req, res) => {
  try {
    const deleted = await FeePayment.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).send({ error: 'Fee payment not found' });
    }
    res.send({ message: 'Fee payment deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  createFeePayment,
  getFeePaymentsByStudent,
  updateFeePayment,
  deleteFeePayment
};
const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { getAllUsers, deleteUser, updateUser } = require('../controllers/users');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllUsers);
router.delete('/:id', deleteUser);
router.put('/:id', updateUser);

module.exports = router;

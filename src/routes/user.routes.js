const express = require('express');
const router = express.Router();
const { getUsers, getUserById, createUser, deleteUser } = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate, registerSchema } = require('../utils/validation');

// Todas las rutas de usuarios requieren autenticación
router.use(protect);

router.get('/', getUsers);
router.post('/', validate(registerSchema), createUser);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);

module.exports = router;

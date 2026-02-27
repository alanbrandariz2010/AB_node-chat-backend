const User = require('../models/user.model');
const { successResponse, errorResponse } = require('../utils/response');

// GET /api/users  — listar usuarios (con búsqueda opcional ?search=)
const getUsers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    const filter = search
      ? {
          $or: [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
          _id: { $ne: req.user._id }, // excluir al usuario logueado
        }
      : { _id: { $ne: req.user._id } };

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    return successResponse(res, { users, total, page: Number(page), limit: Number(limit) }, 'Usuarios obtenidos');
  } catch (error) {
    next(error);
  }
};

// GET /api/users/:id
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, 'Usuario no encontrado', 404);
    return successResponse(res, user, 'Usuario obtenido');
  } catch (error) {
    next(error);
  }
};

// POST /api/users  — crear usuario (sin auth, alias de register para uso directo)
const createUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    return successResponse(res, user, 'Usuario creado', 201);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return errorResponse(res, 'Usuario no encontrado', 404);
    return successResponse(res, null, 'Usuario eliminado');
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserById, createUser, deleteUser };

const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { successResponse, errorResponse } = require('../utils/response');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);

    return successResponse(res, { user, token }, 'Usuario registrado exitosamente', 201);
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return errorResponse(res, 'Credenciales inválidas', 401);
    }

    const token = generateToken(user._id);

    // Actualizar estado online
    user.isOnline = true;
    await user.save({ validateBeforeSave: false });

    return successResponse(res, { user, token }, 'Login exitoso');
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/logout
const logout = async (req, res, next) => {
  try {
    req.user.isOnline = false;
    await req.user.save({ validateBeforeSave: false });
    return successResponse(res, null, 'Logout exitoso');
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  return successResponse(res, req.user, 'Perfil obtenido');
};

module.exports = { register, login, logout, getMe };

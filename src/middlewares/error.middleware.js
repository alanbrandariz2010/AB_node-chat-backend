const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Mongoose: duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `El campo '${field}' ya está en uso`,
      data: null,
    });
  }

  // Mongoose: CastError (ID inválido)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `ID inválido: ${err.value}`,
      data: null,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
      data: null,
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado',
      data: null,
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    data: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
};

module.exports = { notFound, errorHandler };

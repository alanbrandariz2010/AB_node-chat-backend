/**
 * Formato estandarizado de respuesta para toda la API
 * { success, data, message }
 */

const successResponse = (res, data, message = 'OK', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (res, message = 'Error interno', statusCode = 500, data = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data,
  });
};

module.exports = { successResponse, errorResponse };

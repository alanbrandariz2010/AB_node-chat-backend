const { z } = require('zod');

// Auth
const registerSchema = z.object({
  username: z.string().min(3, 'Username debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

// Chats
const createChatSchema = z.object({
  participants: z
    .array(z.string())
    .min(1, 'Debe haber al menos un participante'),
  name: z.string().optional(),
  isGroupChat: z.boolean().optional(),
});

// Messages
const createMessageSchema = z.object({
  chatId: z.string().min(1, 'chatId es requerido'),
  content: z.string().min(1, 'El contenido no puede estar vacío').max(2000),
});

/**
 * Middleware factory para validar body con un schema Zod
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      data: errors,
    });
  }
  req.body = result.data;
  next();
};

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  createChatSchema,
  createMessageSchema,
};

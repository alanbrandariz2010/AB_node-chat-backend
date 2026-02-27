const Message = require('../models/message.model');
const Chat = require('../models/chat.model');
const { successResponse, errorResponse } = require('../utils/response');

// POST /api/messages
const sendMessage = async (req, res, next) => {
  try {
    const { chatId, content } = req.body;

    // Verificar que el chat existe y el usuario es participante
    const chat = await Chat.findById(chatId);
    if (!chat) return errorResponse(res, 'Chat no encontrado', 404);

    const isMember = chat.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );
    if (!isMember) return errorResponse(res, 'No eres participante de este chat', 403);

    const message = await Message.create({
      chatId,
      userId: req.user._id,
      content,
      readBy: [req.user._id],
    });

    const populated = await Message.findById(message._id)
      .populate('userId', 'username avatar')
      .populate('chatId', 'name');

    return successResponse(res, populated, 'Mensaje enviado', 201);
  } catch (error) {
    next(error);
  }
};

// GET /api/messages/:chatId  — historial con paginación
const getMessagesByChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50, search } = req.query;

    // Verificar participación
    const chat = await Chat.findById(chatId);
    if (!chat) return errorResponse(res, 'Chat no encontrado', 404);

    const isMember = chat.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );
    if (!isMember) return errorResponse(res, 'No autorizado', 403);

    const filter = { chatId };
    if (search) {
      filter.content = { $regex: search, $options: 'i' };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [messages, total] = await Promise.all([
      Message.find(filter)
        .populate('userId', 'username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Message.countDocuments(filter),
    ]);

    // Marcar mensajes como leídos
    await Message.updateMany(
      { chatId, readBy: { $ne: req.user._id } },
      { $addToSet: { readBy: req.user._id } }
    );

    return successResponse(
      res,
      {
        messages: messages.reverse(), // orden cronológico
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
      'Mensajes obtenidos'
    );
  } catch (error) {
    next(error);
  }
};

// DELETE /api/messages/:id
const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return errorResponse(res, 'Mensaje no encontrado', 404);

    if (message.userId.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Solo el autor puede eliminar el mensaje', 403);
    }

    await message.deleteOne();
    return successResponse(res, null, 'Mensaje eliminado');
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, getMessagesByChat, deleteMessage };

const Chat = require('../models/chat.model');
const { successResponse, errorResponse } = require('../utils/response');

// POST /api/chats
const createChat = async (req, res, next) => {
  try {
    const { participants, name, isGroupChat } = req.body;
    const currentUserId = req.user._id.toString();

    // Asegurarse de que el creador esté incluido
    const uniqueParticipants = [...new Set([...participants, currentUserId])];

    // Verificar si ya existe un chat 1:1 entre los dos usuarios
    if (!isGroupChat && uniqueParticipants.length === 2) {
      const existing = await Chat.findOne({
        isGroupChat: false,
        participants: { $all: uniqueParticipants, $size: 2 },
      }).populate('participants', '-password');

      if (existing) {
        return successResponse(res, existing, 'Chat existente retornado');
      }
    }

    const chat = await Chat.create({
      name: name || '',
      isGroupChat: !!isGroupChat,
      participants: uniqueParticipants,
      createdBy: currentUserId,
    });

    const populated = await Chat.findById(chat._id)
      .populate('participants', '-password')
      .populate('createdBy', '-password');

    return successResponse(res, populated, 'Chat creado', 201);
  } catch (error) {
    next(error);
  }
};

// GET /api/chats  — listar chats del usuario logueado
const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate('participants', '-password')
      .populate('lastMessage')
      .populate('createdBy', 'username')
      .sort({ updatedAt: -1 });

    return successResponse(res, chats, 'Chats obtenidos');
  } catch (error) {
    next(error);
  }
};

// GET /api/chats/:id
const getChatById = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants', '-password')
      .populate('lastMessage')
      .populate('createdBy', 'username');

    if (!chat) return errorResponse(res, 'Chat no encontrado', 404);

    // Verificar que el usuario sea participante
    const isMember = chat.participants.some(
      (p) => p._id.toString() === req.user._id.toString()
    );
    if (!isMember) return errorResponse(res, 'No autorizado para ver este chat', 403);

    return successResponse(res, chat, 'Chat obtenido');
  } catch (error) {
    next(error);
  }
};

// DELETE /api/chats/:id
const deleteChat = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return errorResponse(res, 'Chat no encontrado', 404);

    if (chat.createdBy.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Solo el creador puede eliminar el chat', 403);
    }

    await chat.deleteOne();
    return successResponse(res, null, 'Chat eliminado');
  } catch (error) {
    next(error);
  }
};

module.exports = { createChat, getChats, getChatById, deleteChat };

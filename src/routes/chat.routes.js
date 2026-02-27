const express = require('express');
const router = express.Router();
const { createChat, getChats, getChatById, deleteChat } = require('../controllers/chat.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate, createChatSchema } = require('../utils/validation');

router.use(protect);

router.get('/', getChats);
router.post('/', validate(createChatSchema), createChat);
router.get('/:id', getChatById);
router.delete('/:id', deleteChat);

module.exports = router;

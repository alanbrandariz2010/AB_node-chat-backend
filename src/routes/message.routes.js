const express = require('express');
const router = express.Router();
const { sendMessage, getMessagesByChat, deleteMessage } = require('../controllers/message.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate, createMessageSchema } = require('../utils/validation');

router.use(protect);

router.post('/', validate(createMessageSchema), sendMessage);
router.get('/:chatId', getMessagesByChat);
router.delete('/:id', deleteMessage);

module.exports = router;

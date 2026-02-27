const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: [true, 'El chatId es obligatorio'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El userId es obligatorio'],
    },
    content: {
      type: String,
      required: [true, 'El contenido del mensaje es obligatorio'],
      trim: true,
      maxlength: [2000, 'El mensaje no puede superar los 2000 caracteres'],
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

// Al guardar, actualizar el lastMessage del chat
messageSchema.post('save', async function () {
  await mongoose.model('Chat').findByIdAndUpdate(this.chatId, {
    lastMessage: this._id,
  });
});

module.exports = mongoose.model('Message', messageSchema);

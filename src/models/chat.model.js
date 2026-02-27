const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: '',
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Si no es grupal y no tiene nombre, generar uno basado en los participantes
chatSchema.pre('save', function (next) {
  if (!this.isGroupChat && !this.name) {
    this.name = 'Chat privado';
  }
  next();
});

module.exports = mongoose.model('Chat', chatSchema);

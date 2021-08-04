const mongoose = require('mongoose');

const CodeSchema = new mongoose.Schema(
  {
    generatedCode: {
      type: String,
      required: [true, 'No empty codes allowed'],
      minlength: 20,
    },
  },
  { timestamps: true }
);

module.exports.Code = mongoose.model('Code', CodeSchema);

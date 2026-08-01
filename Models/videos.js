const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    url: { type: String, required: true },
    youtubeId: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdByRole: { type: String, enum: ['user', 'admin', 'editor'], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Video', videoSchema);

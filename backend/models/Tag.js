import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema({
  state_code: {
    type: String,
    required: true
  },
  tag_name: {
    type: String,
    required: true
  },
  upvotes: {
    type: Number,
    default: 0
  }
});

export default mongoose.model('Tag', TagSchema);
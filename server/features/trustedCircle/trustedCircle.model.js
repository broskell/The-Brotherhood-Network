import mongoose from 'mongoose';

const trustedCircleSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'blocked'],
    default: 'pending',
  }
}, {
  timestamps: true,
});

// Compound unique index to prevent duplicate relationships between two users
trustedCircleSchema.index({ sender: 1, receiver: 1 }, { unique: true });

const TrustedCircle = mongoose.model('TrustedCircle', trustedCircleSchema);
export default TrustedCircle;

import mongoose from 'mongoose';

const sosSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    }
  },
  message: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'accepted', 'resolved', 'cancelled'],
    default: 'active',
  },
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  resolvedAt: {
    type: Date,
  }
}, {
  timestamps: true,
});

// Create 2dsphere index on location field for geospatial queries
sosSchema.index({ location: '2dsphere' });

const SOS = mongoose.model('SOS', sosSchema);
export default SOS;

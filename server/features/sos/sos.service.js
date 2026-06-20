import SOS from './sos.model.js';
import User from '../users/user.model.js';

// Create SOS alert
export const createSosAlert = async (userId, latitude, longitude, message) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found.');
  }

  // Generate SOS record
  const sos = await SOS.create({
    user: userId,
    location: {
      type: 'Point',
      coordinates: [longitude, latitude] // [longitude, latitude] format
    },
    message: message || 'EMERGENCY SOS: I need help immediately.',
    status: 'active',
    sharedWith: user.trustedMembers
  });

  return await SOS.findById(sos._id).populate('user', 'fullName username email avatar');
};

// Update location coordinates
export const updateSosLocation = async (sosId, userId, latitude, longitude) => {
  const sos = await SOS.findById(sosId);
  if (!sos) {
    throw new Error('SOS record not found.');
  }

  if (sos.user.toString() !== userId.toString()) {
    throw new Error('You are not authorized to update this coordinate stream.');
  }

  if (sos.status !== 'active' && sos.status !== 'accepted') {
    throw new Error(`Cannot update location for SOS alert in '${sos.status}' state.`);
  }

  sos.location.coordinates = [longitude, latitude];
  await sos.save();

  return sos;
};

// Resolve alert
export const resolveSosAlert = async (sosId, userId) => {
  const sos = await SOS.findById(sosId);
  if (!sos) {
    throw new Error('SOS record not found.');
  }

  if (sos.user.toString() !== userId.toString()) {
    throw new Error('You are not authorized to resolve this SOS alert.');
  }

  sos.status = 'resolved';
  sos.resolvedAt = new Date();
  await sos.save();

  return sos;
};

// Fetch active alerts shared with the user
export const getActiveSharedAlerts = async (userId) => {
  return await SOS.find({
    sharedWith: userId,
    status: { $in: ['active', 'accepted'] }
  })
  .populate('user', 'fullName username email avatar location')
  .sort({ createdAt: -1 });
};

// Get personal history
export const getMySosHistory = async (userId) => {
  return await SOS.find({ user: userId })
    .populate('acceptedBy', 'fullName username email')
    .sort({ createdAt: -1 });
};
export const acceptSosAlert = async (sosId, helperId) => {
  const sos = await SOS.findById(sosId);
  if (!sos) {
    throw new Error('SOS record not found.');
  }
  if (sos.status !== 'active') {
    throw new Error('This SOS alert is no longer active.');
  }
  sos.status = 'accepted';
  sos.acceptedBy = helperId;
  await sos.save();
  return sos;
};

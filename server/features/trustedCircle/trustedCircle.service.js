import TrustedCircle from './trustedCircle.model.js';
import User from '../users/user.model.js';

// Send request
export const sendCircleRequest = async (senderId, receiverId) => {
  if (senderId.toString() === receiverId.toString()) {
    throw new Error('You cannot add yourself to your trusted circle.');
  }

  // Confirm recipient exists
  const receiverExists = await User.findById(receiverId);
  if (!receiverExists) {
    throw new Error('Recipient user not found.');
  }

  // Check existing relations
  const existingRelation = await TrustedCircle.findOne({
    $or: [
      { sender: senderId, receiver: receiverId },
      { sender: receiverId, receiver: senderId }
    ]
  });

  if (existingRelation) {
    if (existingRelation.status === 'accepted') {
      throw new Error('You are already trusted circle members.');
    }
    if (existingRelation.status === 'pending') {
      throw new Error('A pending circle request is already in progress.');
    }
    if (existingRelation.status === 'blocked') {
      throw new Error('Unable to complete request.');
    }
    
    // Reset rejected connection to pending
    existingRelation.status = 'pending';
    existingRelation.sender = senderId;
    existingRelation.receiver = receiverId;
    await existingRelation.save();
    return existingRelation;
  }

  return await TrustedCircle.create({
    sender: senderId,
    receiver: receiverId,
    status: 'pending'
  });
};

// Accept request
export const acceptCircleRequest = async (requestId, userId) => {
  const request = await TrustedCircle.findById(requestId);
  if (!request) {
    throw new Error('Request not found.');
  }

  // Confirm authorization
  if (request.receiver.toString() !== userId.toString()) {
    throw new Error('You are not authorized to accept this request.');
  }

  if (request.status !== 'pending') {
    throw new Error(`Request has already been processed with status: ${request.status}`);
  }

  request.status = 'accepted';
  await request.save();

  // Sync users trusted members arrays
  await User.findByIdAndUpdate(request.sender, { $addToSet: { trustedMembers: request.receiver } });
  await User.findByIdAndUpdate(request.receiver, { $addToSet: { trustedMembers: request.sender } });

  return request;
};

// Reject request
export const rejectCircleRequest = async (requestId, userId) => {
  const request = await TrustedCircle.findById(requestId);
  if (!request) {
    throw new Error('Request not found.');
  }

  if (request.receiver.toString() !== userId.toString()) {
    throw new Error('You are not authorized to reject this request.');
  }

  request.status = 'rejected';
  await request.save();
  return request;
};

// Remove relationship
export const removeCircleMember = async (relationId, userId) => {
  const request = await TrustedCircle.findById(relationId);
  if (!request) {
    throw new Error('Trusted connection not found.');
  }

  const isSender = request.sender.toString() === userId.toString();
  const isReceiver = request.receiver.toString() === userId.toString();

  if (!isSender && !isReceiver) {
    throw new Error('You are not authorized to delete this connection.');
  }

  await TrustedCircle.findByIdAndDelete(relationId);

  // Sync users trusted members arrays
  await User.findByIdAndUpdate(request.sender, { $pull: { trustedMembers: request.receiver } });
  await User.findByIdAndUpdate(request.receiver, { $pull: { trustedMembers: request.sender } });

  return { success: true };
};

// Get members
export const getTrustedMembers = async (userId) => {
  const relations = await TrustedCircle.find({
    $or: [{ sender: userId }, { receiver: userId }],
    status: 'accepted'
  }).populate('sender receiver', 'fullName username email avatar isOnline lastSeen location');

  return relations.map(rel => {
    const isSender = rel.sender._id.toString() === userId.toString();
    const otherUser = isSender ? rel.receiver : rel.sender;
    return {
      relationshipId: rel._id,
      id: otherUser._id,
      fullName: otherUser.fullName,
      username: otherUser.username,
      email: otherUser.email,
      avatar: otherUser.avatar,
      isOnline: otherUser.isOnline,
      lastSeen: otherUser.lastSeen,
      location: otherUser.location,
      createdAt: rel.createdAt
    };
  });
};

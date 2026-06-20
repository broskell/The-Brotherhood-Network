import { Server } from 'socket.io';

const onlineUsers = new Map(); // Tracks userId -> Set of active socketIds

export const initSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Separate Namespaces
  const chatNamespace = io.of('/chat');
  const sosNamespace = io.of('/sos');

  // Trigger presence status update to namespace rooms
  const handlePresenceUpdate = (userId, isOnline) => {
    chatNamespace.emit('presence:update', {
      userId,
      isOnline,
      lastSeen: new Date()
    });
  };

  // Chat Socket Management
  chatNamespace.on('connection', (socket) => {
    console.log(`[Socket Chat] Connection established: ${socket.id}`);

    // Bind authenticated user to connection presence tracking
    socket.on('user:login', (userId) => {
      socket.userId = userId;
      socket.join(`user:${userId}`);
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }
      onlineUsers.get(userId).add(socket.id);
      handlePresenceUpdate(userId, true);
      console.log(`[Socket Chat] User ${userId} is online.`);
    });

    // Room boundaries
    socket.on('room:join', (roomId) => {
      socket.join(roomId);
      console.log(`[Socket Chat] Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('room:leave', (roomId) => {
      socket.leave(roomId);
      console.log(`[Socket Chat] Socket ${socket.id} left room ${roomId}`);
    });

    // Typing Indicators
    socket.on('message:typing', (data) => {
      // data: { roomId, username }
      socket.to(data.roomId).emit('message:typing', data);
    });

    socket.on('message:stopTyping', (data) => {
      // data: { roomId, username }
      socket.to(data.roomId).emit('message:stopTyping', data);
    });

    // Message transmission
    socket.on('message:send', (messageData) => {
      // messageData: { roomId, senderId, senderName, content, messageType, fileUrl }
      chatNamespace.to(messageData.roomId).emit('message:receive', messageData);
    });

    // Read Receipts
    socket.on('message:read', (data) => {
      // data: { messageId, roomId, userId }
      socket.to(data.roomId).emit('message:read', data);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket Chat] Connection closed: ${socket.id}`);
      if (socket.userId && onlineUsers.has(socket.userId)) {
        const userSockets = onlineUsers.get(socket.userId);
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(socket.userId);
          handlePresenceUpdate(socket.userId, false);
          console.log(`[Socket Chat] User ${socket.userId} is offline.`);
        }
      }
    });
  });

  // SOS Socket Management
  sosNamespace.on('connection', (socket) => {
    console.log(`[Socket SOS] Connection established: ${socket.id}`);

    // Join specialized SOS room
    socket.on('sos:join', (userId) => {
      socket.userId = userId;
      socket.join(`user:${userId}`);
      console.log(`[Socket SOS] Socket ${socket.id} joined room user:${userId}`);
    });


    // Dispatch a new emergency SOS alert
    socket.on('sos:create', (sosData) => {
      // sosData: { id, userId, username, location: { coordinates }, message }
      console.log(`[Socket SOS] EMERGENCY Alert generated:`, sosData);
      sosNamespace.emit('sos:broadcast_alert', sosData);
    });

    // Share live-location coordinate updates
    socket.on('sos:updateLocation', (locationData) => {
      // locationData: { sosId, userId, coordinates: [lng, lat] }
      console.log(`[Socket SOS] Location Coordinate Update:`, locationData);
      sosNamespace.emit('sos:location_updated', locationData);
    });

    // Accept an active alert
    socket.on('sos:accepted', (acceptData) => {
      // acceptData: { sosId, helperId, helperName }
      console.log(`[Socket SOS] Alert accepted:`, acceptData);
      sosNamespace.emit('sos:accepted_alert', acceptData);
    });

    // Cancel alert
    socket.on('sos:cancelled', (cancelData) => {
      // cancelData: { sosId, userId }
      console.log(`[Socket SOS] Alert cancelled by user:`, cancelData);
      sosNamespace.emit('sos:cancelled_alert', cancelData);
    });

    // Resolve alert
    socket.on('sos:resolve', (resolveData) => {
      // resolveData: { sosId, userId }
      console.log(`[Socket SOS] Alert marked resolved:`, resolveData);
      sosNamespace.emit('sos:resolved', resolveData);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket SOS] Connection closed: ${socket.id}`);
    });
  });

  return io;
};

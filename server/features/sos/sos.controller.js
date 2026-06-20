import * as sosService from './sos.service.js';
import { createSosSchema, updateLocationSchema } from './sos.validation.js';

// Trigger a new SOS alert
export const createSos = async (req, res, next) => {
  try {
    const { latitude, longitude, message } = createSosSchema.parse(req.body);
    const sos = await sosService.createSosAlert(req.user.id, latitude, longitude, message);

    // Retrieve Socket server from Express registry
    const io = req.app.get('io');
    if (io) {
      // Emit to each trusted circle member's individual room "user:{memberId}"
      sos.sharedWith.forEach((memberId) => {
        io.of('/sos').to(`user:${memberId}`).emit('sos:create', {
          sosId: sos._id,
          user: {
            id: sos.user._id,
            fullName: sos.user.fullName,
            username: sos.user.username,
            avatar: sos.user.avatar,
          },
          location: sos.location,
          message: sos.message,
        });
      });
    }

    res.status(201).json({
      success: true,
      message: 'SOS Alert broadcasted successfully.',
      data: sos
    });
  } catch (error) {
    next(error);
  }
};

// Stream live-location updates
export const updateLocation = async (req, res, next) => {
  try {
    const { latitude, longitude } = updateLocationSchema.parse(req.body);
    const sos = await sosService.updateSosLocation(req.params.id, req.user.id, latitude, longitude);

    const io = req.app.get('io');
    if (io) {
      // Broadcast updated coordinates to all trusted circle members
      sos.sharedWith.forEach((memberId) => {
        io.of('/sos').to(`user:${memberId}`).emit('sos:updateLocation', {
          sosId: sos._id,
          coordinates: sos.location.coordinates,
        });
      });
    }

    res.status(200).json({
      success: true,
      message: 'Location coordinate updated.',
      data: sos
    });
  } catch (error) {
    next(error);
  }
};

// Accept an active alert
export const acceptSos = async (req, res, next) => {
  try {
    const sos = await sosService.acceptSosAlert(req.params.id, req.user.id);
    
    const io = req.app.get('io');
    if (io) {
      // Notify the SOS sender's room
      io.of('/sos').to(`user:${sos.user}`).emit('sos:accepted', {
        sosId: sos._id,
        acceptedBy: req.user.id,
      });

      // Also notify sharing partners of acceptance
      sos.sharedWith.forEach((memberId) => {
        io.of('/sos').to(`user:${memberId}`).emit('sos:accepted', {
          sosId: sos._id,
          acceptedBy: req.user.id,
        });
      });
    }

    res.status(200).json({
      success: true,
      message: 'Emergency SOS accepted.',
      data: sos
    });
  } catch (error) {
    next(error);
  }
};

// Resolve an active alert
export const resolveSos = async (req, res, next) => {
  try {
    const sos = await sosService.resolveSosAlert(req.params.id, req.user.id);

    const io = req.app.get('io');
    if (io) {
      // Notify all shared members of resolution
      sos.sharedWith.forEach((memberId) => {
        io.of('/sos').to(`user:${memberId}`).emit('sos:resolved', {
          sosId: sos._id,
          resolvedAt: sos.resolvedAt,
        });
      });
    }

    res.status(200).json({
      success: true,
      message: 'SOS alert resolved.',
      data: sos
    });
  } catch (error) {
    next(error);
  }
};

// Fetch all active alerts shared with this user
export const getActiveAlerts = async (req, res, next) => {
  try {
    const alerts = await sosService.getActiveSharedAlerts(req.user.id);
    res.status(200).json({
      success: true,
      data: alerts
    });
  } catch (error) {
    next(error);
  }
};

// Get personal history
export const getHistory = async (req, res, next) => {
  try {
    const history = await sosService.getMySosHistory(req.user.id);
    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    next(error);
  }
};

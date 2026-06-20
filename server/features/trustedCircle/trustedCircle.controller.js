import * as circleService from './trustedCircle.service.js';
import { requestSchema } from './trustedCircle.validation.js';

// Send Request
export const sendRequest = async (req, res, next) => {
  try {
    const validatedData = requestSchema.parse(req.body);
    const request = await circleService.sendCircleRequest(req.user.id, validatedData.receiverId);

    res.status(201).json({
      success: true,
      message: 'Trusted request sent successfully.',
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// Accept Request
export const acceptRequest = async (req, res, next) => {
  try {
    const request = await circleService.acceptCircleRequest(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      message: 'Trusted request accepted.',
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// Reject Request
export const rejectRequest = async (req, res, next) => {
  try {
    const request = await circleService.rejectCircleRequest(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      message: 'Trusted request rejected.',
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// Remove Member
export const removeMember = async (req, res, next) => {
  try {
    await circleService.removeCircleMember(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      message: 'Member removed from trusted circle successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// Get All Members
export const getMembers = async (req, res, next) => {
  try {
    const members = await circleService.getTrustedMembers(req.user.id);
    res.status(200).json({
      success: true,
      data: members
    });
  } catch (error) {
    next(error);
  }
};

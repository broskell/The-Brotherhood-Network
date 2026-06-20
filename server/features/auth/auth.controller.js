import * as authService from './auth.service.js';
import { registerSchema, loginSchema } from './auth.validation.js';
import User from '../users/user.model.js';

// Register a new user
export const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const user = await authService.registerUser(validatedData);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error); // Route to centralized error handler
  }
};

// Login user and send refresh cookie
export const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const { user, accessToken, refreshToken } = await authService.loginUser(
      validatedData.email,
      validatedData.password
    );

    // Save refresh token in HTTP-only secure cookie
    res.cookie('refreshToken', refreshToken, authService.getCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Login successful',
      accessToken,
      data: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (error) {
    next(error);
  }
};

// Refresh Access Token (Rotation)
export const refresh = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token missing' });
    }

    const { accessToken, refreshToken: newRefreshToken } = await authService.refreshUserToken(oldRefreshToken);

    // Rotate the cookie
    res.cookie('refreshToken', newRefreshToken, authService.getCookieOptions());

    res.status(200).json({
      success: true,
      accessToken
    });
  } catch (error) {
    // Clear cookies on error to force re-login
    res.clearCookie('refreshToken', authService.getCookieOptions());
    next(error);
  }
};

// Logout from current device
export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await authService.logoutUser(req.user.id, refreshToken);
    }

    res.clearCookie('refreshToken', authService.getCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Logout from all devices
export const logoutAllDevices = async (req, res, next) => {
  try {
    await authService.logoutAllDevices(req.user.id);

    res.clearCookie('refreshToken', authService.getCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Logged out from all sessions successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile details
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        trustedMembers: user.trustedMembers,
        emergencyContacts: user.emergencyContacts,
        joinedAt: user.joinedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

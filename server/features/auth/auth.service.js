import jwt from 'jsonwebtoken';
import User from '../users/user.model.js';

// Access token (15 minutes)
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

// Refresh token (7 days)
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

// Cookie configuration
export const getCookieOptions = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
};

// Register user
export const registerUser = async (userData) => {
  const existingEmail = await User.findOne({ email: userData.email });
  if (existingEmail) {
    throw new Error('Email is already registered');
  }

  const existingUsername = await User.findOne({ username: userData.username });
  if (existingUsername) {
    throw new Error('Username is already taken');
  }

  const newUser = await User.create(userData);
  return newUser;
};

// Login user
export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Store refresh token
  user.refreshTokens.push({ token: refreshToken, createdAt: new Date() });

  // Clean old tokens (> 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  user.refreshTokens = user.refreshTokens.filter(rt => rt.createdAt > sevenDaysAgo);

  await user.save();

  return { user, accessToken, refreshToken };
};

// Refresh token rotation & validation
export const refreshUserToken = async (oldRefreshToken) => {
  let decoded;
  try {
    decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new Error('Invalid refresh token');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new Error('User not found');
  }

  const tokenIndex = user.refreshTokens.findIndex(rt => rt.token === oldRefreshToken);

  // Breach Detection: If token is not in array, it was reused (revoked/stolen)
  if (tokenIndex === -1) {
    user.refreshTokens = []; // Clear all active sessions
    await user.save();
    throw new Error('Breach detected: Refresh token reuse. All active sessions invalidated.');
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  // Rotate refresh token
  user.refreshTokens[tokenIndex] = { token: newRefreshToken, createdAt: new Date() };
  await user.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// Terminate single device session
export const logoutUser = async (userId, tokenToClear) => {
  const user = await User.findById(userId);
  if (user) {
    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== tokenToClear);
    await user.save();
  }
};

// Terminate all device sessions
export const logoutAllDevices = async (userId) => {
  const user = await User.findById(userId);
  if (user) {
    user.refreshTokens = [];
    await user.save();
  }
};

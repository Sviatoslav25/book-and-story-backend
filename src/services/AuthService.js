import jwt from 'jsonwebtoken';
import config from '../constants/config';

class AuthService {
  refreshTokens = [];

  generateAccessToken(user) {
    const payload = { _id: user._id, email: user.email };
    return jwt.sign(payload, config.jwtAccessTokenSecret, { expiresIn: '50m' });
  }

  generateRefreshToken(user) {
    const payload = { _id: user._id, email: user.email };
    const refreshToken = jwt.sign(payload, config.jwtRefreshTokenSecret, { expiresIn: '100d' });
    this.refreshTokens.push(refreshToken);
    return refreshToken;
  }

  invalidateRefreshToken(refreshToken) {
    this.refreshTokens = this.refreshTokens.filter((token) => token !== refreshToken);
  }

  issueNewAccessToken(refreshToken) {
    const decodeUser = this.verifyRefreshToken(refreshToken);
    return this.generateAccessToken(decodeUser);
  }

  verifyRefreshToken(refreshToken) {
    if (!this.refreshTokens.includes(refreshToken)) {
      throw new Error('Refresh token is not valid');
    }
    return jwt.verify(refreshToken, config.jwtRefreshTokenSecret);
  }

  verifyAccessToken(accessToken) {
    return jwt.verify(accessToken, config.jwtAccessTokenSecret);
  }
}

export default new AuthService();

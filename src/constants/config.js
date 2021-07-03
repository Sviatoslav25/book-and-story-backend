import dotenv from 'dotenv';

dotenv.config();

export default {
  jwtAccessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
  mongoUri: process.env.MONGO_URI,
  logLevel: process.env.LOG_LEVEL,
  isProduction: process.env.NODE_ENV !== 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
};

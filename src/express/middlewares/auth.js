import AuthService from '../../services/AuthService';
import UserService from '../../services/UserService';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader;
  try {
    const jwtUser = AuthService.verifyAccessToken(token);
    req.jwtUser = jwtUser;
    req.getUser = () => {
      return UserService.findById(jwtUser._id);
    };
    return next();
  } catch (e) {
    return res.sendStatus(401);
  }
};

export default authMiddleware;

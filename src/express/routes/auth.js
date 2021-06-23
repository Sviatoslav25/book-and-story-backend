import authMiddleware from '../middlewares/auth';
import UserService from '../../services/UserService';

const addAuthRoutes = (app) => {
  app.get('/api/auth/greet', authMiddleware, (req, res) => {
    const { email } = req.jwtUser;
    return res.send(`Hello ${email}!`);
  });

  app.get('/api/auth/me', authMiddleware, (req, res) => {
    return res.json(req.getUser());
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const { accessToken, refreshToken } = await UserService.loginWithPassword({ email, password });
      return res.json({ accessToken, refreshToken });
    } catch (e) {
      return res.sendStatus(401);
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    const { token: refreshToken } = req.body;
    UserService.logout(refreshToken);
    return res.sendStatus(200);
  });

  app.post('/api/auth/token', (req, res) => {
    const { token: refreshToken } = req.body;
    try {
      const accessToken = UserService.loginWithRefreshToken(refreshToken);
      return res.json({ accessToken });
    } catch (error) {
      return res.sendStatus(403);
    }
  });

  app.post('/api/auth/registration', async (req, res) => {
    try {
      const { email, password } = req.body;
      await UserService.createAccount({ email, password });
      const { accessToken, refreshToken } = await UserService.loginWithPassword({ email, password });
      return res.json({ accessToken, refreshToken });
    } catch (e) {
      res.status(403);
      return res.json({ error: e.message });
    }
  });
};

export default addAuthRoutes;

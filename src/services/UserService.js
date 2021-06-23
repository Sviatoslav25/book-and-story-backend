import bcrypt from 'bcrypt';
import { omit } from 'lodash';
import AuthService from './AuthService';

class UserService {
  users = [];

  #privateFields = ['hashPassword'];

  #omitPrivateFields(user) {
    return omit(user, this.#privateFields);
  }

  findByEmail(email, shouldIncludePrivateFields) {
    const user = this.users.find((u) => u.email === email);
    if (!user) {
      return null;
    }
    if (shouldIncludePrivateFields) {
      return user;
    }
    return this.#omitPrivateFields(user);
  }

  findById(id, shouldIncludePrivateFields) {
    const user = this.users.find((u) => u._id === id);
    if (!user) {
      return null;
    }
    if (shouldIncludePrivateFields) {
      return user;
    }
    return this.#omitPrivateFields(user);
  }

  async createAccount({ email, password }) {
    let user = this.findByEmail(email);
    if (user) {
      throw new Error('user with this email already registered');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    user = { _id: this.users.length + 1, email, hashPassword };
    this.users.push(user);
  }

  async loginWithPassword({ email, password }) {
    const user = this.findByEmail(email, true);
    if (!user) {
      throw new Error('User not found');
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.hashPassword);
    if (!isPasswordCorrect) {
      throw new Error('incorrect password');
    }
    const accessToken = AuthService.generateAccessToken(user);
    const refreshToken = AuthService.generateRefreshToken(user);
    const userWithoutPrivateFields = this.#omitPrivateFields(user);
    return { accessToken, refreshToken, user: userWithoutPrivateFields };
  }

  loginWithRefreshToken(refreshToken) {
    return AuthService.issueNewAccessToken(refreshToken);
  }

  logout(refreshToken) {
    AuthService.invalidateRefreshToken(refreshToken);
  }
}

export default new UserService();

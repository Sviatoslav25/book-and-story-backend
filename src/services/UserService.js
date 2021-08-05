import bcrypt from 'bcrypt';
import { omit } from 'lodash';
import { ObjectID } from 'mongodb';
import AuthService from './AuthService';
import MongoClientProvider from './MongoClientProvider';
import ProfileService from './ProfileService';

class UserService {
  collectionName = 'users';

  getCollection = () => {
    return MongoClientProvider.db.collection(this.collectionName);
  };

  #privateFields = ['hashPassword'];

  #omitPrivateFields(user) {
    return omit(user, this.#privateFields);
  }

  async findByEmail(email, shouldIncludePrivateFields) {
    const user = await this.getCollection().findOne({ email });
    if (!user) {
      return null;
    }
    if (shouldIncludePrivateFields) {
      return user;
    }
    return this.#omitPrivateFields(user);
  }

  async findById(_id, shouldIncludePrivateFields) {
    const user = await this.getCollection().findOne({ _id: new ObjectID(_id) });
    if (!user) {
      return null;
    }
    if (shouldIncludePrivateFields) {
      return user;
    }
    return this.#omitPrivateFields(user);
  }

  async createAccount({ email, password }) {
    let user = await this.findByEmail(email);
    if (user) {
      throw new Error('user with this email already registered');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    user = { hashPassword, email, createAt: new Date() };
    const result = await this.getCollection().insertOne(user);
    await ProfileService.createProfile({ userId: result.insertedId, email });
  }

  async loginWithPassword({ email, password }) {
    const user = await this.findByEmail(email, true);
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

import { ApolloServer } from 'apollo-server-express';
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';
import { typeDefs, resolvers } from './schema';

const getUserContext = (req) => {
  const ctx = {
    jwtUser: null,
    getUser: () => null,
    userId: null,
  };
  const authHeader = req.headers.authorization;
  const token = authHeader;
  if (!token) {
    return ctx;
  }
  try {
    const jwtUser = AuthService.verifyAccessToken(token);
    return {
      ...ctx,
      jwtUser,
      getUser: () => {
        return UserService.findById(jwtUser._id);
      },
      userId: jwtUser._id,
    };
  } catch (e) {
    return ctx;
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return { ...getUserContext(req) };
  },
});

export default server;

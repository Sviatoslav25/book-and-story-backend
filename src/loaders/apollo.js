import server from '../graphql/index';

async function apolloLoader(app) {
  await server.start();

  server.applyMiddleware({ app });
}

export default apolloLoader;

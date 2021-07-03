import MongoClientProvider from '../services/MongoClientProvider';

export default async function dbLoader() {
  await MongoClientProvider.connect();
}

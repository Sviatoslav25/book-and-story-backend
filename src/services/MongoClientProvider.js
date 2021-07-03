import { MongoClient } from 'mongodb';
import config from '../constants/config';

class MongoClientProvider {
  client;

  db;

  async connect() {
    this.client = new MongoClient(config.mongoUri);
    await this.client.connect();
    this.db = this.client.db();
  }
}

export default new MongoClientProvider();

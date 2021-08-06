import { ObjectId } from 'mongodb';
import MongoClientProvider from './MongoClientProvider';

class SubscriptionsService {
  collectionName = 'subscriptions';

  getCollection() {
    return MongoClientProvider.db.collection(this.collectionName);
  }

  addSubscription = async ({ userId, authorId }) => {
    return this.getCollection().insertOne({ userId: new ObjectId(userId), authorId: new ObjectId(authorId) });
  };

  removeSubscription = async ({ userId, authorId }) => {
    return this.getCollection().removeOne({ userId: new ObjectId(userId), authorId: new ObjectId(authorId) });
  };

  getAuthorsFollowedByUser = async (userId) => {
    return this.getCollection()
      .find({ userId: new ObjectId(userId) }, { authorId: 1 })
      .toArray();
  };

  getUsersSubscribedToAuthor = async (authorId) => {
    return this.getCollection()
      .find({ authorId: new ObjectId(authorId) })
      .toArray();
  };

  addedFieldIsFollowedForUsersList = async ({ userId, userList }) => {
    const authorsIsFollowedByUser = await this.getAuthorsFollowedByUser(userId);
    return userList.map((item) => {
      const result = authorsIsFollowedByUser.find((author) => {
        return author.authorId.equals(item.userId);
      });
      if (result) {
        return { ...item, isFollowed: true };
      }
      return { ...item, isFollowed: false };
    });
  };
}

export default new SubscriptionsService();

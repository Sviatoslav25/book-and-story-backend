import { ObjectID } from 'mongodb';
import MongoClientProvider from './MongoClientProvider';

class FavoriteService {
  collectionNameForBooks = 'favoriteBooks';

  collectionNameForStories = 'favoriteStories';

  getCollectionForBooks = () => {
    return MongoClientProvider.db.collection(this.collectionNameForBooks);
  };

  getCollectionForStories = () => {
    return MongoClientProvider.db.collection(this.collectionNameForStories);
  };

  addBookToFavorites = async ({ bookId, userId }) => {
    return this.getCollectionForBooks().insertOne({
      bookId: new ObjectID(bookId),
      userId: new ObjectID(userId),
      createdAt: new Date(),
    });
  };

  addStoryToFavorites = async ({ storyId, userId }) => {
    return this.getCollectionForStories().insertOne({
      storyId: new ObjectID(storyId),
      userId: new ObjectID(userId),
      createdAt: new Date(),
    });
  };

  deleteBookFromFavorites = async ({ bookId, userId }) => {
    return this.getCollectionForBooks().remove({
      bookId: new ObjectID(bookId),
      userId: new ObjectID(userId),
    });
  };

  getFavoritesBooks = async (userId) => {
    return this.getCollectionForBooks()
      .find({ userId: new ObjectID(userId) })
      .toArray();
  };

  getFavoritesStories = async (userId) => {
    return this.getCollectionForStories()
      .find({ userId: new ObjectID(userId) })
      .toArray();
  };

  isFavoriteBookForCurrentUser = async ({ bookId, userId }) => {
    const result = await this.getCollectionForBooks().findOne({
      bookId: new ObjectID(bookId),
      userId: new ObjectID(userId),
    });
    if (result) {
      return true;
    }
    return false;
  };

  removeBookFromFavorite = async ({ bookId, userId }) => {
    return this.getCollectionForBooks().remove({ bookId: new ObjectID(bookId), userId: new ObjectID(userId) });
  };

  isFavoriteStoryForCurrentUser = async ({ storyId, userId }) => {
    const result = await this.getCollectionForStories().findOne({
      storyId: new ObjectID(storyId),
      userId: new ObjectID(userId),
    });
    if (result) {
      return true;
    }
    return false;
  };

  removeStoryFromFavorites = async ({ storyId, userId }) => {
    return this.getCollectionForStories().remove({ storyId: new ObjectID(storyId), userId: new ObjectID(userId) });
  };
}

export default new FavoriteService();

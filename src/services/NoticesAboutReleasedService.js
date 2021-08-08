import { ObjectId } from 'mongodb';
import MongoClientProvider from './MongoClientProvider';

class NoticesAboutReleasedService {
  collectionNameForBook = 'noticesAboutBookReleased';

  collectionNameForStory = 'noticesAboutStoryReleased';

  getCollectionForBook() {
    return MongoClientProvider.db.collection(this.collectionNameForBook);
  }

  getCollectionForStory() {
    return MongoClientProvider.db.collection(this.collectionNameForStory);
  }

  bookReleased = async ({ authorId, userIdList, bookId }) => {
    const dataForInsert = userIdList.map((item) => {
      return {
        userId: new ObjectId(item.userId),
        authorId: new ObjectId(authorId),
        bookId: new ObjectId(bookId),
        isRead: false,
        createdAt: new Date(),
      };
    });
    return this.getCollectionForBook().insertMany(dataForInsert);
  };

  storyReleased = async ({ authorId, userIdList, storyId }) => {
    const dataForInsert = userIdList.map((item) => {
      return {
        userId: new ObjectId(item.userId),
        authorId: new ObjectId(authorId),
        storyId: new ObjectId(storyId),
        isRead: false,
        createdAt: new Date(),
      };
    });
    return this.getCollectionForStory().insertMany(dataForInsert);
  };

  userReadNoticeForStory = async ({ userId, noticeId }) => {
    return this.getCollectionForStory().updateOne(
      { userId: new ObjectId(userId), _id: new ObjectId(noticeId) },
      { $set: { isRead: true } }
    );
  };

  userReadNoticeForBook = async ({ userId, noticeId }) => {
    return this.getCollectionForBook().updateOne(
      { userId: new ObjectId(userId), _id: new ObjectId(noticeId) },
      { $set: { isRead: true } }
    );
  };

  getNoticeForReleasedBook = async (userId) => {
    return this.getCollectionForBook()
      .find({ userId: new ObjectId(userId) })
      .toArray();
  };

  getNoticeForReleasedStory = async (userId) => {
    return this.getCollectionForStory()
      .find({ userId: new ObjectId(userId) })
      .toArray();
  };

  removeNoticeForBook = async ({ userId, noticeId }) => {
    return this.getCollectionForBook().removeOne({ userId: new ObjectId(userId), _id: new ObjectId(noticeId) });
  };

  removeNoticeForStory = async ({ userId, noticeId }) => {
    return this.getCollectionForStory().removeOne({ userId: new ObjectId(userId), _id: new ObjectId(noticeId) });
  };

  removeBook = async (bookId) => {
    return this.getCollectionForBook().remove({ bookId: new ObjectId(bookId) });
  };

  removeStory = async (storyId) => {
    return this.getCollectionForStory().remove({ storyId: new ObjectId(storyId) });
  };

  noticeQuantity = async (userId) => {
    const numberOfNoticeAboutReleaseOfBooks = await this.getCollectionForBook()
      .find({
        userId: new ObjectId(userId),
        isRead: false,
      })
      .count();
    const numberOfNoticeAboutReleaseOfStory = await this.getCollectionForStory()
      .find({
        userId: new ObjectId(userId),
        isRead: false,
      })
      .count();
    return numberOfNoticeAboutReleaseOfBooks + numberOfNoticeAboutReleaseOfStory;
  };
}

export default new NoticesAboutReleasedService();

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

  userReadNoticeForBook = async ({ userId, noticeId }) => {
    return this.getCollectionForBook().updateOne(
      { userId: new ObjectId(userId), _id: new ObjectId(noticeId) },
      { $set: { isRead: true } }
    );
  };

  getNoticeForUser = async (userId) => {
    return this.getCollectionForBook()
      .find({ userId: new ObjectId(userId) })
      .toArray();
  };

  removeNotice = async (userId, _id) => {
    return this.getCollectionForBook().removeOne({ userId: new ObjectId(userId), _id: new ObjectId(_id) });
  };

  removeBook = async (bookId) => {
    return this.getCollectionForBook().remove({ bookId: new ObjectId(bookId) });
  };

  noticeQuantity = async (userId) => {
    const numberOfNoticeAboutReleaseOfBooks = await this.getCollectionForBook()
      .find({
        userId: new ObjectId(userId),
        isRead: false,
      })
      .count();
    return numberOfNoticeAboutReleaseOfBooks;
  };
}

export default new NoticesAboutReleasedService();

import { ObjectID } from 'mongodb';
import MongoClientProvider from './MongoClientProvider';

class RatingService {
  collectionNameForBooks = 'ratingsForBooks';

  collectionNameForStories = 'ratingsForStories';

  getCollectionForBook = () => {
    return MongoClientProvider.db.collection(this.collectionNameForBooks);
  };

  getCollectionForStories = () => {
    return MongoClientProvider.db.collection(this.collectionNameForStories);
  };

  addRatingForBooks = async ({ bookId, userId, rating }) => {
    return this.getCollectionForBook().insertOne({
      bookId: new ObjectID(bookId),
      userId: new ObjectID(userId),
      rating,
      createAt: new Date(),
    });
  };

  addRatingForStories = async ({ storyId, userId, rating }) => {
    return this.getCollectionForStories().insertOne({
      storyId: new ObjectID(storyId),
      userId: new ObjectID(userId),
      rating,
      createAt: new Date(),
    });
  };

  userCanAddRatingForBooks = async ({ userId, bookList }) => {
    const ratingList = await this.getCollectionForBook()
      .find({ userId: new ObjectID(userId) })
      .toArray();
    return bookList.map((book) => {
      const userAddedRatingForBook = ratingList.find((rating) => rating.bookId.equals(book._id));
      if (userAddedRatingForBook) {
        return { ...book, userCanAddRating: false };
      }
      return { ...book, userCanAddRating: true };
    });
  };

  userCanAddRatingForStories = async ({ userId, storyList }) => {
    const ratingList = await this.getCollectionForStories()
      .find({ userId: new ObjectID(userId) })
      .toArray();
    return storyList.map((story) => {
      const userAddedRatingForStory = ratingList.find((rating) => rating.storyId.equals(story._id));
      if (userAddedRatingForStory) {
        return { ...story, userCanAddRating: false };
      }
      return { ...story, userCanAddRating: true };
    });
  };

  calculateRatingForBookList = async (bookList) => {
    const ratings = await this.getCollectionForBook()
      .aggregate([{ $group: { _id: '$bookId', avg: { $avg: '$rating' } } }])
      .toArray();
    const bookListWithRating = bookList.map((book) => {
      const ratingForBook = ratings.find((rating) => rating._id.equals(book._id));
      if (ratingForBook) {
        return { ...book, rating: ratingForBook.avg };
      }
      return { ...book, rating: 0 };
    });

    return bookListWithRating;
    // const bookListId=bookList.map((book)=>book._id);
    // this.getCollectionForBook().aggregate([{ $match: { _id: { $in: bookListId } } },
    //   {$group:{_id:"$bookId"}}
    // ]);
  };

  calculateRatingForBook = async (book) => {
    const result = await this.getCollectionForBook()
      .aggregate([{ $group: { _id: '$bookId', avg: { $avg: '$rating' } } }, { $match: { _id: book._id } }])
      .toArray();
    const [rating] = result;
    if (!rating) {
      return { ...book, rating: 0 };
    }
    return { ...book, rating: rating.avg };
  };

  calculateRatingForStory = async (story) => {
    const result = await this.getCollectionForStories()
      .aggregate([{ $group: { _id: '$storyId', avg: { $avg: '$rating' } } }, { $match: { _id: story._id } }])
      .toArray();
    const [rating] = result;
    if (!rating) {
      return { ...story, rating: 0 };
    }
    return { ...story, rating: rating.avg };
  };

  calculateRatingForStoryList = async (storyList) => {
    const ratings = await this.getCollectionForStories()
      .aggregate([{ $group: { _id: '$storyId', avg: { $avg: '$rating' } } }])
      .toArray();
    const storyListWithRating = storyList.map((story) => {
      const ratingForStory = ratings.find((rating) => rating._id.equals(story._id));
      if (ratingForStory) {
        return { ...story, rating: ratingForStory.avg };
      }
      return { ...story, rating: 0 };
    });
    return storyListWithRating;
  };
}

export default new RatingService();

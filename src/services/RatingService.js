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
    return this.getCollectionForBook().insert({ bookId: new ObjectID(bookId), userId: new ObjectID(userId), rating });
  };

  addRatingForStories = async ({ storyId, userId, rating }) => {
    return this.getCollectionForStories().insert({
      storyId: new ObjectID(storyId),
      userId: new ObjectID(userId),
      rating,
    });
  };

  calculateRatingForBookList = async (bookList) => {
    const ratings = await this.getCollectionForBook()
      .aggregate([{ $group: { _id: '$bookId', avg: { $avg: '$rating' } } }])
      .toArray();
    const bookListWithRating = bookList.map((book) => {
      const ratingForBook = ratings.find((rating) => rating._id === book._id.toString());
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

  calculateRatingForStoryList = async (storyList) => {
    const ratings = await this.getCollectionForStories()
      .aggregate([{ $group: { _id: '$storyId', avg: { $avg: '$rating' } } }])
      .toArray();
    const storyListWithRating = storyList.map((story) => {
      const ratingForStory = ratings.find((rating) => rating._id === story._id.toString());
      if (ratingForStory) {
        return { ...story, rating: ratingForStory.avg };
      }
      return { ...story, rating: 0 };
    });
    return storyListWithRating;
  };
}

export default new RatingService();

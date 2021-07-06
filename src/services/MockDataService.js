import { bookListFactory } from '../mocks/book';
import { storyListFactory } from '../mocks/story';
import RatingService from './RatingService';

class MockDataService {
  constructor() {
    this.ratingForBookList = [];
    this.ratingForStoryList = [];
    this.bookList = RatingService.calculateRatingForBookList(bookListFactory(), this.ratingForBookList);
    this.storyList = RatingService.calculateRatingForStoryList(storyListFactory(), this.ratingForStoryList);
  }

  setBookList = (bookList) => {
    this.bookList = bookList;
  };

  setStoryList = (storyList) => {
    this.storyList = storyList;
  };

  getStories() {
    return this.storyList;
  }

  getStoryById(id) {
    return this.storyList.find((story) => story._id === id);
  }

  addRantingForBook(bookId, userId, rating) {
    this.ratingForBookList.push({
      bookId,
      userId,
      rating,
    });
    const book = this.bookList.find((item) => item._id === bookId);
    if (!book) {
      return {
        statusCode: 404,
        message: 'book not found',
      };
    }
    const bookWithNewRanting = RatingService.calculateRantingForBook(book, this.ratingForBookList);
    const index = this.bookList.findIndex((item) => item._id === bookId);
    this.bookList[index] = bookWithNewRanting;
    return {
      statusCode: 200,
      message: 'ok',
    };
  }

  addRantingForStory(storyId, userId, rating) {
    this.ratingForStoryList.push({
      storyId,
      userId,
      rating,
    });
    const story = this.storyList.find((item) => item._id === storyId);
    if (!story) {
      return {
        statusCode: 404,
        message: 'story not found',
      };
    }
    const storyWithNewRanting = RatingService.calculateRantingForStory(story, this.ratingForStoryList);
    const index = this.storyList.findIndex((item) => item._id === storyId);
    this.storyList[index] = storyWithNewRanting;
    return {
      statusCode: 200,
      message: 'ok',
    };
  }
}

export default new MockDataService();

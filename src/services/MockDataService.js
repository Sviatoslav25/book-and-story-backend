import { bookListFactory, dataForBook } from '../mocks/book';
import { dataForStory, storyListFactory } from '../mocks/story';
import CalculateRating from './CalculateRating';

class MockDataService {
  constructor() {
    this.ratingForBookList = [];
    this.ratingForStoryList = [];
    this.bookList = CalculateRating.calculateRatingForBookList(bookListFactory(), this.ratingForBookList);
    this.storyList = CalculateRating.calculateRatingForStoryList(storyListFactory(), this.ratingForStoryList);
  }

  getBooks() {
    return this.bookList;
  }

  getBookById(id) {
    return this.bookList.find((book) => book._id === id);
  }

  getStories() {
    return this.storyList;
  }

  getStoryById(id) {
    return this.storyList.find((story) => story._id === id);
  }

  createStory(storyData) {
    const story = { ...storyData, ...dataForStory() };
    this.storyList = [story, ...this.storyList];
  }

  createBook(bookData) {
    const book = { ...bookData, ...dataForBook() };
    this.bookList = [book, ...this.bookList];
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
    const bookWithNewRanting = CalculateRating.calculateRantingForBook(book, this.ratingForBookList);
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
    const storyWithNewRanting = CalculateRating.calculateRantingForStory(story, this.ratingForStoryList);
    const index = this.storyList.findIndex((item) => item._id === storyId);
    this.storyList[index] = storyWithNewRanting;
    return {
      statusCode: 200,
      message: 'ok',
    };
  }
}

export default new MockDataService();

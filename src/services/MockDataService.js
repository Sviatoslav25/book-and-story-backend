import { bookListFactory, dataForBook } from '../mocks/book';
import { dataForStory, storyListFactory } from '../mocks/story';

class MockDataService {
  constructor() {
    // this.bookList = [];
    // this.storyList = [];
    this.bookList = bookListFactory();
    this.storyList = storyListFactory();
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
}

export default new MockDataService();

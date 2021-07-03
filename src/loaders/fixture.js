import { bookListFactory } from '../mocks/book';
import { storyListFactory } from '../mocks/story';
import BookService from '../services/BookService';
import StoryService from '../services/StoryService';
import UserService from '../services/UserService';

const defaultUsers = [
  {
    _id: '1',
    email: 'bbb@ggg.com',
    password: '1234567',
  },
  {
    _id: '2',
    email: 'aaa@ggg.com',
    password: '1234567',
  },
];

export default async function fixtures() {
  defaultUsers.forEach((u) => {
    UserService.createAccount(u);
  });
  const countBooks = await BookService.getCollection().find({}).count();
  if (countBooks === 0) {
    const books = bookListFactory();
    await Promise.all(books.map((book) => BookService.createBook(book)));
  }
  const countStories = await StoryService.getCollection().find({}).count();
  if (countStories === 0) {
    const stories = storyListFactory();
    await Promise.all(stories.map((story) => StoryService.createStory(story)));
  }
}

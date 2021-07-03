import { ObjectId } from 'mongodb';
import MockDataService from './MockDataService';
import MongoClientProvider from './MongoClientProvider';

class StoryService {
  collectionName = 'stories';

  getCollection = () => {
    return MongoClientProvider.db.collection(this.collectionName);
  };

  getStories = async () => {
    return this.getCollection().find({}).toArray();
  };

  getStoryById = async (_id) => {
    return this.getCollection().findOne({ _id: ObjectId(_id) });
  };

  createStory = async (story) => {
    return this.getCollection().insert(story);
  };

  searchStory = async (lineForSearch) => {
    return this.getCollection()
      .find({
        $or: [
          { name: { $regex: lineForSearch, $options: 'i' } },
          { shortDescription: { $regex: lineForSearch, $options: 'i' } },
        ],
      })
      .toArray();
  };

  getMyStories = (authorId) => {
    const stories = MockDataService.getStories();
    return stories.filter((story) => story.authorId === authorId);
  };

  deleteStory = ({ authorId, storyId }) => {
    let stories = MockDataService.getStories();
    stories = stories.filter((story) => story._id !== storyId || !(authorId === story.authorId));
    MockDataService.setStoryList(stories);
  };
}

export default new StoryService();

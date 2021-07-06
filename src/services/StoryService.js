import { ObjectID, ObjectId } from 'mongodb';
import MongoClientProvider from './MongoClientProvider';
import RatingService from './RatingService';

class StoryService {
  collectionName = 'stories';

  getCollection = () => {
    return MongoClientProvider.db.collection(this.collectionName);
  };

  getStories = async () => {
    const storyList = await this.getCollection().find({}).sort({ createdAt: -1 }).toArray();
    return RatingService.calculateRatingForStoryList(storyList);
  };

  getStoryById = async (_id) => {
    return this.getCollection().findOne({ _id: ObjectId(_id) });
  };

  createStory = async (story) => {
    const storyData = { ...story, rating: 0, createdAt: new Date() };
    return this.getCollection().insert(storyData);
  };

  searchStory = async (lineForSearch) => {
    const stories = await this.getCollection()
      .find({
        $or: [
          { name: { $regex: lineForSearch, $options: 'i' } },
          { shortDescription: { $regex: lineForSearch, $options: 'i' } },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();
    return RatingService.calculateRatingForStoryList(stories);
  };

  getMyStories = async (authorId) => {
    const books = await this.getCollection().find({ authorId }).sort({ createdAt: -1 }).toArray();
    return books;
  };

  deleteStory = async ({ authorId, storyId }) => {
    const result = await this.getCollection().removeOne({ _id: ObjectID(storyId), authorId });
    if (result.result.n === 0) {
      throw new Error('story has not been deleted');
    }
  };
}

export default new StoryService();

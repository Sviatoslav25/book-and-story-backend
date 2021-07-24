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

  createStory = async (story, authorId) => {
    const storyData = { ...story, createdAt: new Date(), updateAt: new Date(), authorId: new ObjectID(authorId) };
    const result = await this.getCollection().insertOne(storyData);
    return { ...story, _id: result.insertedId };
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

  getMyStories = async ({ userId: authorId }) => {
    const stories = await this.getCollection()
      .find({ authorId: new ObjectID(authorId) })
      .sort({ createdAt: -1 })
      .toArray();
    return stories;
  };

  deleteStory = async ({ userId: authorId, storyId }) => {
    const result = await this.getCollection().removeOne({ _id: ObjectID(storyId), authorId: new ObjectID(authorId) });
    if (result.result.n === 0) {
      throw new Error('story has not been deleted');
    }
  };

  updateStory = async (_id, data, { userId: authorId }) => {
    return this.getCollection().updateOne({ _id: ObjectID(_id), authorId: new ObjectID(authorId) }, { $set: data });
  };

  canViewStory = (story, userId) => {
    const authorObjectId = new ObjectID(story.authorId);
    const userObjectId = new ObjectID(userId);
    if (authorObjectId.equals(userObjectId)) {
      return true;
    }
    return false;
  };
}

export default new StoryService();

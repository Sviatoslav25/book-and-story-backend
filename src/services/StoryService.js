import { ObjectID, ObjectId } from 'mongodb';
import FavoriteService from './FavoriteService';
import MongoClientProvider from './MongoClientProvider';
import RatingService from './RatingService';

class StoryService {
  collectionName = 'stories';

  getCollection = () => {
    return MongoClientProvider.db.collection(this.collectionName);
  };

  getStories = async (userId) => {
    const storyList = await this.getCollection().find({ isPrivate: false }).sort({ createdAt: -1 }).toArray();
    const storyListWithRating = await RatingService.calculateRatingForStoryList(storyList);
    return RatingService.userCanAddRatingForStories({ userId, storyList: storyListWithRating });
  };

  getStoryById = async (_id, userId) => {
    const story = await this.getCollection().findOne({ _id: ObjectId(_id) });
    if (!story) {
      throw new Error('Story not found');
    }
    story.isFavorite = await FavoriteService.isFavoriteStoryForCurrentUser({ storyId: _id, userId });
    return RatingService.calculateRatingForStory(story);
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
        isPrivate: false,
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
    const result = await this.getCollection().removeOne({
      _id: new ObjectID(storyId),
      authorId: new ObjectID(authorId),
    });
    if (result.result.n === 0) {
      throw new Error('story has not been deleted');
    }
    await RatingService.getCollectionForStories().remove({ storyId: new ObjectID(storyId) });
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

  changePrivacyOfStory = ({ storyId, authorId, isPrivate }) => {
    return this.getCollection().updateOne(
      { _id: new ObjectID(storyId), authorId: new ObjectID(authorId) },
      { $set: { isPrivate } }
    );
  };

  getFavoritesStories = async (userId) => {
    const result = await FavoriteService.getFavoritesStories(userId);
    if (result.length === 0) {
      return [];
    }
    const storiesId = result.map((item) => {
      return { _id: item.storyId };
    });
    return this.getCollection().find({ $or: storiesId }).toArray();
  };
}

export default new StoryService();

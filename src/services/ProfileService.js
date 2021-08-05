import { ObjectId, ObjectID } from 'mongodb';
import MongoClientProvider from './MongoClientProvider';

class ProfileService {
  collectionName = 'profile';

  profileDefaultData = {
    nickname: '',
    profilePhoto: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    aboutMyself: '',
  };

  getCollection = () => {
    return MongoClientProvider.db.collection(this.collectionName);
  };

  createProfile = async ({ userId, email }) => {
    const profileData = { ...this.profileDefaultData, email };
    return this.getCollection().insertOne({ userId: new ObjectID(userId), ...profileData });
  };

  getProfileById = async (profileId) => {
    return this.getCollection().findOne({ _id: new ObjectID(profileId) });
  };

  getProfileByUserId = async (userId) => {
    return this.getCollection().findOne({ userId: new ObjectId(userId) });
  };

  getProfileList = async (userId) => {
    return this.getCollection()
      .find({ userId: { $ne: new ObjectID(userId) } })
      .toArray();
  };

  updateProfile = async ({ userId, data }) => {
    return this.getCollection().updateOne({ userId: new ObjectId(userId) }, { $set: data });
  };
}

export default new ProfileService();

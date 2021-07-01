import MockDataService from './MockDataService';

class StoryService {
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

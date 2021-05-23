const CalculateRating = {
  calculateAverageRating(arrayRating) {
    if (!arrayRating.length) {
      return 0;
    }
    const sumRating = arrayRating.reduce((accumulator, currentValue) => {
      return accumulator + Number(currentValue.rating);
    }, 0);
    return sumRating / arrayRating.length;
  },

  calculateRatingForBookList(bookList, ratingForBooks) {
    return bookList.map((book) => {
      const arrayRating = ratingForBooks.filter((item) => book._id === item.bookId);
      return { ...book, rating: this.calculateAverageRating(arrayRating) };
    });
  },

  calculateRatingForStoryList(storyList, ratingForStories) {
    return storyList.map((story) => {
      const arrayRating = ratingForStories.filter((item) => story._id === item.storyId);
      return { ...story, rating: this.calculateAverageRating(arrayRating) };
    });
  },

  calculateRantingForBook(book, ratingForBooks) {
    const arrayRating = ratingForBooks.filter((item) => book._id === item.bookId);
    return { ...book, rating: this.calculateAverageRating(arrayRating) };
  },

  calculateRantingForStory(story, ratingForStories) {
    const arrayRating = ratingForStories.filter((item) => story._id === item.storyId);
    return { ...story, rating: this.calculateAverageRating(arrayRating) };
  },
};

export default CalculateRating;

import faker from 'faker';

export function storyListFactory(n = 20) {
  return [...new Array(n)].map(storyFactory);
}

export function storyFactory() {
  return {
    name: faker.lorem.words(),
    date: faker.date.past(),
    authorId: faker.datatype.uuid(),
    genre: faker.lorem.words(),
    shortDescription: faker.lorem.paragraph(),
    story: faker.lorem.paragraphs(),
  };
}

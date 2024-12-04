export const resolvers = {
  Query: {
    jobs: () => {
      return [
        {
          id: "test-id-1",
          title: "This Title 1",
          description: "This Description",
        },
        {
          id: "test-id-2",
          title: "This Title 2",
          description: "This Description",
        },
      ];
    },
  },
};

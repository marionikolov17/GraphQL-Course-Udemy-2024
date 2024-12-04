export const resolvers = {
    Query: {
        job: () => {
            return {
                id: "test-id",
                title: "This Title",
                description: "This Description"
            }
        }
    }
}
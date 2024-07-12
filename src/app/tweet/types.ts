export const types = `#graphql
    input createTweetData {
        content: String!
        contentImage: String
    }
    type Tweet {
        id: ID!
        content: String!
        contentImage: String
        author: User
    }
`;

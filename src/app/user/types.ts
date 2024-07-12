export const types = `#graphql
 
  
 type User {
    id: ID!
    firstName: String!
    lastName: String
    email: String!
    avatarUrl: String
    tweets: [Tweet]
 }

`
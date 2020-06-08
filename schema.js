const { gql } = require('apollo-server-lambda');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  scalar Date

  type Query {
    hello: String
    post(permlink: String!): Post
  }

  "Contains all data for displaying a full post or a post excerpt"
  type Post {
    createdAt: Date
    author: AuthorSchema
    permlink: String
    title: String
    location: LocationSchema
    body: String
    excerpt: String
    thumbnail: String
    coverImage: String
    updatedAt: Date
    tags: [String]
    wordCount: Int
    readTime: Float
    community: CommunitySchema
    youtubeId: String
  }

  "Information about the post author"
  type AuthorSchema {
    username: String
    displayName: String
    avatar: String
  }

  "Information about the post community"
  type CommunitySchema {
    id: Int
    title: String
    lang: String
  }

  "Information about the post location"
  type LocationSchema {
    countryCode: String
    subdivision: String
    city: String
    coordinates: PointSchema
  }

  "Coordinates in geojson format"
  type PointSchema {
    coordinates: [Float]
  }
`;

module.exports = typeDefs;

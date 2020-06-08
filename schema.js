const { gql } = require('apollo-server-lambda');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  scalar Date

  type Query {
    post(permlink: String!): Post
    posts(
      """
      List of any country codes to include, e.g. ["th", "vn"] for posts only from Thailand and Vietnam. Defaults to any country.
      """
      countryCodes: [String]
      """
      List of subdivisions to include, e.g. ["California"]. Defaults to any subdivision.
      """
      subdivisions: [String]
      """
      List of cities to include, e.g. ["Paris"]. Defaults to any city.
      """
      cities: [String]
      """
      Only show posts within this location box. Format: [southwest.lat, southwest.lng, northeast.lng, northeast.lat]. Can be used for example with Google Places geocoder. Defaults to the whole world.
      """
      locationBox: [Float]
      """
      Only posts with *all* tags specified are returned, e.g. ["foodoftheworld", "photography"]. Defaults to any tag.
      """
      tags: [String]
      """
      List of 6-digit community IDs, e.g. [177777] for the Hitchhiking community ("hive-177777"). Defaults to any community
      """
      communities: [Int]
      """
      List of two-digit language codes, e.g. ["en", "de"] to show only posts in English and German. Defaults to any language.
      """
      languages: [String]
      """
      Include posts posted through Truvvl? Defaults to false
      """
      includeTruffl: Boolean
      """
      Format [long, lat] (geojson)
      """
      nearCoordinates: [Float]
      """
      Show only posts that have coordinates set (e.g. for fetching posts for a map). Defaults to false.
      """
      hasLocation: Boolean
      """
      "newest" (default) or "oldest"
      """
      orderby: String
      offset: Int
      limit: Int
    ): [Post]
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

const { ApolloServer, gql } = require('apollo-server-lambda');
const MongoAPI = require('./src/datasources/mongo/mongoAPI');
const { Post } = require('./src/datasources/mongo/models');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  scalar Date

  type Query {
    hello: String
    post(permlink: String!): Post
  }

  type Post {
    createdAt: Date
    permlink: String
    title: String
    body: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    post: (_, { permlink }, { dataSources }) => {
      return dataSources.mongoAPI.getPost(permlink);
    },
  },
};

const store = { Post };

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: '/dev/graphql',
  },
  dataSources: () => ({
    mongoAPI: new MongoAPI({ store }),
  }),
});

exports.graphqlHandler = server.createHandler();

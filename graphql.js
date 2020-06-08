const { ApolloServer, gql } = require('apollo-server-lambda');
const mongoose = require('mongoose');
const { postSchema } = require('./models');

let conn = null;

const uri = process.env.MONGO_URL;

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
    post: (_, { permlink }) => {
      const Post = conn.model('post', postSchema);
      return Post.findOne({
        permlink,
      }).then((res) => res);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: '/dev/graphql',
  },
});

exports.graphqlHandler = (event, context, callback) => {
  // Make sure to add this so you can re-use `conn` between function calls.
  // See https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas
  context.callbackWaitsForEmptyEventLoop = false;

  // Because `conn` is in the global scope, Lambda may retain it between
  // function calls thanks to `callbackWaitsForEmptyEventLoop`.
  // This means your Lambda function doesn't have to go through the
  // potentially expensive process of connecting to MongoDB every time.
  if (conn == null) {
    conn = mongoose.createConnection(uri, {
      // Buffering means mongoose will queue up operations if it gets
      // disconnected from MongoDB and send them when it reconnects.
      // With serverless, better to fail fast if not connected.
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // and MongoDB driver buffering
    });

    // `await`ing connection after assigning to the `conn` variable
    // to avoid multiple function calls creating new connections
    conn.then(() => {
      server.createHandler()(event, context, callback);
    });
  } else server.createHandler()(event, context, callback);
};

const { ApolloServer } = require('apollo-server-lambda');
const mongoose = require('mongoose');
const { postSchema } = require('./models');
const typeDefs = require('./schema');
const {
  getMongooseSelectionFromSelectedFields,
} = require('./helpers/getMongooseSelectionFromSelectedFields');

let conn = null;

const uri = process.env.MONGO_URL;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    post: (_, { permlink }, __, info) => {
      const mongooseSelection = getMongooseSelectionFromSelectedFields(info);
      const Post = conn.model('post', postSchema);
      return Post.findOne({
        permlink,
      })
        .select(mongooseSelection)
        .lean()
        .then((res) => res);
    },
    posts: (
      _,
      {
        countryCodes,
        subdivisions,
        cities,
        locationBox,
        tags,
        communities,
        languages,
        includeTruffl,
        nearCoordinates,
        hasLocation,
        orderby,
        offset,
        limit,
      },
      __,
      info,
    ) => {
      const mongooseSelection = getMongooseSelectionFromSelectedFields(info);
      let query = {};
      if (countryCodes) query['location.countryCode'] = countryCodes;
      if (subdivisions) query['location.subdivision'] = subdivisions;
      if (cities) query['location.city'] = cities;
      if (locationBox)
        query['location.coordinates'] = {
          $geoWithin: {
            $geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [locationBox[0], locationBox[1]],
                  [locationBox[2], locationBox[1]],
                  [locationBox[2], locationBox[3]],
                  [locationBox[0], locationBox[3]],
                  [locationBox[0], locationBox[1]],
                ],
              ],
            },
          },
        };
      if (tags) query.tags = tags;
      if (communities) query['community.id'] = communities;
      if (languages) query['community.lang'] = languages;
      if (!includeTruffl) query.app = { $ne: 'truvvl' };
      if (nearCoordinates)
        query['location.coordinates'] = {
          $near: {
            $minDistance: 1,
            $geometry: {
              type: 'Point',
              coordinates: [nearCoordinates[0], nearCoordinates[1]],
            },
          },
        };
      if (hasLocation) query['location.coordinates'] = { $ne: null };
      let sortArgs = {
        createdAt: -1,
      };
      if (orderby === 'oldest')
        sortArgs = {
          createdAt: 1,
        };
      const Post = conn.model('post', postSchema);
      return Post.find(query)
        .select(mongooseSelection)
        .lean()
        .sort(sortArgs)
        .limit(limit || 10)
        .skip(offset || 0)
        .then((res) => res);
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
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    // `await`ing connection after assigning to the `conn` variable
    // to avoid multiple function calls creating new connections
    conn.then(() => {
      server.createHandler()(event, context, callback);
    });
  } else server.createHandler()(event, context, callback);
};

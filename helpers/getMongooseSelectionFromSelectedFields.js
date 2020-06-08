// https://medium.com/faun/graphql-performance-tip-database-projection-82795e434b44
const graphqlFields = require('graphql-fields');

const getMongooseSelectionFromSelectedFields = (info, fieldPath = null) => {
  const selections = graphqlFields(info);
  const mongooseSelection = Object.keys(
    fieldPath ? selections[parseInt(fieldPath)] : selections,
  ).reduce((a, b) => ({ ...a, [b]: 1 }), {});
  return mongooseSelection;
};

module.exports = { getMongooseSelectionFromSelectedFields };

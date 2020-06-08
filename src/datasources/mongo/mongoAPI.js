require('./connect');
const { DataSource } = require('apollo-datasource');

class MongoAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }
  getPost(permlink) {
    return this.store.Post.findOne({
      permlink,
    }).then((res) => res);
  }
}

module.exports = MongoAPI;

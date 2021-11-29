"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class JokeCmdMongo extends UuObjectDao {
  async createSchema() {}

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }
}

module.exports = JokeCmdMongo;

"use strict";
const JokeDeleteAbl = require("../../abl/joke-delete-abl.js");

class JokeDeleteController {
  delete(ucEnv) {
    return JokeDeleteAbl.delete(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = new JokeDeleteController();

"use strict";
const JokeCmdAbl = require("../../abl/joke-cmd-abl.js");

class JokeCmdController {
  jokeCmd(ucEnv) {
    return JokeCmdAbl.jokeCmd(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = new JokeCmdController();

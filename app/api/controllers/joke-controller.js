"use strict";
const JokeAbl = require("../../abl/joke-abl.js");

class JokeController {
  create(ucEnv) {
    return JokeAbl.create(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  get(ucEnv) {
    return JokeAbl.get(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  async getImageData(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    let dtoOut = await JokeAbl.getImageData(ucEnv.getUri().getAwid(), dtoIn);
    return ucEnv.setBinaryDtoOut(dtoOut, dtoIn.contentDisposition);
  }
}

module.exports = new JokeController();

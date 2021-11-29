"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/joke-delete-error.js");

const WARNINGS = {};

class JokeDeleteAbl {
  constructor() {
    this.validator = Validator.load();
    // this.dao = DaoFactory.getDao("jokeDelete");
  }

  async delete(awid, dtoIn, uuAppErrorMap = {}) {
    // HDS 1
    let uuJokeMain = await this.mainDao.getByAwid(awid);

    if (!uuJokeMain) {
      throw new Errors.Delete.JokeDoesNotExist({ uuAppErrorMap }, { awid });
    }

    if (uuJokeMain.state !== "active") {
      throw new Errors.Delete.JokeIsNotInCorrectState(
        { uuAppErrorMap },
        { state: uuJokeMain.state, expectedStateList: "active" }
      );
    }

    // HDS 2
    let validationResult = this.validator.validate("jokeDeleteDtoInType", dtoIn);

    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );

    // HDS 3

    let uuJoke = await this.jokeDao.get(dtoIn.id);

    if (!uuJoke) {
      throw new Errors.Delete.JokeDoesNotExist({ uuAppErrorMap }, { awid });
    } else {
      await this.jokeDao.delete(dtoIn.id);
    }

    // HDS 4

    return {
      ...uuJoke,
      uuAppErrorMap,
    };
  }
}

module.exports = new JokeDeleteAbl();

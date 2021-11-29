"use strict";
const Path = require("path");
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/joke-cmd-error.js");

const WARNINGS = {};

class JokeCmdAbl {
  constructor() {
    this.validator = Validator.load();
    this.mainDao = DaoFactory.getDao("jokeCmd");
    this.jokeDao = DaoFactory.getDao("joke");
  }

  async jokeCmd(uri, dtoIn, session, uuAppErrorMap = {}) {
    const expectedStateList = ["active", "underConstruction"];

    const awid = uri.getAwid();
    const uuJokeMain = await this.mainDao.getByAwid(awid);

    // HDS 1
    if (!uuJokeMain) {
      throw new Errors.JokeCmd.JokeDoesNotExist({ uuAppErrorMap }, { awid });
    }

    if (uuJokeMain.state !== "underConstruction") {
      throw new Errors.JokeCmd.JokeIsNotInCorrectState(
        { uuAppErrorMap },
        { expectedStateList, actualState: uuJokeMain.state }
      );
    }

    // HDS 2 - data validation
    const validationResult = this.validator.validate("jokeCreateDtoInType", dtoIn);
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.JokeCmd.InvalidDtoIn
    );

    // HDS 3

    if (dtoIn.image) {
      // {...}
    }

    // HDS 4

    //HDS5
    const uuObject = {
      ...dtoIn,
      awid,
      averageRating: 0,
      ratingCount: 0,
      visibility: false,
      uuIdentity: session.getIdentity().getUuIdentity(),
      uuIdentityName: session.getIdentity().getName(),
    };

    let joke = null;

    try {
      joke = await this.jokeDao.create(uuObject);
    } catch (err) {
      throw new Errors.JokeCmd.JokesCreateDaoFailed({ uuAppErrorMap }, err);
    }

    // HDS6
    return {
      uuAppErrorMap,
      ...joke,
    };
  }
}

module.exports = new JokeCmdAbl();

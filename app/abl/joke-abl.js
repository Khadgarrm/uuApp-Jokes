"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { AppClient } = require("uu_appg01_server");
const Errors = require("../api/errors/joke-errors.js");
const { BinaryStoreError } = require("uu_appg01_binarystore");
const path = require("path");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`,
  },

  getUnsupportedKeys: {
    code: `${Errors.Get.UC_CODE}unsupportedKeys`,
  },

  getImageDataUnsupportedKeys: {
    code: `${Errors.GetImageData.UC_CODE}unsupportedKeys`
  }
};

class JokeAbl {
  constructor() {
    this.validator = Validator.load();
    this.mainDao = DaoFactory.getDao("jokesMain");
    this.jokeDao = DaoFactory.getDao("joke");
    this.jokeImageDao = DaoFactory.getDao("jokeImage");
    this.jokeDao.createSchema();
  }

  //Get Image Data
  async getImageData(awid, dtoIn) {
    // hds 1
    // hds 1.1
    let validationResult = this.validator.validate("jokeGetImageDataDtoInType", dtoIn);
    // hds 1.2, 1.3 // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getImageDataUnsupportedKeys.code,
      Errors.GetImageData.InvalidDtoIn
    );

    // hds 2
    let dtoOut = null;
    try {
      dtoOut = await this.jokeImageDao.getDataByCode(awid, dtoIn.image);
    } catch (e) {
      if (e.code === "uu-app-binarystore/objectNotFound") {
        // A3
        throw new Errors.GetImageData.JokeImageDoesNotExist({ uuAppErrorMap }, { image: dtoIn.image });
      }
      throw e;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  //Create
  async create(uri, dtoIn, session, uuAppErrorMap = {}) {
    const expectedStateList = ["active", "underConstruction"];

    const awid = uri.getAwid();
    const uuJokeMain = await this.mainDao.getByAwid(awid);

    // HDS 1
    if (!uuJokeMain) {
      throw new Errors.Create.JokeDoesNotExist({ uuAppErrorMap }, { awid });
    }

    if (uuJokeMain.state !== "underConstruction") {
      throw new Errors.Create.JokeIsNotInCorrectState(
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
      Errors.Create.InvalidDtoIn
    );

    // HDS 3

    let jokeImage;
    if (dtoIn.image) {
      try {
        jokeImage = await this.jokeImageDao.create({ awid }, dtoIn.image);
      } catch (e) {
        if (e instanceof BinaryStoreError) {
          //
          throw new Errors.Create.JokeImageDaoCreateFailed({ uuAppErrorMap }, e);
        }
        throw e;
      }
      dtoIn.image = jokeImage.code;
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
      throw new Errors.Create.CreateJokeDaoFailed({ uuAppErrorMap }, err);
    }

    // HDS6
    return {
      uuAppErrorMap,
      ...joke,
    };
  }

  //GET
  async get(uri, dtoIn, uuAppErrorMap = {}) {
    const awid = uri.getAwid();
    const uuJokeMain = await this.mainDao.getByAwid(awid);

    const expectedStateList = "active";

    // HDS 1
    if (!uuJokeMain) {
      throw new Errors.Get.JokeDoesNotExist({ uuAppErrorMap }, { awid });
    }

    if (uuJokeMain.state !== "active") {
      throw new Errors.Get.JokeIsNotInCorrectState({ uuAppErrorMap }, expectedStateList);
    }

    // HDS 2 - data validation

    let validationResult = this.validator.validate("jokeGetDtoInType", dtoIn);
    // A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // HDS 3

    const joke = await this.jokeDao.get(awid, dtoIn.id);

    // HDS 4
    return {
      uuAppErrorMap,
      ...joke,
    };
  }
}

module.exports = new JokeAbl();

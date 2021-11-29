"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Profile, AppClientTokenService, UuAppWorkspace, UuAppWorkspaceError } = require("uu_appg01_server").Workspace;
const { UriBuilder } = require("uu_appg01_server").Uri;
const { LoggerFactory } = require("uu_appg01_server").Logging;
const { AppClient } = require("uu_appg01_server");
const Errors = require("../api/errors/joke-errors.js");

const WARNINGS = {
    createUnsupportedKeys: {
        code: `${Errors.Create.UC_CODE}unsupportedKeys`,
    },

    getUnsupportedKeys: {
        code: `${Errors.Get.UC_CODE}unsupportedKeys`,
    },
}

class JokeAbl {
    constructor() {
        this.validator = Validator.load();
        this.mainDao = DaoFactory.getDao("jokesMain");
        this.jokeDao = DaoFactory.getDao("joke");
    }

    //Create
    async create(uri, dtoIn, session, uuAppErrorMap = {}) {
        const expectedStateList = ["active", "underConstruction"]

        const awid = uri.getAwid();
        const uuJokeMain = await this.mainDao.getByAwid(awid)

        // HDS 1
        if (!uuJokeMain) {
            throw new Errors.Create.JokeDoesNotExist({ uuAppErrorMap }, { awid })
        }

        if (uuJokeMain.state !== 'underConstruction') {
            throw new Errors.Create.JokeIsNotInCorrectState({ uuAppErrorMap },
                { expectedStateList, actualState: uuJokeMain.state })
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


        if (dtoIn.image) {
            // {...}
        }

        // HDS 4



        //HDS5
        const uuObject = {
            ...dtoIn, awid, averageRating: 0, ratingCount: 0,
            visibility: false, uuIdentity: session.getIdentity().getUuIdentity(),
            uuIdentityName: session.getIdentity().getName()
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
            ...joke
        }
    }

    //GET
    async get(uri, dtoIn, uuAppErrorMap = {}) {
        const awid = uri.getAwid();
        const uuJokeMain = await this.mainDao.getByAwid(awid)

        const expectedStateList = "active"

        // HDS 1
        if (!uuJokeMain) {
            throw new Errors.Get.JokeDoesNotExist({ uuAppErrorMap }, { awid })
        }

        if (uuJokeMain.state !== 'active') {
            throw new Errors.Get.JokeIsNotInCorrectState({ uuAppErrorMap }, expectedStateList)
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
            ...joke
        }
    }
}



module.exports = new JokeAbl();
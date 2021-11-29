"use strict";

const JokesMainUseCaseError = require("./jokes-main-use-case-error.js");
const JOKE_CMD_ERROR_PREFIX = `${JokesMainUseCaseError.ERROR_PREFIX}jokeCmd/`;

const JokeCmd = {
  UC_CODE: `${JOKE_CMD_ERROR_PREFIX}jokeCmd/`,

  JokeIsNotInCorrectState: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "State of joke in not correct.";
    }
  },

  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  JokeDoesNotExist: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "Joke does not exist";
    }
  },
  JokesCreateDaoFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}jokesCreateDaoFailed`;
      this.message = "Failed while creating new joke";
    }
  },
};

module.exports = {
  JokeCmd,
};

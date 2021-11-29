"use strict";

const JokesMainUseCaseError = require("./jokes-main-use-case-error.js");
const JOKE_DELETE_ERROR_PREFIX = `${JokesMainUseCaseError.ERROR_PREFIX}jokeDelete/`;

const Delete = {
  UC_CODE: `${JOKE_DELETE_ERROR_PREFIX}delete/`,
  InvalidDtoIn: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  JokeDoesNotExist: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "jokes does not exist";
    }
  },

  JokeIsNotInCorrectState: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "Joke is not in correct state.";
    }
  },

  CreateJokeDaoFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}createJokeFailed`;
      this.message = "While creating joke smth went wrong... .";
    }
  },
};

module.exports = {
  Delete
};

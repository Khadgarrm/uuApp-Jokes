"use strict";
const JokesMainUseCaseError = require("./jokes-main-use-case-error.js");
const JOKE_ERROR_PREFIX = `${JokesMainUseCaseError.ERROR_PREFIX}joke/`;
const Create = {
  UC_CODE: `${JOKE_ERROR_PREFIX}create/`,

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

const Get = {
  UC_CODE: `${JOKE_ERROR_PREFIX}get/`,

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
};

module.exports = {
  Create,
  Get,
};

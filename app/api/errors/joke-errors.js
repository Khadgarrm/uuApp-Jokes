"use strict";
const JokesMainUseCaseError = require("./jokes-main-use-case-error.js");
const JOKE_ERROR_PREFIX = `${JokesMainUseCaseError.ERROR_PREFIX}joke/`;
const { UseCaseError } = require("uu_appg01_server").AppServer;

class UuJokesError extends UseCaseError {
  static get ERROR_PREFIX() {
    return "uu-jokes-main/";
  }

  constructor(dtoOut, paramMap = {}, cause = null) {
    if (paramMap instanceof Error) {
      cause = paramMap;
      paramMap = {};
    }

    super({ dtoOut, paramMap, status: 400 }, cause);
  }
}

module.exports = UuJokesError;

const GetImageData = {
  UC_CODE: `${UuJokesError.JOKE_ERROR_PREFIX}getImageData/`,

  InvalidDtoIn: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${GetImageData.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  JokeImageDoesNotExist: class extends UuJokesError {
    constructor() {
      super(...arguments);
      this.code = `${GetImageData.UC_CODE}jokeImageDoesNotExist`;
      this.message = "Object jokeImage does not exist.";
    }
  }
};



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
  JokeImageDaoCreateFailed: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}createJokeImageFailed`;
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
  UnsuportedKey: class extends JokesMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}unsuportedKey`;
      this.message = "Unsuported key";
    }
  },
};

module.exports = {
  Create,
  Get,
  GetImageData,
};

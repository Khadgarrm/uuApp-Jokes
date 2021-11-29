"use strict";
const JokeAbl = require("../../abl/joke-abl.js");

class JokeController {
    create(ucEnv) {
        return JokeAbl.create(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
    }

    get(ucEnv) {
        return JokeAbl.get(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
    }
}

module.exports = new JokeController();

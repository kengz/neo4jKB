// dependencies
var env = require('node-env-file');

// set env vars for tests
// process.env.NODE_ENV = 'development'

// set env if not already set externally
// .env must exist if setting env vars externally
try {
  env(__dirname + '/../.env', {
    overwrite: false
  });
} catch (e) {
  console.log(e)
  console.log("Process exiting with code 1.")
  process.exit(1)
}

// dependencies
global._ = require('lomath')
global.Promise = require('bluebird');
// chai assertation library
global.chai = require('chai')
global.chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)
global.should = chai.should()

// import assets and test subject
global.A = require('./asset')
global.KB = A.KB

// console.log(_.functions(KB))
// dependencies
var env = require('node-env-file');

// set env vars for tests
process.env.NODE_ENV = 'development'

// set env if not already set externally
// .env must exist if setting env vars externally
try {
  env(__dirname + '/../.env', {
    overwrite: false
  });
} catch (e) {
  console.log(e)
  console.log("Using externally set env vars if exist.")
}

// dependencies
global._ = require('lomath')
global.Promise = require('bluebird');
// chai assertation library
global.chai = require('chai')
global.chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)
global.should = chai.should();
// generator-based yield flow control
global.co = require('co')


// import assets and test subject
global.A = require('./asset')
global.KB = A.KB

// console.log(_.functions(KB))

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
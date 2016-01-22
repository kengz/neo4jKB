// dependencies
var _ = require('lomath')
var Promise = require('bluebird');
// chai assertation library
var chai = require('chai')
var chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)
var should = chai.should()

// import assets and test subject
var A = require('./asset')
var KB = A.KB

suite('query', function() {
  before(function(done) {
    A.buildGraph().then(done)
  })

  test('(query)', function() {
    return KB.query('MATCH (a:test) RETURN a.name').then(KB.beautify).then(KB.string).should.eventually.equal('[{"columns":["a.name"],"data":[[1],[2],[3],["A"],["B"],["C"],["D"],["Z"]]}]')
  })

  test('(query, param)', function() {
    return KB.query('MATCH (a:test {name: {propA}.name}) RETURN a.name', {
      propA: A.propA
    }).then(KB.beautify).then(KB.string).should.eventually.equal('[{"columns":["a.name"],"data":[["A"]]}]')
  })

})

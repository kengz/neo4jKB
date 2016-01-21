// chai assertation library
var chai = require('chai');
var should = chai.should();
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

// import assets
var A = require('./asset')
var _ = require('lomath')
  // import test subject

var KB = require('../index')({
  NEO4J_AUTH: 'neo4j:0000'
})


// tests
// console.log(_.functions(KB))

// KB.query('MATCH (n:alpha) RETURN (n)')
//   .then(KB.log)
//   .catch(function(err) {
//     KB.log('error:', err)
//   })


// KB.getNode(prop2).then(_.flow(JSON.stringify, console.log))
// KB.getNode('alpha').then(_.flow(JSON.stringify, console.log))
// 
suite('query', function() {
  before(function() {
    KB.query('MATCH (a:test) DETACH DELETE a')
      // addNode(propA, 'alpha').then(_.flow(JSON.stringify, console.log))
    KB.addNode(A.propA, 'test')
    // add a network used to test all shits
  })
  test('(query)', function() {
    KB.query('MATCH (a:alpha) RETURN (a)').should.eventually.equal('[{"columns":["n"],"data":[]}]')
  })

  test('(query, param)', function() {
    KB.query('CREATE (a:alpha {propA}) RETURN (a)').should.eventually.equal('[{"columns":["n"],"data":[]}]')
  })
})


// query(
// ['CREATE (n:Alphabet {prop}) RETURN n', 
// {
//  prop: [{ name: 'a', num: 1}, { name: 'b', num: 2 }]
// }]
// ).then(_.flow(JSON.stringify, console.log))

// query(
// [
// ['CREATE (n:Alphabet {prop}) RETURN n', 
// {
//  prop: [{ name: 'a', num: 1}, { name: 'b', num: 2 }]
// }]
// ]
// ).then(_.flow(JSON.stringify, console.log))

// query(
// ['CREATE (n:Alphabet {prop}) RETURN n', 
// {
//  prop: [{ name: 'c', num: 3}, { name: 'd', num: 4 }]
// }],
// ["MATCH (c),(d) WHERE c.name='c' AND d.name='d' CREATE UNIQUE (c)-[r:Next]->(d) RETURN r"]
// ).then(_.flow(JSON.stringify, console.log))

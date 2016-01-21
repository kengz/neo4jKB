module.exports = require('./lib/neo4jKB')

var _ = require('lomath')
var neo4jKB = require('./lib/neo4jKB')({NEO4J_AUTH: 'neo4j:0000'})


// tests
// console.log(neo4jKB)
// console.log(_.functions(neo4jKB))
// neo4jKB.meh()
// 
// prop2 = {
//   name: 'A',
//   hash_by: 'name'
// }
// neo4jKB.getNode(prop2).then(_.flow(JSON.stringify, console.log))
// neo4jKB.getNode('alpha').then(_.flow(JSON.stringify, console.log))
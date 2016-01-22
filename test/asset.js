var _ = require('lomath')
var Promise = require('bluebird');

var cons = require('../lib/constrain')
// Assets used in unit tests

// construct a graph for testing, must have: 
// path > 3 units
// >1 degree
// cycle
// multiedge

// A -> {1,2,3}
// 1 -> 2 -> 3 -> 1
// A -> B -> C -> D -> Z
// D -[:test_next_2]-> Z

var A = {
  KB: require('../index')({ NEO4J_AUTH: 'neo4j:0000' }),
  labelNode: 'test',
  propA: cons.legalize({ name: 'A', hash_by: 'name' }),
  propB: cons.legalize({ name: 'B', hash_by: 'name' }),
  propC: cons.legalize({ name: 'C', hash_by: 'name' }),
  propD: cons.legalize({ name: 'D', hash_by: 'name' }),
  propZ: cons.legalize({ name: 'Z', hash_by: 'name' }),
  prop1: cons.legalize({ name: 1, hash_by: 'name' }),
  prop2: cons.legalize({ name: 2, hash_by: 'name' }),
  prop3: cons.legalize({ name: 3, hash_by: 'name' }),
  labelEdge: 'test_next',
  labelEdge2: 'test_next_2',
  propE: cons.legalize({ name: 'E', hash_by: 'name' }),

  flush: flush,
  clearTest: clearTest,
  buildGraph: buildGraph
}

// helper function to flush the resolved args from buildGrapg
function flush() {
  return 
}

// clear out the test nodes
function clearTest() {
  return new Promise(function(resolve, reject) {
    A.KB.query('MATCH (a:test) DETACH DELETE a')
      .then(flush)
      .then(resolve)
      .catch(reject)
  })
}

// build the graph: first clear the test, then buildNodes, buildEdges
function buildGraph() {
  return new Promise(function(resolve, reject) {
    clearTest()
    .then(buildNodes)
    .then(buildEdges)
    // .then(A.KB.log)
    .then(flush)
    .then(resolve)
    .catch(reject)
  })
}

// build the nodes
function buildNodes() {
  return new Promise(function(resolve, reject) {
    A.KB.addNode(
      [[A.propA, A.labelNode]],
      [[A.propB, A.labelNode]],
      [[A.propC, A.labelNode]],
      [[A.propD, A.labelNode]],
      [[A.propZ, A.labelNode]],
      [[A.prop1, A.labelNode]],
      [[A.prop2, A.labelNode]],
      [[A.prop3, A.labelNode]]
      )
      // .then(A.KB.log)
      .then(resolve)
      .catch(reject)
  })
}

// build the edges
function buildEdges() {
  return new Promise(function(resolve, reject) {
    A.KB.addEdge(
      // A -> {1,2,3}
      [[A.propE, A.labelEdge], [A.propA], [A.prop1]],
      [[A.propE, A.labelEdge], [A.propA], [A.prop2]],
      [[A.propE, A.labelEdge], [A.propA], [A.prop3]],
      // 1 -> 2 -> 3 -> 1
      [[A.propE, A.labelEdge], [A.prop1], [A.prop2]],
      [[A.propE, A.labelEdge], [A.prop2], [A.prop3]],
      [[A.propE, A.labelEdge], [A.prop3], [A.prop1]],
      // A -> B -> C -> D -> Z
      [[A.propE, A.labelEdge], [A.propA], [A.propB]],
      [[A.propE, A.labelEdge], [A.propB], [A.propC]],
      [[A.propE, A.labelEdge], [A.propC], [A.propD]],
      [[A.propE, A.labelEdge], [A.propD], [A.propZ]],
      // D -[:test_next_2]-> Z
      [[A.propE, A.labelEdge2], [A.propD], [A.propZ]]
      )
      // .then(A.KB.log)
      .then(resolve)
      .catch(reject)
  })
}


module.exports = A;

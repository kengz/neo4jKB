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

var labelNode = 'test',
propA = cons.legalize({ name: 'A', hash_by: 'name' }),
propB = cons.legalize({ name: 'B', hash_by: 'name' }),
propC = cons.legalize({ name: 'C', hash_by: 'name' }),
propD = cons.legalize({ name: 'D', hash_by: 'name' }),
propZ = cons.legalize({ name: 'Z', hash_by: 'name' }),
prop1 = cons.legalize({ name: 1, hash_by: 'name' }),
prop2 = cons.legalize({ name: 2, hash_by: 'name' }),
prop3 = cons.legalize({ name: 3, hash_by: 'name' }),
propAl = cons.legalize({ name: 'A' }, 'name')
propAi = { name: 'A' },
propBi = { name: 'B' },
propCi = { name: 'C' },
propDi = { name: 'D' },
propZi = { name: 'Z' },
prop1i = { name: 1 },
prop2i = { name: 2 },
prop3i = { name: 3 },
labelEdge = 'test_next',
labelEdge2 = 'test_next_2',
propE = cons.legalize({ name: 'E', hash_by: 'name' }),
propE2 = cons.legalize({ name: 'E2', hash_by: 'name' }),
propEi = { name: 'E' },
propE2i = { name: 'E2' };
distE = '*..2'


var NEO4J_AUTH = process.env.NEO4J_AUTH || 'neo4j:0000'
var A = {
  KB: require('../index')({ NEO4J_AUTH: NEO4J_AUTH }),
  labelNode: labelNode,
  propAl: propAl,
  propA: propA,
  propB: propB,
  propC: propC,
  propD: propD,
  propZ: propZ,
  prop1: prop1,
  prop2: prop2,
  prop3: prop3,
  propLabelA: [propA, labelNode],
  propLabelAl: [propAl, labelNode],
  propLabelB: [propB, labelNode],
  propLabelC: [propC, labelNode],
  propLabelD: [propD, labelNode],
  propLabelZ: [propZ, labelNode],
  propLabel1: [prop1, labelNode],
  propLabel2: [prop2, labelNode],
  propLabel3: [prop3, labelNode],
  propLabelAi: [propAi, labelNode],
  propLabelBi: [propBi, labelNode],
  propLabelCi: [propCi, labelNode],
  propLabelDi: [propDi, labelNode],
  propLabelZi: [propZi, labelNode],
  propLabel1i: [prop1i, labelNode],
  propLabel2i: [prop2i, labelNode],
  propLabel3i: [prop3i, labelNode],

  labelEdge: labelEdge,
  labelEdge2: labelEdge2,
  propE: propE,
  propE2: propE2,
  propLabelE: [propE, labelEdge],
  propLabelE2: [propE2, labelEdge2],
  propLabelEi: [propEi, labelEdge],
  propLabelE2i: [propE2i, labelEdge2],
  distLabelE: [distE, labelEdge],

  flush: flush,
  clearTest: clearTest,
  buildGraph: buildGraph,
  log: log,
  string: string,
  extractRes: extractRes,
  extractQP: extractQP
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
    // .then(A.log)
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
      // .then(A.log)
      .then(resolve)
      .catch(reject)
  })
}

// build the edges
function buildEdges() {
  return new Promise(function(resolve, reject) {
    A.KB.addEdge(
      // A -> {1,2,3}
      [[A.propA], [A.propE, A.labelEdge], [A.prop1]],
      [[A.propA], [A.propE, A.labelEdge], [A.prop2]],
      [[A.propA], [A.propE, A.labelEdge], [A.prop3]],
      // 1 -> 2 -> 3 -> 1
      [[A.prop1], [A.propE, A.labelEdge], [A.prop2]],
      [[A.prop2], [A.propE, A.labelEdge], [A.prop3]],
      [[A.prop3], [A.propE, A.labelEdge], [A.prop1]],
      // A -> B -> C -> D -> Z
      [[A.propA], [A.propE, A.labelEdge], [A.propB]],
      [[A.propB], [A.propE, A.labelEdge], [A.propC]],
      [[A.propC], [A.propE, A.labelEdge], [A.propD]],
      [[A.propD], [A.propE, A.labelEdge], [A.propZ]],
      // D -[:test_next_2]-> Z
      [[A.propD], [A.propE2, A.labelEdge2], [A.propZ]]
      )
      // .then(A.log)
      .then(resolve)
      .catch(reject)
  })
}


// Simple log for the first argument after JSON.stringify it. Returns the string.
function log(arg) {
  var str = JSON.stringify(arg)
  console.log(str)
  return str;
}

// Shorthand to JSON.stringify the argument. Use in place of log to not log to output.
function string(arg) {
  return JSON.stringify(arg)
}

// extract neoRes.
function extractRes(neoRes) {
  return _.map(neoRes, extractOneRes)
}
// extract a single neoRes object.
function extractOneRes(obj) {
  // use assign
  var data = obj.data;
  var extract = _.map(data, function(o) {
    return _.map(_.flattenDeep(_.get(o, 'row')), function(row){
      return _.get(row, 'name') || row
    })
  })
  var sorted = extract.sort()
  _.assign(obj, {
    data: sorted
  })
  return obj
}

// extract a query-param pair
function extractQP(arr) {
  var query = arr[0], param = arr[1]
  param = _.mapValues(param, function(prop) {
    return _.omit(prop, ['updated_when', 'created_when'])
  })
  return [query, param]
}

module.exports = A;

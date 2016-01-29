// dependencies
var _ = require('lomath')
var Promise = require('bluebird')
var cons = require('./constrain')
var parse = require('./parse')

/**
 * This is the exported wrapper function: init the necessary params, then return the KB methods. The fields are set to neo4j defaults if not supplied.
 * @private
 * @param  {JSON} options An optional JSON with the fields {NEO4J_AUTH='neo4j:neo4j', NEO4J_HOST='localhost', NEO4J_PORT-'7474'} containing username:password, the host address, and port number for neo4j
 * @return {Function}            The KB functions.
 */
/* istanbul ignore next */
function Neo4jKB(options) {
  options = options || {};
  if (!_.has(options, 'NEO4J_AUTH')) {
    throw new Error("You must at least supply a NEO4J_AUTH: '<username>:<password>' JSON argument.")
  };
  this.options = options;
  // setting the exportable functions
  this.query = require('./query')(options)

  // the KB builders
  this.addNode = addNode
  this.getNode = getNode
  this.addEdge = addEdge
  this.getEdge = getEdge
  this.pull = pull
  this.get = get
  this.push = push
  this.add = add

  // KB constraint
  this.cons = cons

  // the data parsers
  this.log = parse.log
  this.beautify = parse.beautify
  this.transform = parse.transform
  this.parseUser = parse.parseUser

  return this
}

module.exports = Neo4jKB




/////////////
// Helpers //
/////////////


/**
 * Parses prop JSON into a 'literal map' string as required by neo4j error (unable to user parameter map in MATCH).
 * @private
 * @param  {JSON} [prop] Object to parse.
 * @param  {string} [prop] Optional name for prop to use.
 * @return {string}      The result literal map string. Empty string is prop is falsy.
 *
 * @example
 * var prop = {name: 'A', hash_by: 'name'}
 * literalizeProp(prop)
 * // => {name: {prop}.name, hash_by: {prop}.hash_by, hash: {prop}.hash}
 * 
 * literalizeProp(prop, 'propA')
 * // => {name: {propA}.name, hash_by: {propA}.hash_by, hash: {propA}.hash}
 * 
 */
/* istanbul ignore next */
function literalizeProp(prop, propName) {
  if (!prop) {
    return ''
  };
  propName = propName || 'prop'
  var litArr = _.map(prop, function(v, k) {
    return k + ': {' + propName + '}.' + k
  })
  return ' {' + litArr.join(', ') + '}'
}

/**
 * Sort the array of prop-Label pair given with (propLabel), or ([propLabel]), where each is optional, into [[prop], [Label]]. Prop can also be a Dist string (startsWith '*') for edge.
 * @private
 * @param  {Array} propLabel Together in an array. Either is optional.
 * @return {Array}           Of sorted [[prop], [Label]], either can be empty.
 */
/* istanbul ignore next */
function sortPropLabel(propLabel) {
  return _.partition(_.flatten(arguments), function(arg) {
    // catch prop JSON, or *Dist string for edge
    return _.isPlainObject(arg) || _.startsWith(arg, '*')
  })
}

/**
 * Takes a parsed query-param pair Array, scan for '[e:l1:l2...]', split into a copy of the same pair for each label, with that label only.
 * @private
 * @param  {Array} qpPair query-param pair array, parsed for query.
 * @param  {Boolean} relaxELabel=false A boolean to relax the contraint where E must be labeled. Pass true to relax.
 * @return {Array}        Array of qpPair(s).
 *
 * @example
 * var propA = {name: 'A', hash_by: 'name'}
 * var propB = {name: 'B', hash_by: 'name'}
 * var labelA = 'alpha'
 * var labelB = 'alpha'
 * 
 * var propE = {name: 'lexicography', hash_by: 'name'}
 * KB.cons.legalize(propE)
 * var labelE = ['next', 'after']
 *
 * var qpPair = pushEdge([propA, labelA], [propE, labelE], [propB, labelB]);
 * console.log(splitLabelE(qpPair))
 * // [ 
 * // [ 'MATCH (a:alpha {name: {propA}.name, hash_by: {propA}.hash_by}), (b:alpha {name: {propB}.name, hash_by: {propB}.hash_by}) MERGE (a)-[e:next {hash: {propE}.hash}]->(b) ON CREATE SET e = {propE}, e.created_by={propE}.updated_by, e.created_when={propE}.updated_when ON MATCH SET e += {propE} RETURN e', { propA: [Object], propB: [Object], propE: [Object] } ],
 * // [ 'MATCH (a:alpha {name: {propA}.name, hash_by: {propA}.hash_by}), (b:alpha {name: {propB}.name, hash_by: {propB}.hash_by}) MERGE (a)-[e:after {hash: {propE}.hash}]->(b) ON CREATE SET e = {propE}, e.created_by={propE}.updated_by, e.created_when={propE}.updated_when ON MATCH SET e += {propE} RETURN e', { propA: [Object], propB: [Object], propE: [Object] } ] 
 * // ]
 * 
 */
/* istanbul ignore next */
function splitLabelE(qpPair) {
  var query = _.get(qpPair, 0),
    param = _.get(qpPair, 1)
  var relaxELabel = false;
  // ensure the query is MATCH without MERGE
  if (query.match(/^\s*MATCH\s+/i) && !query.match(/\s*MERGE\s+/i)) {
    relaxELabel = true;
  };
  var matchELabel = query.match(/(?:\[e)(\:\S+)(\s+)/);
  // if no ELabel
  if (!matchELabel) {
    // if is relaxed, can be empty
    if (relaxELabel) {
      return [qpPair]
    } else {
      // check if the query is adding edge or node
      var addingEdge = query.match(/(\[e)/);
      if (addingEdge) {
        throw new Error("Edges (relationships) must have label(s).")
      } else {
        return [qpPair]
      }
    }
  };

  // the extracted LabelStr, then split into array
  var LabelStr = matchELabel[1]
  var labelArr = _.trim(LabelStr, ':').split(':');
  if (relaxELabel) {
    // if relaxed, combine existing labels with :label0|label1|...
    var orLabelStr = labelArr.join('|')
    var singleLabelQuery = query.replace(/(\[e)(\:\S+)(\s+)/, '$1' + KB.cons.stringifyLabel(orLabelStr))
    return [
      [singleLabelQuery, param]
    ]
  } else {
    // the splitted result: same qpPair for each labelE
    return _.map(labelArr, function(LabelStr) {
      var singleLabelQuery = query.replace(/(\[e)(\:\S+)(\s+)/, '$1' + KB.cons.stringifyLabel(LabelStr))
      return [singleLabelQuery, param]
    })
  }

}

// the first arg is an array, containing a (JSON || string) || (string || Arr of string) === JSON || string || Arr of string
/**
 * Check if an entity (inside an array) resides within a propDistLabel array. Check if it's JSON prop || string Dist || string Label || Array of >1 string labels
 * @private
 * @param  {*}  entity Inside a propDistLabel array
 * @return {Boolean}        true if entity is inside propDistLabel
 */
/* istanbul ignore next */
function isOfPropDistLabel(entity) {
  return _.isPlainObject(entity) || _.isString(entity) || (_.isArray(entity) && _.size(entity) > 1 && _.isString(entity[0]))
}
// console.log(isOfPropDistLabel({name: 'A'}))
// console.log(isOfPropDistLabel('*0..1'))
// console.log(isOfPropDistLabel('label'))
// console.log(isOfPropDistLabel(['label0', 'label1']))

/**
 * Check if an array is propDistLabel. Calls isOfPropDistLabel internally.
 * @private
 * @param  {Array}  array 
 * @return {Boolean}       true if so.
 */
/* istanbul ignore next */
function isPropDistLabel(array) {
  return _.prod(_.map(array, isOfPropDistLabel))
}
// console.log(isPropDistLabel([{name: 'A'}]))
// console.log(isPropDistLabel([{name: 'A'}, 'label']))
// console.log(isPropDistLabel([{name: 'A'}, ['label0', 'label1']]))
// console.log(isPropDistLabel(['*0..1', 'label']))
// console.log(isPropDistLabel(['label']))
// console.log(isPropDistLabel([['label0', 'label1']]))

/**
 * Returns the tensor rank of an argument array from the batchQuery arg tail.
 * @private
 * @param  {Array} tailArr The array of argument at the tail of arg of batchQuery.
 * @return {integer}         The rank, starting from 1.
 */
/* istanbul ignore next */
function getRank(tailArr) {
  if (isPropDistLabel(tailArr)) {
    return 0;
  } else {
    return 1 + getRank(_.first(tailArr));
  }
}
/**
 * Flatten an array to rank n. Basically flatten it for (getRank - n) times. If the original rank is lower, just return the array.
 * @private
 * @param  {Array} arr The array to flatten to rank n.
 * @param  {integer} n   Target rank to flatten to.
 * @return {Array}     The flattened (or not) array.
 */
/* istanbul ignore next */
function flattenToRank(arr, n) {
  var rankDiff = getRank(arr) - n
  if (rankDiff < 0) {
    return arr
  };
  while (rankDiff--) {
    arr = _.flatten(arr)
  }
  return arr
}
// var arr = [[[[{name: 'a'}]]]]
// console.log(flattenToRank(arr,  2))

//////////////////
// Node methods //
//////////////////


/**
 * Adds node(s) to neo4j with a required JSON prop satisfying the KB constraints, and an optional Label string or array.
 * @param  {*}  single_query, As (fn, \*, \*, ...), e.g. (fn, propLabel)
 * @param  {*}  multi_queries As (fn, [\*], [\*], [\*]...), e.g. (fn, [propLabel0], [propLabel1], ...)
 * @param  {*}  multi_queries_one_array As (fn, [[\*], [\*], [\*]...]), e.g. (fn, [[propLabel0], [propLabel1], ...])
 * @return {Promise}          From the query.
 *
 * @example
 * var propA = {name: 'A', hash_by: 'name'}
 * var propB = {name: 'B', hash_by: 'name'}
 * // legalize the prop objects subject to constraints
 * KB.cons.legalize(propA)
 * KB.cons.legalize(propB)

 * addNode(propA, 'alpha').then(KB.log)
 * // {"results":[{"columns":["u"],"data":[{"row":[{"created_when":1452801392345,"updated_by":"tester","name":"A","hash_by":"name","created_by":"tester","hash":"A","updated_when":1452802417919}]}]}],"errors":[]}
 * // The node is added/updated to KB.
 *
 * // batch node query by array of pairs
 * addNode([propA, 'alpha'], [propB, 'alpha']).then(KB.log)
 * 
 * // equivalently
 * addNode([[propA, 'alpha'], [propB, 'alpha']]).then(KB.log)
 * // {"results":[{"columns":["u"],"data":[{"row":[{"created_when":1452801392345,"updated_by":"tester","name":"A","hash_by":"name","created_by":"tester","hash":"A","updated_when":1452803465461}]}]},{"columns":["u"],"data":[{"row":[{"created_when":1452803465462,"name":"B","updated_by":"tester","hash_by":"name","created_by":"tester","hash":"B","updated_when":1452803465462}]}]}],"errors":[]}
 * // propA node is updated; propB node is added.
 * 
 */
var addNode = _.partial(batchQuery, push)


// var propA = {
//   name: 'A',
//   hash_by: 'name'
// }
// var propB = {
//   name: 'B',
//   hash_by: 'name'
// }
// KB.cons.legalize(propA)
// KB.cons.legalize(propB)
// console.log(pushNode(propA, 'alpha'))
// // addNode(propA, 'alpha').then(KB.log);
// // addNode([propA, 'alpha']).then(KB.log)
// // XXXXXaddNode([propA, 'alpha'], [propB, 'alpha']).then(KB.log)
// addNode([[[propA, 'alpha']], [[propB, 'alpha']]]).then(KB.log)


/**
 * Get node(s) from neo4j with JSON prop, and optional Label.
 * @param  {*}  single_query, As (fn, \*, \*, ...), e.g. (fn, propLabel)
 * @param  {*}  multi_queries As (fn, [\*], [\*], [\*]...), e.g. (fn, [propLabel0], [propLabel1], ...)
 * @param  {*}  multi_queries_one_array As (fn, [[\*], [\*], [\*]...]), e.g. (fn, [[propLabel0], [propLabel1], ...])
 * @return {Promise}          From the query.
 *
 * @example
 * var prop2 = {name: 'A', hash_by: 'name'}
 * var prop3 = {name: 'B', hash_by: 'name'}
 * // no constrain needed when getting node from KB
 *
 * get nodes from just the prop
 * getNode(prop2).then(KB.log)
 * // {"results":[{"columns":["u"],"data":[{"row":[{"created_when":1452807183847,"updated_by":"bot","name":"A","hash_by":"name","created_by":"tester","hash":"A","updated_when":1453244315302}]}]}],"errors":[]}
 *
 * get nodes from just the label
 * getNode('alpha').then(KB.log)
 * // {"results":[{"columns":["u"],"data":[{"row":[{"created_when":1452807183847,"updated_by":"bot","name":"A","hash_by":"name","created_by":"tester","hash":"A","updated_when":1453244315302}]},{"row":[{"created_when":1452807183848,"updated_by":"bot","name":"B","hash_by":"name","created_by":"tester","hash":"B","updated_when":1453244315304}]},{"row":[{"created_when":1453143013572,"updated_by":"bot","name":"C","hash_by":"name","created_by":"bot","hash":"C","updated_when":1453143013572}]}]}],"errors":[]}
 * 
 * // get nodes from a propLabel pair
 * getNode(prop2, 'alpha').then(KB.log)
 * // {"results":[{"columns":["u"],"data":[{"row":[{"created_when":1452801392345,"updated_by":"tester","name":"A","hash_by":"name","created_by":"tester","hash":"A","updated_when":1452803465461}]}]}],"errors":[]}
 *
 * // get nodes from many propLabel pairs
 * getNode([prop2, 'alpha'], [prop3, 'alpha']).then(KB.log)
 * // equivalently
 * getNode([[prop2, 'alpha'], [prop3, 'alpha']]).then(KB.log)
 * // {"results":[{"columns":["u"],"data":[{"row":[{"created_when":1452801392345,"updated_by":"tester","name":"A","hash_by":"name","created_by":"tester","hash":"A","updated_when":1452803465461}]}]},{"columns":["u"],"data":[{"row":[{"created_when":1452803465462,"updated_by":"tester","name":"B","hash_by":"name","created_by":"tester","hash":"B","updated_when":1452803465462}]}]}],"errors":[]}
 * 
 */
var getNode = _.partial(batchQuery, pull)


// prop2 = {
//   name: 'A',
//   hash_by: 'name'
// }
// prop3 = {
//   name: 'B',
//   hash_by: 'name'
// }
// getNode(prop2).then(KB.log)
// getNode('alpha').then(KB.log)
// getNode(prop2, 'alpha').then(KB.log)
// getNode([prop2, 'alpha'], [prop3, 'alpha']).then(KB.log)
// getNode([[prop2, 'alpha'], [prop3, 'alpha']]).then(KB.log)



//////////////////
// Edge methods //
//////////////////

/**
 * Adds edge(s) to neo4j with propLabel of nodes A -> B with the edge E. The propLabel for A and B is an array of a optional non-empty JSON prop (doesn't have to satisfy KB constraints), and an optional Label string or array. The prop for E must satisfy the KB constraints, and the Label for E is required.
 * @param  {*}  single_query, As (fn, \*, \*, ...), e.g. (fn, propLabelA, propLabelE, propLabelB)
 * @param  {*}  multi_queries As (fn, [\*], [\*], [\*]...), e.g. (fn, [propLabelA0, propLabelE0, propLabelB0], [propLabelA1, propLabelE1, propLabelB1], ...)
 * @param  {*}  multi_queries_one_array As (fn, [[\*], [\*], [\*]...]), e.g. (fn, [[propLabelA0, propLabelE0, propLabelB0], [propLabelA1, propLabelE1, propLabelB1], ...])
 * @return {Promise}          From the query.
 *
 * @example
 * var propE = {name: 'lexicography', hash_by: 'name'}
 * KB.cons.legalize(propE)
 * var labelE = 'next'
 * var labelE2 = 'after'
 * var labelEArr = ['next', 'after']
 * 
 * var propA = {name: 'A', hash_by: 'name'}
 * var propB = {name: 'B', hash_by: 'name'}
 * var labelA = 'alpha'
 * var labelB = 'alpha'
 *
 * // add edge E from node A to node B
 * addEdge([propA, labelA], [propE, labelE], [propB, labelB]).then(KB.log)
 * // {"results":[{"columns":["e"],"data":[{"row":[{"created_when":1452825908415,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"tester","hash":"lexicography","updated_when":1452884323471}]}]},{"columns":["e"],"data":[{"row":[{"created_when":1452884323471,"name":"lexicography","updated_by":"bot","hash_by":"name","created_by":"bot","hash":"lexicography","updated_when":1452884323471}]}]}],"errors":[]}
 * // The edge labeled 'next' is added/updated to KB.
 *
 * Constraints only for propE, required Label for edge E. No constraints or requirements for nodes A and B.
// addEdge([propE, labelE], [labelA], [propB, labelB]).then(KB.log)
 * // {"results":[{"columns":["e"],"data":[{"row":[{"created_when":1452825908415,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"tester","hash":"lexicography","updated_when":1453259876938}]},{"row":[{"created_when":1453259876938,"name":"lexicography","updated_by":"bot","hash_by":"name","created_by":"bot","hash":"lexicography","updated_when":1453259876938}]},{"row":[{"created_when":1453259876938,"name":"lexicography","updated_by":"bot","hash_by":"name","created_by":"bot","hash":"lexicography","updated_when":1453259876938}]}]}],"errors":[]}
 * 
 * // batch edge query by array of pairs
 * addEdge(
 * [ [propA, labelA], [propE, labelE], [propB, labelB] ], 
 * [ [propA, labelA], [propE, labelE2], [propB, labelB] ]
 * ).then(KB.log)
 * 
 * // equivalently
 * addEdge([
 * [ [propA, labelA], [propE, labelE], [propB, labelB] ], 
 * [ [propA, labelA], [propE, labelE2], [propB, labelB] ]
 * ]).then(KB.log)
 * // {"results":[{"columns":["e"],"data":[{"row":[{"created_when":1452825908415,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"tester","hash":"lexicography","updated_when":1452884568091}]}]},{"columns":["e"],"data":[{"row":[{"created_when":1452884323471,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"bot","hash":"lexicography","updated_when":1452884568091}]}]}],"errors":[]}
 * // edge 'next' is updated, edge 'after' is added
 *
 * shorthand for edge with multiple labels but same prop
 * addEdge([propA, labelA], [propE, labelEArr], [propB, labelB]).then(KB.log)
 * // {"results":[{"columns":["e"],"data":[{"row":[{"created_when":1452825908415,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"tester","hash":"lexicography","updated_when":1452884620930}]}]},{"columns":["e"],"data":[{"row":[{"created_when":1452884323471,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"bot","hash":"lexicography","updated_when":1452884620930}]}]}],"errors":[]}
 * 
 */
var addEdge = _.partial(batchQuery, push)


// var propE = {name: 'lexicography', hash_by: 'name'}
// KB.cons.legalize(propE)
// var labelE = 'next'
// var labelE2 = 'after'
// var labelEArr = ['next', 'after']

// var propA = {name: 'A', hash_by: 'name'}
// var propB = {name: 'B', hash_by: 'name'}
// var labelA = 'alpha'
// var labelB = 'alpha'

// console.log(splitLabelE(pushEdge([propA, labelA], [propE, labelE], [propB, labelB])))

// addEdge([propA, labelA], [propE, labelEArr], [propB, labelB]).then(KB.log)
// addEdge([propE, labelE], [labelA], [propB, labelB]).then(KB.log)

// addEdge(
// [ [propA, labelA], [propE, labelE], [propB, labelB] ], 
// [ [propA, labelA], [propE, labelE2], [propB, labelB] ]
// ).then(KB.log)

// addEdge([
// [ [propA, labelA], [propE, labelE], [propB, labelB] ], 
// [ [propA, labelA], [propE, labelE2], [propB, labelB] ]
// ]).then(KB.log)

// addEdge([propA, labelA], [propE, labelEArr], [propB, labelB]).then(KB.log)



/**
 * Get edge(s) from neo4j with propLabel of nodes A -> B with the edge E. The propLabel for A, B and E is an array of a optional non-empty JSON prop (doesn't have to satisfy KB constraints), and a (optional for A,B; required for E) Label string or array.
 * @param  {*}  single_query, As (fn, \*, \*, ...), e.g. (fn, propLabelA, propLabelE, propLabelB)
 * @param  {*}  multi_queries As (fn, [\*], [\*], [\*]...), e.g. (fn, [propLabelA0, propLabelE0, propLabelB0], [propLabelA1, propLabelE1, propLabelB1], ...)
 * @param  {*}  multi_queries_one_array As (fn, [[\*], [\*], [\*]...]), e.g. (fn, [[propLabelA0, propLabelE0, propLabelB0], [propLabelA1, propLabelE1, propLabelB1], ...])
 * @return {Promise}          From the query.
 *
 * @example
 * var propE = {name: 'lexicography', hash_by: 'name'}
 * var labelE = 'next'
 * var labelE2 = 'after'
 * var labelEArr = ['next', 'after']
 * 
 * var propA = {name: 'A', hash_by: 'name'}
 * var propB = {name: 'B', hash_by: 'name'}
 * var labelA = 'alpha'
 * var labelB = 'alpha'
 *
 * // The below are equivalent for the added edge above, and show that propLabelA and propLabelB are optional.
 * getEdge(
 *  [propE, labelE]
 *  ).then(KB.log)
 * 
 * getEdge(
 *  [propE, labelE],
 *  [propA, labelA]
 *  ).then(KB.log)
 *
 * // label is required for E; The rest are optional.
 * getEdge(
 *  [labelE],
 *  [propA]
 *  ).then(KB.log)
 * // {"results":[{"columns":["e"],"data":[{"row":[{"created_when":1453143189686,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"bot","hash":"lexicography","updated_when":1453143189686}]},{"row":[{"created_when":1452825908415,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"tester","hash":"lexicography","updated_when":1453259876938}]}]}],"errors":[]}
 * 
 * getEdge(
 *  [propE, labelE],
 *  [propA, labelA],
 *  [propB, labelB]
 *  ).then(KB.log)
 * // {"results":[{"columns":["e"],"data":[{"row":[{"created_when":1452825908415,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"tester","hash":"lexicography","updated_when":1452885949550}]}]}],"errors":[]}
 *
 *
 * // the following are equivalent: batch edge query
 * getEdge(
 *  [[propE, labelE] ],
 *  [[propE, labelE2] ]
 *  ).then(KB.log)
 * getEdge([
 *  [[propE, labelE] ],
 *  [[propE, labelE2] ]
 * ]).then(KB.log)
 * // {"results":[{"columns":["e"],"data":[{"row":[{"created_when":1452825908415,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"tester","hash":"lexicography","updated_when":1452885949550}]}]},{"columns":["e"],"data":[{"row":[{"created_when":1452884323471,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"bot","hash":"lexicography","updated_when":1452885949550}]}]}],"errors":[]}
 *
 * // shorthand: pull multiple edges using multiple labels, and same prop.
 * getEdge(
 *  [propE, labelEArr]
 *  ).then(KB.log)
 * // {"results":[{"columns":["e"],"data":[{"row":[{"created_when":1452825908415,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"tester","hash":"lexicography","updated_when":1452885949550}]}]},{"columns":["e"],"data":[{"row":[{"created_when":1452884323471,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"bot","hash":"lexicography","updated_when":1452885949550}]}]}],"errors":[]}
 * 
 */
var getEdge = _.partial(batchQuery, pull)


// var propE = {
//   name: 'lexicography',
//   hash_by: 'name'
// }
// var labelE = 'next'
// var labelE2 = 'after'
// var labelEArr = ['next', 'after']

// var propA = {
//   name: 'A',
//   hash_by: 'name'
// }
// var propB = {
//   name: 'B',
//   hash_by: 'name'
// }
// var labelA = 'alpha'
// var labelB = 'alpha'

// console.log(pullEdge(
//  [propE, labelE]
//  ))

// getEdge(
//  [propE, labelE]
//  ).then(KB.log)

// getEdge(
//  [propE, labelE],
//  [propA, labelA]
//  ).then(KB.log)

// getEdge(
//  [labelE],
//  [propA]
//  ).then(KB.log)

// getEdge(
//  [propE, labelE],
//  [propA, labelA],
//  [propB, labelB]
//  ).then(KB.log)


// getEdge(
//  [[propE, labelE] ],
//  [[propE, labelE2] ]
//  ).then(KB.log)
// getEdge([
//  [[propE, labelE] ],
//  [[propE, labelE2] ]
//  ]).then(KB.log)


// getEdge(
//  [propE, labelEArr]
//  ).then(KB.log)


///////////////////
// Graph methods //
///////////////////



/**
 * The graph (node and edge) batching function. Applies the tail arguments to the query-param composer function fn: (propLabelA, propDistLabelE, propLabelB, wOp, sOp, rOp, pOp) or ([7-tuple], [7-tuple], ...), or ([[7-tuple], [7-tuple], ...]), then apply to a single query. Used to compose the high level KB_builder functions such as get etc.
 * Internally calls the splitLabelE (LabelE relaxed - not required) function to generate more query-param pairs which only single Elabels, since each edge can contain only a label. Applies fn by the argument tensor rank: either rank-1 or rank-2 and above (reduced to rank-2 and apply). Rank-1: ([p, L], [p|D, L], [p, L], wOp, rOp).
 * @private
 * @param  {Function} fn     The function for composing a valid query-params Array for query() to take.
 * @param  {*}  single_query, As (fn, \*, \*, ...), e.g. (fn, [p, L], [p|D, L], [p, L], wOp, rOp)
 * @param  {*}  multi_queries As (fn, [\*], [\*], [\*]...), e.g. (fn, [[p, L], [p|D, L], [p, L], wOp, rOp], [[p, L], [p|D, L], [p, L], wOp, rOp], ...)
 * @param  {*}  multi_queries_one_array As (fn, [[\*], [\*], [\*]...]), e.g. (fn, [[[p, L], [p|D, L], [p, L], wOp, rOp], [[p, L], [p|D, L], [p, L], wOp, rOp], ...])
 * @return {Promise}          From the query.
 *
 * @example
 * var get =  _.partial(batchQuery, pull)
 * // => function to get nodes and edges from KB.
 */
function batchQuery(fn, T) {
  var tailArr = _.tail(_.toArray(arguments));
  // determine the rank of T
  var rank = getRank(tailArr);
  // properly ranked argArr to pass to query at the end
  var argArr;
  // construct the argArr by rank; applies fn and splitLabelE
  /* istanbul ignore else */
  if (rank > 1) {
    // flatten all higher to rank 2
    tailArr = flattenToRank(tailArr, 2)
    argArr = _.flatten(_.map(tailArr, function(arr) {
      // here relaxing the ELabel constraint
      return splitLabelE(fn.apply(this, arr))
    }))
  } else if (rank == 1) {
    argArr = splitLabelE(fn.apply(this, tailArr))
  } else {
    throw new Error("Your argument rank is < 1. Rank must be positive.")
  }
  // console.log(argArr);
  return query(argArr)
}


// // a rank 1 arguments. 
// // Get only node(s)
// batchQuery(pull, [{
//   name: 'A'
// }, 'alpha'], 'RETURN a')

// // a rank 1 arguments. 
// // Get nodes and edges. Note that labelE is optional now
// batchQuery(pull, [{
//   name: 'A'
// }, 'alpha'], ['*0..1'], 'RETURN b,e')

// // a rank 2 arguments
// // Get nodes and edges
// batchQuery(pull, [
//   [{
//     name: 'A'
//   }, 'alpha'],
//   ['*0..1', 'next'], 'RETURN b,e'
// ])

// // a rank 3 arguments, practically the highest or you're using it wrong. Properly split by LabelE too
// batchQuery(pull, [
//   [
//     [{
//       name: 'A'
//     }, 'alpha'],
//     ['*0..1', ['next', 'xiage']], 'RETURN b,e'
//   ],
//   [
//     [{
//       name: 'B'
//     }, 'alpha'],
//     ['next'], 'RETURN b,e'
//   ]
// ])


/**
 * Returns a query-param pair for get, with string-cleaning (prevents SQL injection). This is a flexible method used for querying node(s), or optionally edge(s) and node(s). It also takes an optional WHERE filter sentence string, and a required RETURN sentence string. This is used to inject the query-param pair into query. The resultant query string is of the form:
 * For nodes: MATCH (a:LabelA {propA}) <wOp> <sOp> <rOp>
 * For nodes and edges: MATCH (a:LabelA {propA})-[e:LabelE ({propE}|*Dist)]-(b:LabelB {propB}) <wOp> <sOp> <rOp> <pOp>
 *
 * prop is the property JSON
 * Label is the label string or array of strings
 * Dist is the distance statement for edge; it is mutex with prop for edge.
 * <wOp> is the optional WHERE filter sentence, e.g. WHERE a.name="A" AND b.name="B"
 * <sOp> is the optional SET|REMOVE property-update sentence, e.g. SET a.age=10, a.sex="M"
 * <rOp> is the required RETURN|DELETE|DETACH DELETE sentence, e.g. RETURN b.hash, a.name; or DETACH DELETE a
 * <pOp> is the optional SHORETSTPATH|ALLSHORTESTPATHS sentence (no arguments), e.g. SHORTESTPATH
 * Note that the <Ops> can be specified at the tail of argument in any order since there is no ambiguity.
 * 
 * The entity names 'a', 'e', 'b' respectively from (a)-[e]->(b) must be specified in the <wOp>, <sOp> and <rOp> for correct reference, e.g. RETURN a.name. Also note the direction of the edge is from 'a'->'b'
 * If a <pOp> of SHORTESTPATH|ALLSHORTESTPATH, then 'p' references the path object.
 * 
 * For the edge e, either supply:
 * a JSON propE like {name="E"} for [e:LabelE {propE}] or,
 * a string Dist like '*0..2' for [e:LabelE *0..2]
 * this is because the two are already mutex in neo4j.
 * When <pOp> is used, propE is forbidden.
 * 
 * @private
 * @param  {Array} propLabelA     The propLabel pair for node 'a'. The second argument (LabelA) is optional.
 * @param  {Array} [propDistLabelE] The optional propLabel or distLabel pair for edge 'e'. The second argument (LabelE) is optional.
 * @param  {Array} [propLabelB]     The optional propLabel pair for node 'b'. The second argument (LabelB) is optional.
 * @param  {string} [wOp]            An optional, valid WHERE ... filter sentence.
 * @param  {string} [sOp]            An optional, valid SET|REMOVE ... property update sentence.
 * @param  {string} rOp            A required, valid RETURN|DELETE|DETACH DELETE ... return or delete sentence.
 * @param  {string} [pOp]            An optional SHORTESTPATH|ALLSHORTESTPATHS sentence to make the query return a path object 'p'.
 * @return {Array}                Pair of query and params object.
 *
 * @example
 * 
 * // return all nodes
 * KB.log(pull([], 'RETURN a'));
 * // [ 'MATCH (a ) RETURN a', {} ]
 * 
 * // return nodes with the prop
 * KB.log(pull([{
 *   name: "A"
 * }], 'RETURN a'));
 * // [ 'MATCH (a {name: {propA}.name}) RETURN a', { propA: { name: 'A' } } ]
 * 
 * // return nodes with the prop
 * KB.log(pull([{
 *   name: "A"
 * }], 'RETURN a'));
 * // [ 'MATCH (a {name: {propA}.name}) RETURN a', { propA: { name: 'A' } } ]
 * 
 * // return all nodes with the prop and label
 * KB.log(pull([{
 *   name: "A"
 * }, 'alpha'], 'RETURN a'));
 * // [ 'MATCH (a:alpha {name: {propA}.name}) RETURN a', { propA: { name: 'A' } } ]
 * 
 * // same as above
 * KB.log(pull([, 'alpha'], 'WHERE a.name="A"', 'RETURN a'));
 * // [ 'MATCH (a:alpha ) where a.name="A" RETURN a', {} ]
 * 
 * // DETACH DELETE a node
 * KB.log(pull([, 'alpha'], 'WHERE a.name="C"', 'DETACH DELETE a'));
 * // [ 'MATCH (a ) where a.name="C" DETACH DELETE a', {} ]
 * 
 * // SET properties
 * KB.log(pull(['alpha'], 'WHERE a.name="A"', 'SET a.age=10, a.sex="M"', 'RETURN a'));
 * // [ 'MATCH (a:alpha ) where a.name="A" SET a.age=10, a.sex="M" RETURN a', {} ]
 * 
 * // REMOVE properties
 * KB.log(pull(['alpha'], 'WHERE a.name="A"', 'REMOVE a.age, a.sex', 'RETURN a'));
 * // [ 'MATCH (a:alpha ) where a.name="A" REMOVE a.age, a.sex RETURN a', {} ]
 * 
 * // SHORTESTPATH return paths of: nodes and edges 0-2 units apart FROM node a, with the props and labels
 * KB.log(pull([{
 *   name: 'A'
 * }, 'alpha'], ['*0..2'], 'SHORTESTPATH', 'RETURN p, DISTINCT(nodes(p))'));
 * // [ 'MATCH (a:alpha {name: {propA}.name})-[e:next *0..1]->(b )   return b,e', { propA: { name: 'A' } } ]
 * 
 * // return nodes and edges 0-1 units apart FROM node a, with the props and labels
 * KB.log(pull([{
 *   name: 'A'
 * }, 'alpha'], ['*0..1', 'next'], 'RETURN b,e'));
 * // [ 'MATCH (a:alpha {name: {propA}.name})-[e:next *0..1]->(b )   return b,e', { propA: { name: 'A' } } ]
 * 
 * // return nodes and edges 0-1 units apart TO node B, with the props and labels
 * KB.log(pull([], ['*0..1', 'next'], [{
 *   name: 'B'
 * }, 'alpha'], 'RETURN a,e'));
 * ['MATCH (a )-[e:next *0..1]->(b:alpha {name: {propB}.name})   return a,e', {
 *   propB: {
 *     name: 'B'
 *   }
 * }]
 * 
 * // return nodes and edges units apart TO node B, with edge named 'E' and labeled 'next'
 * KB.log(pull([], [{
 *     name: 'E'
 *   },
 *   ['next', 'xiage']
 * ], [{
 *   name: 'B'
 * }, 'alpha'], 'RETURN a,e'));
 * ['MATCH (a )-[e:next {name: {propE}.name}]->(b:alpha {name: {propB}.name})   return a,e', {
 *   propE: {
 *     name: 'E'
 *   },
 *   propB: {
 *     name: 'B'
 *   }
 * }]
 * 
 * // same as above, but source nodes must now have name that is lexicographically lower than "B"
 * KB.log(pull([], [{
 *   name: 'E'
 * }, 'next'], [{
 *   name: 'B'
 * }, 'alpha'], 'WHERE a.name < "B"', 'RETURN a,e'));
 * // [ 'MATCH (a )-[e:next {name: {propE}.name}]->(b:alpha {name: {propB}.name})  WHERE a.name < "B" return a,e', { propE: { name: 'E' }, propB: { name: 'B' } } ]
 * 
 * // if E has an array of multiple labels, can use with splitLabelE
 * KB.log(splitLabelE(pull([], [{
 *     name: 'E'
 *   },
 *   ['next', 'xiage']
 * ], [{
 *   name: 'B'
 * }, 'alpha'], 'WHERE a.name < "B"', 'RETURN a,e')));
 * // [["MATCH (a)-[e:next|xiage {name: {propE}.name}]->(b:alpha  {name: {propB}.name}) WHERE a.name < \"B\" RETURN a,e",{"propE":{"name":"E"},"propB":{"name":"B"}}]]
 *   
 */
function pull(propLabelA, propDistLabelE, propLabelB, wOp, sOp, rOp, pOp) {
  // partition into arr and str arguments
  var part = _.partition(arguments, _.isArray)
  var arrArr = _.first(part),
    strArr = _.last(part);

  // setting args accordingly
  var propLabelA = arrArr[0],
    propDistLabelE = arrArr[1],
    propLabelB = arrArr[2];
  // the WHERE, SET, RETURN, PATH clauses
  var wOpStr = _.find(strArr, KB.cons.isWOp) || '';
  var sOpStr = _.find(strArr, KB.cons.isSOp) || '';
  var rOpStr = _.find(strArr, KB.cons.isROp) || '';
  // if RETURN is not supplied,
  if (!rOpStr) {
    if (propDistLabelE) {
      // return the found edge
      rOpStr = 'RETURN e'
    } else {
      // or return the node if no edge query is made
      rOpStr = 'RETURN a'
    }
  };
  var pOpStr = _.find(strArr, KB.cons.isPOp) || '';

  // console.log('propLabelA', propLabelA)
  // console.log('propDistLabelE', propDistLabelE)
  // console.log('propLabelB', propLabelB)
  // console.log("wOpStr", wOpStr)
  // console.log("sOpStr", sOpStr)
  // console.log("rOpStr", rOpStr)
  // console.log("pOpStr", pOpStr)

  // declare the head, body, tail of the query string, and the props
  // head = MATCH (a:LabelA {propA})
  // body = -[e:LabelE {propE}|*Dist]->(b:LabelB {propB})
  // tail = WHERE ... SET|REMOVE ... RETURN|DELETE|DETACH DELETE ...
  var head, body, tail, props;

  // Head: first node arg
  var partA = sortPropLabel(propLabelA),
    propA = _.get(partA, '0.0'),
    LabelA = _.get(partA, '1.0'),
    LabelStrA = KB.cons.stringifyLabel(LabelA);
  head = 'MATCH (a' + LabelStrA + literalizeProp(propA, 'propA') + ')'

  // Body: optional edge and end node args
  if (propDistLabelE) {
    // edge, doesn't need to pass cons
    var partE = sortPropLabel(propDistLabelE),
      propDistE = _.get(partE, '0.0'),
      // take prop XOR dist for edge
      propE = _.isPlainObject(propDistE) ? propDistE : undefined,
      distE = KB.cons.stringifyDist(propDistE),
      LabelE = _.get(partE, '1.0'),
      LabelStrE = KB.cons.stringifyLabel(LabelE);

    // node B
    var partB = sortPropLabel(propLabelB),
      propB = _.get(partB, '0.0'),
      LabelB = _.get(partB, '1.0'),
      LabelStrB = KB.cons.stringifyLabel(LabelB);

    // if it's a path query, discard propE, reform string
    if (pOpStr) {
      propE = undefined
      body = ', (b' + LabelStrB + literalizeProp(propB, 'propB') + '), ' +
        'p=' + pOpStr + '((a)-[e' + LabelStrE + distE + ']->(b))'
    } else {
      body = '-[e' + LabelStrE + literalizeProp(propE, 'propE') + distE + ']->' +
        '(b' + LabelStrB + literalizeProp(propB, 'propB') + ')'
    }
    props = _.pickBy({
      propA: propA,
      propE: propE,
      propB: propB
    })
  } else {
    // just a node query
    body = ''
    props = _.pickBy({
      propA: propA
    })
  }

  // Tail
  tail = (' ' + wOpStr + ' ' + sOpStr + ' ' + rOpStr).replace(/\s{2,}/g, ' ')

  return [
    head + body + tail, props
  ]
}

// // return all nodes
// KB.log(pull([], 'RETURN a'));
// // [ 'MATCH (a ) RETURN a', {} ]

// // return nodes with the prop
// KB.log(pull([{
//   name: "A"
// }], 'RETURN a'));
// // [ 'MATCH (a {name: {propA}.name}) RETURN a', { propA: { name: 'A' } } ]

// // return nodes with the prop
// KB.log(pull([{
//   name: "A"
// }], 'RETURN a'));
// // [ 'MATCH (a {name: {propA}.name}) RETURN a', { propA: { name: 'A' } } ]

// // return all nodes with the prop and label
// KB.log(pull([{
//   name: "A"
// }, 'alpha'], 'RETURN a'));
// // [ 'MATCH (a:alpha {name: {propA}.name}) RETURN a', { propA: { name: 'A' } } ]

// // same as above
// KB.log(pull([, 'alpha'], 'WHERE a.name="A"', 'RETURN a'));
// // [ 'MATCH (a:alpha ) where a.name="A" RETURN a', {} ]

// // DETACH DELETE a node
// KB.log(pull([, 'alpha'], 'WHERE a.name="C"', 'DETACH DELETE a'));
// // [ 'MATCH (a ) where a.name="C" DETACH DELETE a', {} ]

// // SET properties
// KB.log(pull(['alpha'], 'WHERE a.name="A"', 'SET a.age=10, a.sex="M"', 'RETURN a'));
// // [ 'MATCH (a:alpha ) where a.name="A" SET a.age=10, a.sex="M" RETURN a', {} ]

// // REMOVE properties
// KB.log(pull(['alpha'], 'WHERE a.name="A"', 'REMOVE a.age, a.sex', 'RETURN a'));
// // [ 'MATCH (a:alpha ) where a.name="A" REMOVE a.age, a.sex RETURN a', {} ]

// // SHORTESTPATH return paths of: nodes and edges 0-2 units apart FROM node a, with the props and labels
// KB.log(pull([{
//   name: 'A'
// }, 'alpha'], ['*0..2'], 'SHORTESTPATH', 'RETURN p, DISTINCT(nodes(p))'));
// // [ 'MATCH (a:alpha {name: {propA}.name})-[e:next *0..1]->(b )   return b,e', { propA: { name: 'A' } } ]

// // return nodes and edges 0-1 units apart FROM node a, with the props and labels
// KB.log(pull([{
//   name: 'A'
// }, 'alpha'], ['*0..1', 'next'], 'RETURN b,e'));
// // [ 'MATCH (a:alpha {name: {propA}.name})-[e:next *0..1]->(b )   return b,e', { propA: { name: 'A' } } ]

// // return nodes and edges 0-1 units apart TO node B, with the props and labels
// KB.log(pull([], ['*0..1', 'next'], [{
//   name: 'B'
// }, 'alpha'], 'RETURN a,e'));
// ['MATCH (a )-[e:next *0..1]->(b:alpha {name: {propB}.name})   return a,e', {
//   propB: {
//     name: 'B'
//   }
// }]

// // return nodes and edges units apart TO node B, with edge named 'E' and labeled 'next'
// KB.log(pull([], [{
//     name: 'E'
//   },
//   ['next', 'xiage']
// ], [{
//   name: 'B'
// }, 'alpha'], 'RETURN a,e'));
// ['MATCH (a )-[e:next {name: {propE}.name}]->(b:alpha {name: {propB}.name})   return a,e', {
//   propE: {
//     name: 'E'
//   },
//   propB: {
//     name: 'B'
//   }
// }]

// // same as above, but source nodes must now have name that is lexicographically lower than "B"
// KB.log(pull([], [{
//   name: 'E'
// }, 'next'], [{
//   name: 'B'
// }, 'alpha'], 'WHERE a.name < "B"', 'RETURN a,e'));
// // [ 'MATCH (a )-[e:next {name: {propE}.name}]->(b:alpha {name: {propB}.name})  WHERE a.name < "B" return a,e', { propE: { name: 'E' }, propB: { name: 'B' } } ]

// // if E has an array of multiple labels, can use with splitLabelE
// KB.log(splitLabelE(pull([], [{
//     name: 'E'
//   },
//   ['next', 'xiage']
// ], [{
//   name: 'B'
// }, 'alpha'], 'WHERE a.name < "B"', 'RETURN a,e')));
// // [["MATCH (a)-[e:next|xiage {name: {propE}.name}]->(b:alpha  {name: {propB}.name}) WHERE a.name < \"B\" RETURN a,e",{"propE":{"name":"E"},"propB":{"name":"B"}}]]




/**
 * Get graph and do whatever u want with the search results: filter, RETURN, DELETE, DETACH DELETE. Graph: node(s) and edge(s) from neo4j with propLabel of nodes A -> B with the edge E. The propLabel for A, B and E is an array of a optional non-empty JSON prop (doesn't have to satisfy KB constraints), and a (optional for A,B; required for E) Label string or array.
 * This is a flexible method used for querying node(s), or optionally edge(s) and node(s). It also takes an optional WHERE filter sentence string, and a required RETURN sentence string.The resultant query string is of the form:
 * For nodes: MATCH (a:LabelA {propA}) <wOp> <sOp> <rOp>
 * For nodes and edges: MATCH (a:LabelA {propA})-[e:LabelE ({propE}|*Dist)]-(b:LabelB {propB}) <wOp> <sOp> <rOp> <pOp>
 * 
 * @param  {*}  single_query, As (fn, \*, \*, ...), e.g. (fn, [p, L], [p|D, L], [p, L], wOp, rOp)
 * @param  {*}  multi_queries As (fn, [\*], [\*], [\*]...), e.g. (fn, [[p, L], [p|D, L], [p, L], wOp, rOp], [[p, L], [p|D, L], [p, L], wOp, rOp], ...)
 * @param  {*}  multi_queries_one_array As (fn, [[\*], [\*], [\*]...]), e.g. (fn, [[[p, L], [p|D, L], [p, L], wOp, rOp], [[p, L], [p|D, L], [p, L], wOp, rOp], ...])
 * @return {Promise}          From the query.
 *
 * @example
 * // a rank 1 arguments. 
 * // Get only node(s)
 * get([{
 *   name: 'A'
 * }, 'alpha'], 'RETURN a').then(KB.log)
 *
 * // a rank 1 arguments. 
 * // Delete node(s)
 * get([{
 *   name: 'C'
 * }, 'alpha'], 'DETACH DELETE a').then(KB.log)
 * 
 * // a rank 1 arguments. 
 * // Get nodes and edges. Note that labelE is optional now
 * get([{
 *   name: 'A'
 * }, 'alpha'], ['*0..1'], 'RETURN b,e').then(KB.log)
 * 
 * // a rank 2 arguments
 * // Get nodes and edges
 * get([
 *   [{
 *     name: 'A'
 *   }, 'alpha'],
 *   ['*0..1', 'next'], 'RETURN b,e'
 * ]).then(KB.log)
 *
 * // a rank 2 arguments
 * // Get nodes and edges. Edges can have multiple labels in query; piped
 * get([
 *   [{
 *     name: 'A'
 *   }, 'alpha'],
 *   ['*0..1', ['next', 'xiage']], 'RETURN b,e'
 * ]).then(KB.log)
 * 
 */
var get = _.partial(batchQuery, pull)

// // a rank 1 arguments. 
// // Get only node(s)
// get([{
//   name: 'A'
// }, 'alpha'], 'RETURN a').then(KB.log)

// // a rank 1 arguments. 
// // Delete node(s)
// get([{
//   name: 'C'
// }, 'alpha'], 'DETACH DELETE a').then(KB.log)

// // a rank 1 arguments. 
// // Get nodes and edges. Note that labelE is optional now
// get([{
//   name: 'A'
// }, 'alpha'], ['*0..1'], 'RETURN b,e').then(KB.log)

// // a rank 2 arguments
// // Get nodes and edges
// get([
//   [{
//     name: 'A'
//   }, 'alpha'],
//   ['*0..1', 'next'], 'RETURN b,e'
// ]).then(KB.log)

// // a rank 2 arguments
// // Get nodes and edges. Edges can have multiple labels in query; piped
// get([
//   [{
//     name: 'A'
//   }, 'alpha'],
//   ['*0..1', ['next', 'xiage']], 'RETURN b,e'
// ]).then(KB.log)



/**
 * Returns a query-param pair for add, taking propLabels of nodes A -> B with the edge E. There are two use-cases:
 * addNode: supply only one propLabelA argument, containing a non-empty JSON prop satisfying the KB constraints, and an optional Label string or array.
 * addEdge: supply all three propLabels for A, E, B. The propLabel for A and B is an array of a optional non-empty JSON prop (doesn't have to satisfy KB constraints), and an optional Label string or array. The prop for E must satisfy the KB constraints, and the Label for E is required. 
 * This is used to inject the query-param pair into query.
 *
 * @private
 * @param {Array} propLabelA   propLabel pair of (source) node A. If this is the only argument supplied, the JSON prop must satisfy the KB cosntraints. The label is optional.
 * @param {Array} [propLabelE]   propLabel pair of edge E from A to B. the JSON prop must satisfy the KB constrains, and the label is required (used for hashing).
 * @param {Array} [propLabelB]   propLabel pair of target node B. Doesn't have to satisfy KB constraints.
 * @return {Array} Pair of query and params object; or empty array if prop didn't pass the KB.cons. By hashing, this will update the node or edge if it already exists.
 *
 * @example
 * // nodes
 * var propA = {
 *   name: "A",
 *   hash_by: "name"
 * }
 * var propB = {
 *   name: "B",
 *   hash_by: "name"
 * }
 * KB.cons.legalize(propA)
 * KB.cons.legalize(propB)
 *
 * // edge
 * var propE = {
 *   name: "E"
 * }
 * KB.cons.legalize(propE)
 *
 * for adding a node
 * KB.log(push([propA, 'test']));
 * // ["MERGE (a:test  {hash: {propA}.hash}) ON CREATE SET a = {propA}, a.created_by={propA}.updated_by, a.created_when={propA}.updated_when ON MATCH SET a += {propA} RETURN a",{"propA":{"name":"A","hash_by":"name","hash":"A","updated_by":"bot","updated_when":"2016-01-23T16:11:02.962Z"}}]
 * 
 * KB.log(push([propA, 'test'], [propE, 'test_next']))
 * // Error: You must provide propLabel for either A or A,E,B.
 * 
 * KB.log(push([propA, 'test'], [propE, 'test_next'], [propB, 'test']))
 * // ["MATCH (a:test  {name: {propA}.name, hash_by: {propA}.hash_by, hash: {propA}.hash, updated_by: {propA}.updated_by, updated_when: {propA}.updated_when}), (b:test  {name: {propB}.name, hash_by: {propB}.hash_by, hash: {propB}.hash, updated_by: {propB}.updated_by, updated_when: {propB}.updated_when}) MERGE (a)-[e:test_next ]->(b) ON CREATE SET e = {propE}, e.created_by={propE}.updated_by, e.created_when={propE}.updated_when ON MATCH SET e += {propE} RETURN e",{"propE":{"name":"E","hash_by":"hash","hash":"test","updated_by":"bot","updated_when":"2016-01-23T16:12:08.583Z"},"propA":{"name":"A","hash_by":"name","hash":"test","updated_by":"bot","updated_when":"2016-01-23T16:12:08.579Z"},"propB":{"name":"B","hash_by":"name","hash":"test","updated_by":"bot","updated_when":"2016-01-23T16:12:08.583Z"}}]
 * 
 */
function push(propLabelA, propLabelE, propLabelB) {
  // nodes, dont need to pass cons
  var partA = sortPropLabel(propLabelA),
    propA = _.get(partA, '0.0'),
    LabelA = _.get(partA, '1.0'),
    LabelStrA = KB.cons.stringifyLabel(LabelA);

  // if propLabelE not present, is addNode
  if (propLabelA && !propLabelE && !propLabelB) {
    /* istanbul ignore else */
    if (KB.cons.pass(propA)) {
      return [
        // check existence, find by hash
        'MERGE (a' + LabelStrA + ' {hash: {propA}.hash}) ' +
        // create if no hash matched
        'ON CREATE SET a = {propA}, a.created_by={propA}.updated_by, a.created_when={propA}.updated_when ' +
        // update if hash matched
        'ON MATCH SET a += {propA} RETURN a', {
          propA: propA
        }
      ]
    };
  } else if (propLabelA && propLabelE && propLabelB) {
    // edge, needs to pass cons
    var partE = sortPropLabel(propLabelE),
      propE = _.get(partE, '0.0'),
      LabelE = _.get(partE, '1.0'),
      LabelStrE = KB.cons.stringifyLabel(LabelE);
    // nodes, dont need to pass cons
    var partB = sortPropLabel(propLabelB),
      propB = _.get(partB, '0.0'),
      LabelB = _.get(partB, '1.0'),
      LabelStrB = KB.cons.stringifyLabel(LabelB);
    /* istanbul ignore else */
    if (KB.cons.pass(propE)) {
      return [
        // a and b nodes must already exist
        'MATCH (a' + LabelStrA + literalizeProp(propA, 'propA') + '), (b' + LabelStrB + literalizeProp(propB, 'propB') + ') ' +
        // check if e already exists by propE hash
        'MERGE (a)-[e' + LabelStrE + ']->(b) ' +
        // 'MERGE (a)-[e' + LabelStrE + '{hash: {propE}.hash}]->(b) ' +
        // create if no hash matched
        'ON CREATE SET e = {propE}, e.created_by={propE}.updated_by, e.created_when={propE}.updated_when ' +
        // update if hash matched
        'ON MATCH SET e += {propE} RETURN e', _.pickBy({
          propE: propE,
          propA: propA,
          propB: propB
        })
      ]
    };
  } else {
    throw new Error("You must provide propLabel for either A or A,E,B.")
  }
}


// var propA = {
//   name: "A",
//   hash_by: "name"
// }
// var propB = {
//   name: "B",
//   hash_by: "name"
// }
// KB.cons.legalize(propA)
// KB.cons.legalize(propB)
// var propE = {
//   name: "E"
// }
// KB.cons.legalize(propE)

// KB.log(push([propA, 'test']));

// KB.log(push([propA, 'test'], [propE, 'test_next']))

// KB.log(push([propA, 'test'], [propE, 'test_next'], [propB, 'test']))




/**
 * Get graph and do whatever u want with the search results: filter, RETURN, DELETE, DETACH DELETE. Graph: node(s) and edge(s) from neo4j with propLabel of nodes A -> B with the edge E. The propLabel for A, B and E is an array of a optional non-empty JSON prop (doesn't have to satisfy KB constraints), and a (optional for A,B; required for E) Label string or array.
 * This is a flexible method used for querying node(s), or optionally edge(s) and node(s). It also takes an optional WHERE filter sentence string, and a required RETURN sentence string.The resultant query string is of the form:
 * For nodes: MATCH (a:LabelA {propA}) <wOp> <sOp> <rOp>
 * For nodes and edges: MATCH (a:LabelA {propA})-[e:LabelE ({propE}|*Dist)]-(b:LabelB {propB}) <wOp> <sOp> <rOp> <pOp>
 * 
 * @param  {*}  single_query, As (fn, \*, \*, ...), e.g. (fn, [p, L], [p|D, L], [p, L], wOp, rOp)
 * @param  {*}  multi_queries As (fn, [\*], [\*], [\*]...), e.g. (fn, [[p, L], [p|D, L], [p, L], wOp, rOp], [[p, L], [p|D, L], [p, L], wOp, rOp], ...)
 * @param  {*}  multi_queries_one_array As (fn, [[\*], [\*], [\*]...]), e.g. (fn, [[[p, L], [p|D, L], [p, L], wOp, rOp], [[p, L], [p|D, L], [p, L], wOp, rOp], ...])
 * @return {Promise}          From the query.
 *
 * @example
 * // nodes
 * var propA = {
 *   name: "A",
 *   hash_by: "name"
 * }
 * var propB = {
 *   name: "B",
 *   hash_by: "name"
 * }
 * KB.cons.legalize(propA)
 * KB.cons.legalize(propB)
 * // edge
 * var propE = {
 *   name: "E"
 * }
 * KB.cons.legalize(propE)
 * 
 * // add a node
 * add([propA, 'test']).then(KB.log)
 * // [{"columns":["a"],"data":[{"row":[{"created_when":"2016-01-23T16:21:51.674Z","name":"A","updated_by":"bot","hash_by":"name","created_by":"bot","hash":"A","updated_when":"2016-01-23T16:21:51.674Z"}]}]}]
 * 
 * // add nodes
 * add([[propA, 'test'], ], [[propB, 'test'], ]).then(KB.log)
 * // equivalently
 * add([[[propA, 'test'], ], [[propB, 'test'], ]]).then(KB.log)
 * // [{"columns":["a"],"data":[{"row":[{"created_when":"2016-01-23T16:21:51.674Z","name":"A","updated_by":"bot","hash_by":"name","created_by":"bot","hash":"A","updated_when":"2016-01-23T16:24:14.242Z"}]}]},{"columns":["a"],"data":[{"row":[{"created_when":"2016-01-23T16:23:53.406Z","name":"B","updated_by":"bot","hash_by":"name","created_by":"bot","hash":"B","updated_when":"2016-01-23T16:24:14.244Z"}]}]}]
 * 
 * // must supply target node if adding edge
 * add([propA, 'test'], [propE, 'test_next']).then(KB.log)
 * // Error: You must provide propLabel for either A or A,E,B.
 * 
 * //add edge. Note: don't use the legalized props to search for nodes A, B, otherwise it will want to match every field including the timestamp
 * add([{name: 'A'}, 'test'], [propE, 'test_next'], [{name: 'B'}, 'test']).then(KB.log)
 * // [{"columns":["e"],"data":[{"row":[{"created_when":"2016-01-23T16:25:12.706Z","name":"E","updated_by":"bot","hash_by":"hash","created_by":"bot","hash":"test","updated_when":"2016-01-23T16:25:12.706Z"}]}]}]
 * 
 * // add edges
 * // add([[{name: 'A'}, 'test'], [propE, 'test_next'], [{name: 'B'}, 'test']],
 * // [[{name: 'A'}, 'test'], [propE, 'test_next_2'], [{name: 'B'}, 'test']]).then(KB.log)
 * // equivalently
 * add([{
 *   name: 'A'
 * }, 'test'], [propE, ['test_next', 'test_next_2']], [{
 *   name: 'B'
 * }, 'test']).then(KB.log)
 * // [{"columns":["e"],"data":[{"row":[{"created_when":"2016-01-23T16:25:12.706Z","name":"E","updated_by":"bot","hash_by":"hash","created_by":"bot","hash":"test","updated_when":"2016-01-23T16:41:22.955Z"}]}]},{"columns":["e"],"data":[{"row":[{"created_when":"2016-01-23T16:37:55.865Z","name":"E","updated_by":"bot","hash_by":"hash","created_by":"bot","hash":"t
 * 
 */
var add = _.partial(batchQuery, push)


// var propA = {
//   name: "A",
//   hash_by: "name"
// }
// var propB = {
//   name: "B",
//   hash_by: "name"
// }
// KB.cons.legalize(propA)
// KB.cons.legalize(propB)
// var propE = {
//   name: "E"
// }
// KB.cons.legalize(propE)

// // add a node
// add([propA, 'test']).then(KB.log)
// // [{"columns":["a"],"data":[{"row":[{"created_when":"2016-01-23T16:21:51.674Z","name":"A","updated_by":"bot","hash_by":"name","created_by":"bot","hash":"A","updated_when":"2016-01-23T16:21:51.674Z"}]}]}]

// // add nodes
// add([[propA, 'test'], ], [[propB, 'test'], ]).then(KB.log)
// // equivalently
// add([[[propA, 'test'], ], [[propB, 'test'], ]]).then(KB.log)
// // [{"columns":["a"],"data":[{"row":[{"created_when":"2016-01-23T16:21:51.674Z","name":"A","updated_by":"bot","hash_by":"name","created_by":"bot","hash":"A","updated_when":"2016-01-23T16:24:14.242Z"}]}]},{"columns":["a"],"data":[{"row":[{"created_when":"2016-01-23T16:23:53.406Z","name":"B","updated_by":"bot","hash_by":"name","created_by":"bot","hash":"B","updated_when":"2016-01-23T16:24:14.244Z"}]}]}]

// // must supply target node if adding edge
// add([propA, 'test'], [propE, 'test_next']).then(KB.log)
// // Error: You must provide propLabel for either A or A,E,B.

// // add edge. Note: don't use the legalized props to search for nodes A, B, otherwise it will want to match every field including the timestamp
// add([{name: 'A'}, 'test'], [propE, 'test_next'], [{name: 'B'}, 'test']).then(KB.log)
// // [{"columns":["e"],"data":[{"row":[{"created_when":"2016-01-23T16:25:12.706Z","name":"E","updated_by":"bot","hash_by":"hash","created_by":"bot","hash":"test","updated_when":"2016-01-23T16:25:12.706Z"}]}]}]

// // add edges
// // add([[{name: 'A'}, 'test'], [propE, 'test_next'], [{name: 'B'}, 'test']],
// // [[{name: 'A'}, 'test'], [propE, 'test_next_2'], [{name: 'B'}, 'test']]).then(KB.log)
// // equivalently
// add([{
//   name: 'A'
// }, 'test'], [propE, ['test_next', 'test_next_2']], [{
//   name: 'B'
// }, 'test']).then(KB.log)
// // [{"columns":["e"],"data":[{"row":[{"created_when":"2016-01-23T16:25:12.706Z","name":"E","updated_by":"bot","hash_by":"hash","created_by":"bot","hash":"test","updated_when":"2016-01-23T16:41:22.955Z"}]}]},{"columns":["e"],"data":[{"row":[{"created_when":"2016-01-23T16:37:55.865Z","name":"E","updated_by":"bot","hash_by":"hash","created_by":"bot","hash":"test","updated_when":"2016-01-23T16:41:22.955Z"}]}]}]

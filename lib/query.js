// The querier for querying Neo4j using the REST API

// dependencies
var _ = require('lomath')
var Promie = require('bluebird')
var reqscraper = require('reqscraper')
var request = reqscraper.req

// statement JSON keys
var skey = ['statement', 'parameters']

/**
 * Generate the statement object from query and optional params.
 * @param  {string|Array} query  The query string, or the array of query string and optional params.
 * @param  {JSON} [params] The params JSON for query; taken only if query is a string.
 * @return {JSON}        The statement object
 *
 * @example
 * genStatement(
 * 'CREATE (n {prop})', 
 * {
 *  prop: { name: 'a', num: 1 }
 * })
 *
 * // equivalently,
 * genStatement([
 * 'CREATE (n {prop})',
 * {
 *  prop: { name: 'a', num: 1 }
 * }])
 * // => { statement: 'CREATE (n {prop})', parameters: { prop: { name: 'a', num: 1 } } }
 */
function genStatement(query, params) {
  var qpArr = _.isArray(query) ? query : [query, params];
  return _.zipObject(skey, qpArr)
}

/**
 * Generate an array of statements from multiple array-pairs of query and params.
 * @param  {...Arrays} ...pairs Array like [query, params]
 * @param  {string} query A query string, if the first argument isn't an array.
 * @param  {JSON} params The parameters JSON to the query string, if the first argument isn't an array.
 * @return {Array}         Array of statements.
 *
 * @example
 * genStatArr(
 * ['q1','p1'],
 * ['q2','p2']
 * )
 * // => [ { statement: 'q1', parameters: 'p1' },
 * // { statement: 'q2', parameters: 'p2' } ]
 * 
 * genStatArr([
 * ['q1','p1'],
 * ['q2','p2']
 * ])
 * // => [ { statement: 'q1', parameters: 'p1' },
 * // { statement: 'q2', parameters: 'p2' } ]
 *
 * genStatArr('q1', 'p1')
 * // => [ { statement: 'q1', parameters: 'p1' } ]
 */
function genStatArr() {
  // return _.isArray(arguments[0]) ? _.map(arguments, genStatement) : [genStatement(_.toArray(arguments))]
  // if the first arg is array
  if (_.isArray(arguments[0])) {
    // ([['q1', 'p1'], ['q2', 'p2'], ...])
    if (_.isArray(arguments[0][0])) {
      return _.map(arguments[0], genStatement)
        // (['q1', 'p1'], ['q2', 'p2'], ...)
    } else {
      return _.map(arguments, genStatement)
    }
  } else {
    // args is in ('q1', 'p1') form
    return [genStatement(_.toArray(arguments))]
  }
}

/**
 * POST a comitting query to the db.
 * @param  {Array}   statArr  Array of statement objects.
 * @param  {Function} callback Function with (err, res, body) args for the query result.
 * @return {Promise}  A promise object resolved with the query results from the request module.
 */
function postQuery(statArr) {
  var options = {
      method: 'POST',
      baseUrl: this.NEO4J_BASEURL,
      url: this.NEO4J_ENDPT,
      headers: {
        'Accept': 'application/json; charset=UTF-8',
        'Content-type': 'application/json'
      },
      json: {
        statements: statArr
          // [{statement: query, parameters: params},
          // {statement: query, parameters: params}]
      }
    }
    // call to the db server, returns a Promise
  return request(options).then(resolver).catch(_.identity)
}

/**
 * Resolver function to chain Promise to resolve results or reject errors. Used in postQuery.
 * @param  {JSON} obj Returned from the neo4j server.
 * @return {Promise}     That resolves results or rejects errors.
 */
function resolver(obj) {
  return new Promise(function(resolve, reject) {
    return _.isEmpty(obj.results) ? reject(obj.errors) : resolve(obj.results);
  })
}

/**
 * Queries Neo4j with arrays of pairs of query and optional params. Is the right-composition of genStatArr and postQuery.
 * @param  {...Arrays}   ...Pairs  Of queries and optional params.
 * @param  {string} query A query string, if the first argument isn't an array.
 * @param  {JSON} params The parameters JSON to the query string, if the first argument isn't an array.
 * @return {Promise}  A promise object resolved with the query results from the request module.
 *
 * @example
 * Normal query string
 * query('MATCH (n:Alphabet) DETACH DELETE (n)')
 * .then(_.flow(JSON.stringify, console.log))
 * // => {"results":[{"columns":[],"data":[]}],"errors":[]}
 * // Deleted all Alphabet nodes and relations
 *
 * // query with params, creates multiple nodes at once
 * query(
 * ['CREATE (n:Alphabet {prop}) RETURN n', 
 * {
 *  prop: [{ name: 'a', num: 1}, { name: 'b', num: 2 }]
 * }]
 * ).then(_.flow(JSON.stringify, console.log))
 * // => {"results":[{"columns":["n"],"data":[{"row":[{"num":1,"name":"a"}]},{"row":[{"num":2,"name":"b"}]}]}],"errors":[]}
 * // Added nodes 'a', 'b' to the graph
 *
 * // multiple queries at once
 * query(
 * ['CREATE (n:Alphabet {prop}) RETURN n', { prop: [{ name: 'c', num: 3}, { name: 'd', num: 4 }] }],
 * ["MATCH (c),(d) WHERE c.name='c' AND d.name='d' CREATE UNIQUE (c)-[r:Next]->(d) RETURN r"]
 * ).then(_.flow(JSON.stringify, console.log))
 * 
 * // equivalently can nest under one array
 * query(
 * [
 * ['CREATE (n:Alphabet {prop}) RETURN n', { prop: [{ name: 'c', num: 3}, { name: 'd', num: 4 }] }],
 * ["MATCH (c),(d) WHERE c.name='c' AND d.name='d' CREATE UNIQUE (c)-[r:Next]->(d) RETURN r"]
 * ]
 * ).then(_.flow(JSON.stringify, console.log))
 * // => {"results":[{"columns":["n"],"data":[{"row":[{"num":3,"name":"c"}]},{"row":[{"num":4,"name":"d"}]}]},{"columns":["r"],"data":[{"row":[{}]}]}],"errors":[]}
 * Created nodes 'c', 'd', then added an edge (c)->(d)
 * 
 */
var query = _.flow(genStatArr, postQuery)

// sample calls
// query('MATCH (n:Alphabet) DETACH DELETE (n)')
// .then(_.flow(JSON.stringify, console.log))

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

/**
 * This is the exported wrapper function: init the necessary params, then return the query. The fields are set to neo4j defaults if not supplied.
 * @param  {JSON} options An optional JSON with the fields {NEO4J_AUTH='neo4j:neo4j', NEO4J_HOST='localhost', NEO4J_PORT-'7474'} containing username:password, the host address, and port number for neo4j
 * @return {Function}            The query function.
 */
var queryWrap = function(options) {
  options = options || {}
  this.NEO4J_AUTH = options.NEO4J_AUTH || 'neo4j:neo4j'
  this.NEO4J_HOST = options.NEO4J_HOST || 'localhost'
  this.NEO4J_PORT = options.NEO4J_PORT || '7474'
  this.NEO4J_BASEURL = 'http://' + this.NEO4J_AUTH + '@' + this.NEO4J_HOST + ':' + this.NEO4J_PORT + '/'
  this.NEO4J_ENDPT = 'db/data/transaction/commit'

  return query;
}

// export for usage
module.exports = queryWrap

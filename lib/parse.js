// The helper methods to parse data

// dependencies
var _ = require('lomath')

/**
 * A conveience method. JSON-stringify the argument, logs it, and return the string.
 * @param  {JSON} arg The JSON to be stringified.
 * @return {string}     the stringified JSON.
 */
/* istanbul ignore next */
function log(arg) {
  var str = JSON.stringify(arg)
  console.log(str)
  return str;
}

/**
 * Beautify neoRes.
 * @param  {Array}  neoRes Neo4j JSON results.
 * @return {Array}     Beautified, sorted result
 */
/* istanbul ignore next */
// function beautify(neoRes) {
//   return _.map(neoRes, beautifyOne)
// }

/**
 * Beautify a single neoRes object.
 * @private
 * @param  {JSON} obj A neoRes object
 * @return {JSON}     Beautified, sorted object
 */
/* istanbul ignore next */
// function beautifyOne(obj) {
//   // use assign
//   var data = obj.data;
//   var extract = _.map(data, function(o) {
//     return _.get(o, 'row')
//   })
//   var sorted = extract.sort()
//   _.assign(obj, {
//     data: sorted
//   })
//   return obj
// }


/**
 * Beautify the entire neoRes by internally calling transform(neoRes) -> array of tables -> beautifyMat on each table -> join('\n\n\n')
 * @param  {Array} neoRes Result from Neo4j
 * @param  {Function} fn A transformer function
 * @return {string}        The beautified neo4j result
 *
 * @example
 * var neoRes = [{"columns":["a"],"data":[{"row":[{"slack__profile__fields ...
 * beautify(neoRes)
 * // => '```
 * "a"
 * 
 * ---
 * 
 * {
 *  "slack__profile__fields__Xf0DAVBL83__alt": "",
 * ...
 * ```'
 *
 * // if supply a transformer
 * function parseUser(userObj) {
 *   return _.pick(userObj, ['name', 'real_name', 'id', 'email_address'])
 * }
 * 
 * beautify(neoRes, parseUser)
 * // => '```
 * "a"
 * 
 * ---
 * 
 * { name: 'alice',
 *   real_name: 'Alice Bloom',
 *   id: 'ID0000001',
 *   email_address: 'alice@email.com' },
 *  ... 
 * ```'
 * 
 */
/* istanbul ignore next */
function beautify(neoRes, fn) {
  return _.map(transform(neoRes, fn), beautifyMat).join('\n\n\n')
}


// var neoRes = [{
//   "columns": ["a"],
//   "data": [{
//     "row": [{
//       "id": "ID0000001",
//       "name": "alice",
//       "email_address": "alice@email.com",
//       "slack__id": "ID0000001",
//       "slack__team_id": "TD0000001",
//       "slack__name": "alice",
//       "slack__deleted": false,
//       "slack__presence": "away",
//       "hash_by": "id",
//       "hash": "ID0000001",
//       "updated_by": "bot",
//       "updated_when": "2016-01-29T16:03:19.592Z"
//     }, {
//       "id": "ID0000002",
//       "name": "bob",
//       "email_address": "bob@email.com",
//       "slack__id": "ID0000002",
//       "slack__team_id": "TD0000002",
//       "slack__name": "bob",
//       "slack__deleted": false,
//       "slack__presence": "away",
//       "hash_by": "id",
//       "hash": "ID0000002",
//       "updated_by": "bot",
//       "updated_when": "2016-01-29T16:03:19.594Z"
//     }, {
//       "id": "USLACKBOT",
//       "name": "slackbot",
//       "real_name": "slackbot",
//       "email_address": null,
//       "slack__id": "USLACKBOT",
//       "slack__team_id": "T07S1438V",
//       "slack__name": "slackbot",
//       "slack__deleted": false,
//       "slack__status": null,
//       "slack__color": "757575",
//       "slack__real_name": "slackbot",
//       "slack__tz": null,
//       "slack__tz_label": "Pacific Standard Time",
//       "slack__tz_offset": -28800,
//       "slack__is_admin": false,
//       "slack__is_owner": false,
//       "slack__is_primary_owner": false,
//       "slack__is_restricted": false,
//       "slack__is_ultra_restricted": false,
//       "slack__is_bot": false,
//       "slack__presence": "active",
//       "hash_by": "id",
//       "hash": "USLACKBOT",
//       "updated_by": "bot",
//       "updated_when": "2016-01-29T16:03:19.594Z"
//     }]
//   }]
// }]

// console.log(beautify(neoRes, parseUser))

/**
 * Beautify a matrix by JSON.stringify -> join('\n\n') -> join('\n\n---\n\n') to separate rows, and wrap with '```'
 * @param  {Array} mat Matrix of data to beautify
 * @return {string}     The beautified matrix string
 *
 * @example
 * var mat = [[{a:1, b:{c:2}}, 0], [{a:3, b:{c:4}}, 1]]
 * beautifyMat(mat)
 * // =>
 * '```
 * {
 *   "a": 1,
 *   "b": {
 *     "c": 2
 *   }
 * }
 * 
 * 0
 * 
 * ---
 * 
 * {
 *   "a": 3,
 *   "b": {
 *     "c": 4
 *   }
 * }
 * 
 * 1
 * ```'
 * 
 */
/* istanbul ignore next */
function beautifyMat(mat) {
  return '```\n' + _.map(mat, function(row) {
    return _.map(row, function(item) {
      return JSON.stringify(item, null, 2)
    }).join('\n\n')
  }).join('\n\n---\n\n') + '\n```'
}

/**
 * Format the entire neoRes into an array of qRes tables.
 * @param  {Array} neoRes Neo4j raw results, neoRes = [q0res, q1res, ...]
 * @param  {Function} fn A transformer to apply to row elements.
 * @return {Array}        neoRes as an array of qRes tables.
 *
 * @example
 * var neoRes = [{"columns":["a"],"data":[{"row":[{"slack__profile__fields ...
 * transform(neoRes)
 * // => [
 * [ [ 'a' ],
 * [ { slack__profile__fields__Xf0DAVBL83__alt: '', 
 * ...]
 * ]
 *
 * // if supply a transformer
 * function parseUser(userObj) {
 *   return _.pick(userObj, ['name', 'real_name', 'id', 'email_address'])
 * }
 * 
 * transform(neoRes, parseUser)
 * // => [
 * [ [ 'a' ],
 * [ { name: 'alice',
 *  real_name: 'Alice Bloom',
 *  id: 'ID0000001',
 *  email_address: 'alice@email.com' },
 *  ... ]
 * ]
 * 
 */
/* istanbul ignore next */
function transform(neoRes, fn) {
  return _.map(neoRes, function(qRes) {
    return transQRes(qRes, fn)
  })
}

/**
 * Format a qRes (query result) inside neoRes into a table.
 * @private
 * @param  {JSON} qRes A {columns, data} pair.
 * @param  {Function} fn A transformer to apply to row elements.
 * @return {Array}      A table with head and body
 *
 * @example
 * var qRes = {"columns":["a"],"data":[{"row":[{"slack__profile__fields ... }
 * transQRes(qRes)
 * // => [ [ 'a' ],
 * [ { slack__profile__fields__Xf0DAVBL83__alt: '', 
 * ...]
 * 
 */
/* istanbul ignore next */
function transQRes(qRes, fn) {
  var head = qRes.columns
  var body = transData(qRes.data, fn)
  body.unshift(head)
  return body
}

/**
 * Format the data array of row objects into plain matrix.
 * @private
 * @param  {Array} data of row objects.
 * @param  {Function} fn A transformer to apply to row elements.
 * @return {Array}      Matrix of data
 *
 * @example
 * var data = [{"row":[{"slack__profile__fields ...
 * transData(data)
 * // => [ [ { slack__profile__fields__Xf0DAVBL83__alt: '', ...}
 * [ { ... }]
 * ...
 * ]
 * 
 * // if supply a transformer
 * function parseUser(userObj) {
 *   return _.pick(userObj, ['name', 'real_name', 'id', 'email_address'])
 * }
 * 
 * transData(data, parseUser)
 * // => [
 * [ { name: 'alice',
 *  real_name: 'Alice Bloom',
 *  id: 'ID0000001',
 *  email_address: 'alice@email.com' },
 *  ... ]
 * ]
 */
/* istanbul ignore next */
function transData(data, fn) {
  fn = fn || _.identity
  return _.map(data, function(obj) {
    return _.map(obj.row, fn)
  })
}



///////////////////////////
// built-in transformers //
///////////////////////////

// parse user object
/* istanbul ignore next */
function parseUser(userObj) {
  return _.pick(userObj, ['name', 'real_name', 'id', 'email_address'])
}



module.exports = {
  log: log,
  beautify: beautify,
  transform: transform,
  parseUser: parseUser
}

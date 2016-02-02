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
 * Transform and beautify the entire neoRes by internally calling transform(neoRes) -> array of tables -> beautifyMat on each table -> join('\n\n\n').  If neoRes has only one qRes, then returns the single transformed table.
 * @param  {Array} neoRes Result from Neo4j
 * @param  {Function|Array} fn A transformer function or many of them in an array
 * @param  {Boolean} [keepHead=false] To drop the header or not.
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
 * a
 * 
 * name: alice
 * id: ID0000001
 * email_address: alice@email.com
 * 
 * ---
 * 
 * name: bob
 * id: ID0000002
 * email_address: bob@email.com
 * 
 * ---
 * 
 * name: slackbot
 * real_name: slackbot
 * id: USLACKBOT
 * email_address: null
 * ```'
 * 
 */
function beautify(neoRes, fn, keepHead) {
  if (_.size(neoRes) == 1) {
    return beautifyMat(transform(neoRes, fn, keepHead))
  } else {
    return _.map(transform(neoRes, fn), beautifyMat).join('\n\n\n')
  }
}


/**
 * Beautify for post-transformation: beautify the transformed neoRes by internally calling array of tables -> beautifyMat on each table -> join('\n\n\n'). Note that neoRes must be transformed beforehand. This is for when transformation happens separately. If neoRes has only one qRes, then returns the single transformed table.
 * @param  {Array} transNeoRes (Transformed) result from Neo4j
 * @param  {Function|Array} fn A transformer function or many of them in an array
 * @return {string}        The beautified neo4j result
 *
 * @example
 * var neoRes = [{"columns":["a"],"data":[{"row":[{"slack__profile__fields ...
 * var transNeoRes = transform(neoRes, parseUser)
 * transBeautify(transNeoRes)
 * // => '```
 * a
 * 
 * name: alice
 * id: ID0000001
 * email_address: alice@email.com
 * 
 * ---
 * 
 * name: bob
 * id: ID0000002
 * email_address: bob@email.com
 * 
 * ---
 * 
 * name: slackbot
 * real_name: slackbot
 * id: USLACKBOT
 * email_address: null
 * ```'
 * 
 */
function transBeautify(transNeoRes) {
  if (!_.isArray(_.get(transNeoRes, '0.0'))) {
    return beautifyMat(transNeoRes)
  } else if (_.size(transNeoRes) == 1) {
    return beautifyMat(transNeoRes[0])
  } else {
    return _.map(transNeoRes, beautifyMat).join('\n\n\n')
  }
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


// // console.log(beautify(neoRes, parseUser))
// var transNeoRes = transform(neoRes)
// transNeoRes = transform(transNeoRes, cleanUser)
// console.log(transBeautify(transNeoRes))


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
  return _.reduce(mat, function(rsum, row) {
    return rsum + _.reduce(row, function(sum, item) {
      return sum + (_.isString(item) ? item : JSON.stringify(item, null, 2)) + '\n\n---\n\n'
    }, '')
  }, '```\n') + '\n```'
}

/**
 * Format the entire neoRes into an array of qRes tables. Can be called multiply for sequential transformation. If neoRes has only one qRes, then returns the single transformed table.
 * @param  {Array} neoRes Neo4j raw results, neoRes = [q0res, q1res, ...], or the transformed neoRes.
 * @param  {Function|Array} fn A transformer function or many of them in an array
 * @param  {Boolean} [keepHead=false] To drop the header or not.
 * @return {Array}        neoRes as an array of qRes tables with transformed elements.
 *
 * @example
 * var neoRes = [{"columns":["a"],"data":[{"row":[{"slack__profile__fields ...
 * neoRes = transform(neoRes)
 * // => [
 * [{ slack__profile__fields__Xf0DAVBL83__alt: '', 
 * ...]
 * ]
 *
 * // if supply a transformer
 * function parseUser(userObj) {
 *   return _.pick(userObj, ['name', 'real_name', 'id', 'email_address'])
 * }
 *
 * // second call in sequence, keep transforming
 * // If neoRes has > 1 qRes table
 * transform(neoRes, parseUser)
 * // => [
 * [{ name: 'alice',
 *  real_name: 'Alice Bloom',
 *  id: 'ID0000001',
 *  email_address: 'alice@email.com' },
 *  ... ]
 * ]
 * 
 * // If neoRes has 1 qRes table, return a non-nested result
 * transform(neoRes, parseUser)
 * // => [{ name: 'alice',
 *  real_name: 'Alice Bloom',
 *  id: 'ID0000001',
 *  email_address: 'alice@email.com' },
 *  ... ]
 * 
 * 
 */
function transform(neoRes, fn, keepHead) {
  if (_.size(neoRes) == 1) {
    return transQRes(neoRes[0], fn, keepHead)
  } else {
    return _.map(neoRes, function(qRes) {
      return transQRes(qRes, fn, keepHead)
    })
  }
}

/**
 * Format a qRes (query result) inside neoRes into a table. By default, dumps its header.
 * @private
 * @param  {JSON|Array} qRes A {columns, data} pair, or the transformed matrix of {columns, data}
 * @param  {Function|Array} fn A transformer function or many of them in an array
 * @param  {Boolean} [keepHead=false] To drop the header or not.
 * @return {Array}      A table with head and body
 *
 * @example
 * var qRes = {"columns":["a"],"data":[{"row":[{"slack__profile__fields ... }
 * transQRes(qRes)
 * // => [{ slack__profile__fields__Xf0DAVBL83__alt: '', 
 * ...]
 * 
 */
/* istanbul ignore next */
function transQRes(qRes, fn, keepHead) {
  keepHead = _.isUndefined(keepHead) ? false : keepHead;

  var body;
  if (qRes.columns) {
    var head = qRes.columns
    body = transData(qRes.data, fn)
  } else {
    var head = _.head(qRes)
    body = transData(_.tail(qRes), fn)
  }
  // if wishes to keep the head
  if (keepHead) {
    body.unshift(head)
  };
  return body
}

/**
 * Format the data array of row objects into plain matrix.
 * @private
 * @param  {Array} data of row objects, or the transformed data.
 * @param  {Function|Array} fn A transformer function or many of them in an array
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
  if (_.isArray(fn)) {
    return _.map(data, function(obj) {
      var row = _.isPlainObject(obj) ? obj.row : obj
      return _.map(row, function(item) {
        // return fn(item)
        return _.reduce(fn, function(sum, f) {
          return f(sum)
        }, item)
      })
    })
  } else {
    return _.map(data, function(obj) {
      var row = _.isPlainObject(obj) ? obj.row : obj
      return _.map(row, fn)
    })
  }
}



///////////////////////////
// built-in transformers //
///////////////////////////


/**
 * Parse a JSON object into array to ['k: v', 'k: v'], where v is attemptedly stringified.
 * @param  {JSON} obj Object to parse
 * @return {Array}     of strings like ['k: v', 'k: v']
 *
 * var obj = {
 *   a: 1,
 *   b: {c:2}
 * }
 * parseKV(obj)
 * // => 'a: 1\nb: {\n  "c": 2\n}'
 * 
 */
function parseKV(obj) {
  return _.map(obj, function(v, k) {
    v = _.isString(v) ? v : JSON.stringify(v, null, 2)
    return k + ': ' + v
  }).join('\n')
}

/**
 * Cleanup the user object by picking out name, real_name, id, email_address.
 * @param  {JSON} userObj The user node property object
 * @return {JSON}         The cleaned prop object
 *
 * @example
 *
 * var user = {
 *   "id": "ID0000001",
 *   "name": "alice",
 *   "email_address": "alice@email.com",
 *   "slack": {
 *     "id": "ID0000001",
 *     "team_id": "TD0000001",
 *     "name": "alice",
 *     "deleted": false,
 *     "presence": "away"
 *   }
 * }
 * 
 * cleanUser(user)
 * // => {
 * //   "id": "ID0000001",
 * //   "name": "alice",
 * //   "email_address": "alice@email.com",
 * // }
 */
function cleanUser(userObj) {
  return _.pick(userObj, ['name', 'real_name', 'id', 'email_address'])
}

/**
 * A beautify transformer method to parse user, picking out name, real_name, id, email_address; uses parseKV internally.
 * @param  {JSON} userObj The user node property object
 * @return {string}         The parsed string of user.
 *
 * @example
 *
 * var user = {
 *   "id": "ID0000001",
 *   "name": "alice",
 *   "email_address": "alice@email.com",
 *   "slack": {
 *     "id": "ID0000001",
 *     "team_id": "TD0000001",
 *     "name": "alice",
 *     "deleted": false,
 *     "presence": "away"
 *   }
 * }
 * parseUser(user)
 * // => 'name: alice
 * // id: ID0000001
 * // email_address: alice@email.com'
 */
function parseUser(userObj) {
  return parseKV(cleanUser(userObj))
}


/**
 * A beautify transformer method to parse object, picking out keys from keyArr; uses parseKV internally.
 * @param  {JSON} obj    The object
 * @param  {Array} keyArr Of key to pick
 * @return {Array}        The parsed string of object.
 */
function parseObj(obj, keyArr) {
  return parseKV(_.pick(obj, keyArr))
}


////////////////////////////////
// Higher level query helpers //
////////////////////////////////

// helper: generates a WHERE tail string to match multiple properties to a single match
// var ws = 'WHERE' + leftJoin(['a.name', 'a.real_name', 'a.id', 'a.email_address'], `=~ "(?i).*${keyword}.*"`)
/**
 * Helper to generate wOp for matching multiple properties to the same value.
 * @param  {Array} propArr Array of strings of prop, may be prepended with the subjects 'a, e, b' or not (defaulted to a.)
 * @param  {string} match   The match operator string.
 * @param  {string} [boolOp='OR']  The boolean to concat these matches together.
 * @return {string}         wOp string.
 *
 * @example
 * var ws = 'WHERE ' + leftJoin(['name', 'real_name', 'a.id', 'a.email_address'], '=~ "(?i).*alice.*"')
 * // => WHERE a.name=~ "(?i).*alice.*" OR a.real_name=~ "(?i).*alice.*" OR a.id=~ "(?i).*alice.*" OR a.email_address=~ "(?i).*alice.*"
 * // note that 'name' and 'real_name' and defaulted to 'a.name' and 'a.real_name'
 *
 * // changing the default operator to AND
 * var ws = 'WHERE' + leftJoin(['name', 'real_name', 'a.id', 'a.email_address'], '=~ "(?i).*alice.*"', 'AND')
 * // => WHERE a.name=~ "(?i).*alice.*" AND a.real_name=~ "(?i).*alice.*" AND a.id=~ "(?i).*alice.*" AND a.email_address=~ "(?i).*alice.*"
 * 
 */
function leftJoin(propArr, match, boolOp) {
  if (!match) {
    throw new Error('Must specify match string, e.g. =~ "(?i).*keyword.*" ')
  };
  boolOp = boolOp || 'OR'
  var subjected = _.map(propArr, function(pStr) {
    return _.includes(pStr, '.') ? pStr : 'a.' + pStr
  })
  return ' ' + _.map(subjected, function(pStr) {
    return pStr + match
  }).join(' ' + boolOp + ' ')
}
/**
 * Generate a function to sort the rows of a matrix passed to it using _.sortBy and iteratees.
 * @param  {Function|Object|string|Array} iteratees Of _.sortBy
 * @return {Function}           To sort rows in, and flatten a taken matrix.
 */
function sorter(iteratees) {
  iteratees = iteratees || ['name']
  return _.partial(_sorter, _, iteratees)
}
// helper for sorter
/* istanbul ignore next*/
function _sorter(mat, iteratees) {
  var size = _.size(mat)
  return _.chunk(_.sortBy(_.flatten(mat), iteratees), size)
}

/**
 * For use with transform. Generate a picker function using _.pick with a supplied iteratees.
 * @param  {string|Array} iteratees Of _.pick
 * @return {Function}           That picks iteratees of its argument.
 */
function picker(iteratees) {
  iteratees = iteratees || ['name']
  return _.partial(_.pick, _, iteratees)
}

/**
 * For use with transform. Generate a picker function using _.pickBy with a supplied iteratees.
 * @param  {string|Array} iteratees Of _.pickBy
 * @return {Function}           That picks by iteratees of its argument.
 */
function pickerBy(iteratees) {
  return _.partial(_.pickBy, _, iteratees)
}


module.exports = {
  log: log,
  beautify: beautify,
  transBeautify: transBeautify,
  beautifyMat: beautifyMat,
  transform: transform,
  parseKV: parseKV,
  cleanUser: cleanUser,
  parseUser: parseUser,
  parseObj: parseObj,
  leftJoin: leftJoin,
  sorter: sorter,
  picker: picker,
  pickerBy,
  pickerBy
}

## Members

<dl>
<dt><a href="#addNode">addNode</a> ⇒ <code>Promise</code></dt>
<dd><p>Adds node(s) to neo4j with a required JSON prop satisfying the KB constraints, and an optional Label string or array.</p>
</dd>
<dt><a href="#getNode">getNode</a> ⇒ <code>Promise</code></dt>
<dd><p>Get node(s) from neo4j with JSON prop, and optional Label.</p>
</dd>
<dt><a href="#addEdge">addEdge</a> ⇒ <code>Promise</code></dt>
<dd><p>Adds edge(s) to neo4j with propLabel of nodes A -&gt; B with the edge E. The propLabel for A and B is an array of a optional non-empty JSON prop (doesn&#39;t have to satisfy KB constraints), and an optional Label string or array. The prop for E must satisfy the KB constraints, and the Label for E is required.</p>
</dd>
<dt><a href="#getEdge">getEdge</a> ⇒ <code>Promise</code></dt>
<dd><p>Get edge(s) from neo4j with propLabel of nodes A -&gt; B with the edge E. The propLabel for A, B and E is an array of a optional non-empty JSON prop (doesn&#39;t have to satisfy KB constraints), and a (optional for A,B; required for E) Label string or array.</p>
</dd>
<dt><a href="#get">get</a> ⇒ <code>Promise</code></dt>
<dd><p>Get graph and do whatever u want with the search results: filter, RETURN, DELETE, DETACH DELETE. Graph: node(s) and edge(s) from neo4j with propLabel of nodes A -&gt; B with the edge E. The propLabel for A, B and E is an array of a optional non-empty JSON prop (doesn&#39;t have to satisfy KB constraints), and a (optional for A,B; required for E) Label string or array.
This is a flexible method used for querying node(s), or optionally edge(s) and node(s). It also takes an optional WHERE filter sentence string, and a required RETURN sentence string.The resultant query string is of the form:
For nodes: MATCH (a:LabelA {propA}) <wOp> <sOp> <rOp>
For nodes and edges: MATCH (a:LabelA {propA})-[e:LabelE ({propE}|*Dist)]-(b:LabelB {propB}) <wOp> <sOp> <rOp> <pOp></p>
</dd>
<dt><a href="#query">query</a> ⇒ <code>Promise</code></dt>
<dd><p>Queries Neo4j with arrays of pairs of query and optional params. Is the right-composition of genStatArr and postQuery.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#beautify">beautify(neoRes)</a> ⇒ <code>Array</code></dt>
<dd><p>Beautify neoRes.</p>
</dd>
</dl>

<a name="addNode"></a>
## addNode ⇒ <code>Promise</code>
Adds node(s) to neo4j with a required JSON prop satisfying the KB constraints, and an optional Label string or array.

**Kind**: global variable  
**Returns**: <code>Promise</code> - From the query.  

| Param | Type | Description |
| --- | --- | --- |
| single_query, | <code>\*</code> | As (fn, \*, \*, ...), e.g. (fn, propLabel) |
| multi_queries | <code>\*</code> | As (fn, [\*], [\*], [\*]...), e.g. (fn, [propLabel0], [propLabel1], ...) |
| multi_queries_one_array | <code>\*</code> | As (fn, [[\*], [\*], [\*]...]), e.g. (fn, [[propLabel0], [propLabel1], ...]) |

**Example**  
```js
var propA = {name: 'A', hash_by: 'name'}
var propB = {name: 'B', hash_by: 'name'}
// legalize the prop objects subject to constraints
cons.legalize(propA)
cons.legalize(propB)
addNode(propA, 'alpha').then(_.flow(JSON.stringify, console.log))
// {"results":[{"columns":["u"],"data":[{"row":[{"created_when":1452801392345,"updated_by":"tester","name":"A","hash_by":"name","created_by":"tester","hash":"A","updated_when":1452802417919}]}]}],"errors":[]}
// The node is added/updated to KB.

// batch node query by array of pairs
addNode([propA, 'alpha'], [propB, 'alpha']).then(_.flow(JSON.stringify, console.log))

// equivalently
addNode([[propA, 'alpha'], [propB, 'alpha']]).then(_.flow(JSON.stringify, console.log))
// {"results":[{"columns":["u"],"data":[{"row":[{"created_when":1452801392345,"updated_by":"tester","name":"A","hash_by":"name","created_by":"tester","hash":"A","updated_when":1452803465461}]}]},{"columns":["u"],"data":[{"row":[{"created_when":1452803465462,"name":"B","updated_by":"tester","hash_by":"name","created_by":"tester","hash":"B","updated_when":1452803465462}]}]}],"errors":[]}
// propA node is updated; propB node is added.
```
<a name="getNode"></a>
## getNode ⇒ <code>Promise</code>
Get node(s) from neo4j with JSON prop, and optional Label.

**Kind**: global variable  
**Returns**: <code>Promise</code> - From the query.  

| Param | Type | Description |
| --- | --- | --- |
| single_query, | <code>\*</code> | As (fn, \*, \*, ...), e.g. (fn, propLabel) |
| multi_queries | <code>\*</code> | As (fn, [\*], [\*], [\*]...), e.g. (fn, [propLabel0], [propLabel1], ...) |
| multi_queries_one_array | <code>\*</code> | As (fn, [[\*], [\*], [\*]...]), e.g. (fn, [[propLabel0], [propLabel1], ...]) |

**Example**  
```js
var prop2 = {name: 'A', hash_by: 'name'}
var prop3 = {name: 'B', hash_by: 'name'}
// no constrain needed when getting node from KB

get nodes from just the prop
getNode(prop2).then(_.flow(JSON.stringify, console.log))
// {"results":[{"columns":["u"],"data":[{"row":[{"created_when":1452807183847,"updated_by":"bot","name":"A","hash_by":"name","created_by":"tester","hash":"A","updated_when":1453244315302}]}]}],"errors":[]}

get nodes from just the label
getNode('alpha').then(_.flow(JSON.stringify, console.log))
// {"results":[{"columns":["u"],"data":[{"row":[{"created_when":1452807183847,"updated_by":"bot","name":"A","hash_by":"name","created_by":"tester","hash":"A","updated_when":1453244315302}]},{"row":[{"created_when":1452807183848,"updated_by":"bot","name":"B","hash_by":"name","created_by":"tester","hash":"B","updated_when":1453244315304}]},{"row":[{"created_when":1453143013572,"updated_by":"bot","name":"C","hash_by":"name","created_by":"bot","hash":"C","updated_when":1453143013572}]}]}],"errors":[]}

// get nodes from a propLabel pair
getNode(prop2, 'alpha').then(_.flow(JSON.stringify, console.log))
// {"results":[{"columns":["u"],"data":[{"row":[{"created_when":1452801392345,"updated_by":"tester","name":"A","hash_by":"name","created_by":"tester","hash":"A","updated_when":1452803465461}]}]}],"errors":[]}

// get nodes from many propLabel pairs
getNode([prop2, 'alpha'], [prop3, 'alpha']).then(_.flow(JSON.stringify, console.log))
// equivalently
getNode([[prop2, 'alpha'], [prop3, 'alpha']]).then(_.flow(JSON.stringify, console.log))
// {"results":[{"columns":["u"],"data":[{"row":[{"created_when":1452801392345,"updated_by":"tester","name":"A","hash_by":"name","created_by":"tester","hash":"A","updated_when":1452803465461}]}]},{"columns":["u"],"data":[{"row":[{"created_when":1452803465462,"updated_by":"tester","name":"B","hash_by":"name","created_by":"tester","hash":"B","updated_when":1452803465462}]}]}],"errors":[]}
```
<a name="addEdge"></a>
## addEdge ⇒ <code>Promise</code>
Adds edge(s) to neo4j with propLabel of nodes A -> B with the edge E. The propLabel for A and B is an array of a optional non-empty JSON prop (doesn't have to satisfy KB constraints), and an optional Label string or array. The prop for E must satisfy the KB constraints, and the Label for E is required.

**Kind**: global variable  
**Returns**: <code>Promise</code> - From the query.  

| Param | Type | Description |
| --- | --- | --- |
| single_query, | <code>\*</code> | As (fn, \*, \*, ...), e.g. (fn, propLabelA, propLabelE, propLabelB) |
| multi_queries | <code>\*</code> | As (fn, [\*], [\*], [\*]...), e.g. (fn, [propLabelA0, propLabelE0, propLabelB0], [propLabelA1, propLabelE1, propLabelB1], ...) |
| multi_queries_one_array | <code>\*</code> | As (fn, [[\*], [\*], [\*]...]), e.g. (fn, [[propLabelA0, propLabelE0, propLabelB0], [propLabelA1, propLabelE1, propLabelB1], ...]) |

**Example**  
```js
var propE = {name: 'lexicography', hash_by: 'name'}
cons.legalize(propE)
var labelE = 'next'
var labelE2 = 'after'
var labelEArr = ['next', 'after']

var propA = {name: 'A', hash_by: 'name'}
var propB = {name: 'B', hash_by: 'name'}
var labelA = 'alpha'
var labelB = 'alpha'

// add edge E from node A to node B
addEdge([propA, labelA], [propE, labelE], [propB, labelB]).then(_.flow(JSON.stringify, console.log))
// {"results":[{"columns":["e"],"data":[{"row":[{"created_when":1452825908415,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"tester","hash":"lexicography","updated_when":1452884323471}]}]},{"columns":["e"],"data":[{"row":[{"created_when":1452884323471,"name":"lexicography","updated_by":"bot","hash_by":"name","created_by":"bot","hash":"lexicography","updated_when":1452884323471}]}]}],"errors":[]}
// The edge labeled 'next' is added/updated to KB.

Constraints only for propE, required Label for edge E. No constraints or requirements for nodes A and B.
// addEdge([propE, labelE], [labelA], [propB, labelB]).then(_.flow(JSON.stringify, console.log))
// {"results":[{"columns":["e"],"data":[{"row":[{"created_when":1452825908415,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"tester","hash":"lexicography","updated_when":1453259876938}]},{"row":[{"created_when":1453259876938,"name":"lexicography","updated_by":"bot","hash_by":"name","created_by":"bot","hash":"lexicography","updated_when":1453259876938}]},{"row":[{"created_when":1453259876938,"name":"lexicography","updated_by":"bot","hash_by":"name","created_by":"bot","hash":"lexicography","updated_when":1453259876938}]}]}],"errors":[]}

// batch edge query by array of pairs
addEdge(
[ [propA, labelA], [propE, labelE], [propB, labelB] ], 
[ [propA, labelA], [propE, labelE2], [propB, labelB] ]
).then(_.flow(JSON.stringify, console.log))

// equivalently
addEdge([
[ [propA, labelA], [propE, labelE], [propB, labelB] ], 
[ [propA, labelA], [propE, labelE2], [propB, labelB] ]
]).then(_.flow(JSON.stringify, console.log))
// {"results":[{"columns":["e"],"data":[{"row":[{"created_when":1452825908415,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"tester","hash":"lexicography","updated_when":1452884568091}]}]},{"columns":["e"],"data":[{"row":[{"created_when":1452884323471,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"bot","hash":"lexicography","updated_when":1452884568091}]}]}],"errors":[]}
// edge 'next' is updated, edge 'after' is added

shorthand for edge with multiple labels but same prop
addEdge([propA, labelA], [propE, labelEArr], [propB, labelB]).then(_.flow(JSON.stringify, console.log))
// {"results":[{"columns":["e"],"data":[{"row":[{"created_when":1452825908415,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"tester","hash":"lexicography","updated_when":1452884620930}]}]},{"columns":["e"],"data":[{"row":[{"created_when":1452884323471,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"bot","hash":"lexicography","updated_when":1452884620930}]}]}],"errors":[]}
```
<a name="getEdge"></a>
## getEdge ⇒ <code>Promise</code>
Get edge(s) from neo4j with propLabel of nodes A -> B with the edge E. The propLabel for A, B and E is an array of a optional non-empty JSON prop (doesn't have to satisfy KB constraints), and a (optional for A,B; required for E) Label string or array.

**Kind**: global variable  
**Returns**: <code>Promise</code> - From the query.  

| Param | Type | Description |
| --- | --- | --- |
| single_query, | <code>\*</code> | As (fn, \*, \*, ...), e.g. (fn, propLabelA, propLabelE, propLabelB) |
| multi_queries | <code>\*</code> | As (fn, [\*], [\*], [\*]...), e.g. (fn, [propLabelA0, propLabelE0, propLabelB0], [propLabelA1, propLabelE1, propLabelB1], ...) |
| multi_queries_one_array | <code>\*</code> | As (fn, [[\*], [\*], [\*]...]), e.g. (fn, [[propLabelA0, propLabelE0, propLabelB0], [propLabelA1, propLabelE1, propLabelB1], ...]) |

**Example**  
```js
var propE = {name: 'lexicography', hash_by: 'name'}
var labelE = 'next'
var labelE2 = 'after'
var labelEArr = ['next', 'after']

var propA = {name: 'A', hash_by: 'name'}
var propB = {name: 'B', hash_by: 'name'}
var labelA = 'alpha'
var labelB = 'alpha'

// The below are equivalent for the added edge above, and show that propLabelA and propLabelB are optional.
getEdge(
 [propE, labelE]
 ).then(_.flow(JSON.stringify, console.log))

getEdge(
 [propE, labelE],
 [propA, labelA]
 ).then(_.flow(JSON.stringify, console.log))

// label is required for E; The rest are optional.
getEdge(
 [labelE],
 [propA]
 ).then(_.flow(JSON.stringify, console.log))
// {"results":[{"columns":["e"],"data":[{"row":[{"created_when":1453143189686,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"bot","hash":"lexicography","updated_when":1453143189686}]},{"row":[{"created_when":1452825908415,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"tester","hash":"lexicography","updated_when":1453259876938}]}]}],"errors":[]}

getEdge(
 [propE, labelE],
 [propA, labelA],
 [propB, labelB]
 ).then(_.flow(JSON.stringify, console.log))
// {"results":[{"columns":["e"],"data":[{"row":[{"created_when":1452825908415,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"tester","hash":"lexicography","updated_when":1452885949550}]}]}],"errors":[]}


// the following are equivalent: batch edge query
getEdge(
 [[propE, labelE] ],
 [[propE, labelE2] ]
 ).then(_.flow(JSON.stringify, console.log))
getEdge([
 [[propE, labelE] ],
 [[propE, labelE2] ]
]).then(_.flow(JSON.stringify, console.log))
// {"results":[{"columns":["e"],"data":[{"row":[{"created_when":1452825908415,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"tester","hash":"lexicography","updated_when":1452885949550}]}]},{"columns":["e"],"data":[{"row":[{"created_when":1452884323471,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"bot","hash":"lexicography","updated_when":1452885949550}]}]}],"errors":[]}

// shorthand: pull multiple edges using multiple labels, and same prop.
getEdge(
 [propE, labelEArr]
 ).then(_.flow(JSON.stringify, console.log))
// {"results":[{"columns":["e"],"data":[{"row":[{"created_when":1452825908415,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"tester","hash":"lexicography","updated_when":1452885949550}]}]},{"columns":["e"],"data":[{"row":[{"created_when":1452884323471,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"bot","hash":"lexicography","updated_when":1452885949550}]}]}],"errors":[]}
```
<a name="get"></a>
## get ⇒ <code>Promise</code>
Get graph and do whatever u want with the search results: filter, RETURN, DELETE, DETACH DELETE. Graph: node(s) and edge(s) from neo4j with propLabel of nodes A -> B with the edge E. The propLabel for A, B and E is an array of a optional non-empty JSON prop (doesn't have to satisfy KB constraints), and a (optional for A,B; required for E) Label string or array.
This is a flexible method used for querying node(s), or optionally edge(s) and node(s). It also takes an optional WHERE filter sentence string, and a required RETURN sentence string.The resultant query string is of the form:
For nodes: MATCH (a:LabelA {propA}) <wOp> <sOp> <rOp>
For nodes and edges: MATCH (a:LabelA {propA})-[e:LabelE ({propE}|*Dist)]-(b:LabelB {propB}) <wOp> <sOp> <rOp> <pOp>

**Kind**: global variable  
**Returns**: <code>Promise</code> - From the query.  

| Param | Type | Description |
| --- | --- | --- |
| single_query, | <code>\*</code> | As (fn, \*, \*, ...), e.g. (fn, [p, L], [p|D, L], [p, L], wOp, rOp) |
| multi_queries | <code>\*</code> | As (fn, [\*], [\*], [\*]...), e.g. (fn, [[p, L], [p|D, L], [p, L], wOp, rOp], [[p, L], [p|D, L], [p, L], wOp, rOp], ...) |
| multi_queries_one_array | <code>\*</code> | As (fn, [[\*], [\*], [\*]...]), e.g. (fn, [[[p, L], [p|D, L], [p, L], wOp, rOp], [[p, L], [p|D, L], [p, L], wOp, rOp], ...]) |

**Example**  
```js
// a rank 1 arguments. 
// Get only node(s)
get([{
  name: 'A'
}, 'alpha'], 'RETURN a').then(_.flow(JSON.stringify, console.log))

// a rank 1 arguments. 
// Delete node(s)
get([{
  name: 'C'
}, 'alpha'], 'DETACH DELETE a').then(_.flow(JSON.stringify, console.log))

// a rank 1 arguments. 
// Get nodes and edges. Note that labelE is optional now
get([{
  name: 'A'
}, 'alpha'], ['*0..1'], 'RETURN b,e').then(_.flow(JSON.stringify, console.log))

// a rank 2 arguments
// Get nodes and edges
get([
  [{
    name: 'A'
  }, 'alpha'],
  ['*0..1', 'next'], 'RETURN b,e'
]).then(_.flow(JSON.stringify, console.log))

// a rank 2 arguments
// Get nodes and edges. Edges can have multiple labels in query; piped
get([
  [{
    name: 'A'
  }, 'alpha'],
  ['*0..1', ['next', 'xiage']], 'RETURN b,e'
]).then(_.flow(JSON.stringify, console.log))
```
<a name="query"></a>
## query ⇒ <code>Promise</code>
Queries Neo4j with arrays of pairs of query and optional params. Is the right-composition of genStatArr and postQuery.

**Kind**: global variable  
**Returns**: <code>Promise</code> - A promise object resolved with the query results from the request module.  

| Param | Type | Description |
| --- | --- | --- |
| ......Pairs | <code>Arrays</code> | Of queries and optional params. |
| query | <code>string</code> | A query string, if the first argument isn't an array. |
| params | <code>JSON</code> | The parameters JSON to the query string, if the first argument isn't an array. |

**Example**  
```js
Normal query string
query('MATCH (n:Alphabet) DETACH DELETE (n)')
.then(_.flow(JSON.stringify, console.log))
// => {"results":[{"columns":[],"data":[]}],"errors":[]}
// Deleted all Alphabet nodes and relations

// query with params, creates multiple nodes at once
query(
['CREATE (n:Alphabet {prop}) RETURN n', 
{
 prop: [{ name: 'a', num: 1}, { name: 'b', num: 2 }]
}]
).then(_.flow(JSON.stringify, console.log))
// => {"results":[{"columns":["n"],"data":[{"row":[{"num":1,"name":"a"}]},{"row":[{"num":2,"name":"b"}]}]}],"errors":[]}
// Added nodes 'a', 'b' to the graph

// multiple queries at once
query(
['CREATE (n:Alphabet {prop}) RETURN n', { prop: [{ name: 'c', num: 3}, { name: 'd', num: 4 }] }],
["MATCH (c),(d) WHERE c.name='c' AND d.name='d' CREATE UNIQUE (c)-[r:Next]->(d) RETURN r"]
).then(_.flow(JSON.stringify, console.log))

// equivalently can nest under one array
query(
[
['CREATE (n:Alphabet {prop}) RETURN n', { prop: [{ name: 'c', num: 3}, { name: 'd', num: 4 }] }],
["MATCH (c),(d) WHERE c.name='c' AND d.name='d' CREATE UNIQUE (c)-[r:Next]->(d) RETURN r"]
]
).then(_.flow(JSON.stringify, console.log))
// => {"results":[{"columns":["n"],"data":[{"row":[{"num":3,"name":"c"}]},{"row":[{"num":4,"name":"d"}]}]},{"columns":["r"],"data":[{"row":[{}]}]}],"errors":[]}
Created nodes 'c', 'd', then added an edge (c)->(d)
```
<a name="beautify"></a>
## beautify(neoRes) ⇒ <code>Array</code>
Beautify neoRes.

**Kind**: global function  
**Returns**: <code>Array</code> - Beautified, sorted result  

| Param | Type | Description |
| --- | --- | --- |
| neoRes | <code>Array</code> | Neo4j JSON results. |


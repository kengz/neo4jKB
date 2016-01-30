## Members

<dl>
<dt><a href="#cons">cons</a> : <code>Object</code></dt>
<dd><p>The constrain object for KB. has many convenience methods.
Call via KB.cons.<method></p>
</dd>
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
<dt><a href="#add">add</a> ⇒ <code>Promise</code></dt>
<dd><p>Get graph and do whatever u want with the search results: filter, RETURN, DELETE, DETACH DELETE. Graph: node(s) and edge(s) from neo4j with propLabel of nodes A -&gt; B with the edge E. The propLabel for A, B and E is an array of a optional non-empty JSON prop (doesn&#39;t have to satisfy KB constraints), and a (optional for A,B; required for E) Label string or array.
This is a flexible method used for querying node(s), or optionally edge(s) and node(s). It also takes an optional WHERE filter sentence string, and a required RETURN sentence string.The resultant query string is of the form:
For nodes: MATCH (a:LabelA {propA}) <wOp> <sOp> <rOp>
For nodes and edges: MATCH (a:LabelA {propA})-[e:LabelE ({propE}|*Dist)]-(b:LabelB {propB}) <wOp> <sOp> <rOp> <pOp></p>
</dd>
<dt><a href="#query">query</a> ⇒ <code>Promise</code></dt>
<dd><p>Queries Neo4j with arrays of pairs of query and optional params. Is the right-composition of genStatArr and postQuery.
This is is query() method with full power, i.e. no query-string cleaning. Use responsibly.
The high level add/get methods call this internall with query-string cleaning to prevent SQL injection.
The query cleaning algorithm is (proven( based on the CFG parse tree and logic. Refer to isLegalSentence().
A sentence is a clause starting with the following query operation specifier: <code>WHERE,SET,REMOVE,RETURN,DELETE,DETACH DELETE,SHORTESTPATH,ALLSHORTESTPATHS</code>
The sentence also consists of variables and operators <op>. The permissible operators by this algorithm are <code>AND,OR,XOR,NOT,=,&lt;&gt;,&lt;,&gt;,&lt;=,&gt;=,IS NULL,IS NOT NULL,+,+=,=~,EXISTS,nodes,labels,keys,&quot;,&quot;,=,ORDER BY,LIMIT,COUNT,sum,avg,percentileDisc,percentileCont,stdev,stdevp,max,min,collect,DISTINCT,nodes,labels,keys</code></p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#log">log(arg)</a> ⇒ <code>string</code></dt>
<dd><p>A conveience method. JSON-stringify the argument, logs it, and return the string.</p>
</dd>
<dt><a href="#beautify">beautify(neoRes, fn)</a> ⇒ <code>string</code></dt>
<dd><p>Beautify the entire neoRes by internally calling transform(neoRes) -&gt; array of tables -&gt; beautifyMat on each table -&gt; join(&#39;\n\n\n&#39;)</p>
</dd>
<dt><a href="#beautifyMat">beautifyMat(mat)</a> ⇒ <code>string</code></dt>
<dd><p>Beautify a matrix by JSON.stringify -&gt; join(&#39;\n\n&#39;) -&gt; join(&#39;\n\n---\n\n&#39;) to separate rows, and wrap with &#39;```&#39;</p>
</dd>
<dt><a href="#transform">transform(neoRes, fn)</a> ⇒ <code>Array</code></dt>
<dd><p>Format the entire neoRes into an array of qRes tables.</p>
</dd>
<dt><a href="#parseKV">parseKV(obj)</a> ⇒ <code>Array</code></dt>
<dd><p>Parse a JSON object into array to [&#39;k: v&#39;, &#39;k: v&#39;], where v is attemptedly stringified.</p>
</dd>
<dt><a href="#cleanUser">cleanUser(userObj)</a> ⇒ <code>JSON</code></dt>
<dd><p>Cleanup the user object by picking out name, real_name, id, email_address.</p>
</dd>
<dt><a href="#parseUser">parseUser(userObj)</a> ⇒ <code>string</code></dt>
<dd><p>A beautify transformer method to parse user, picking out name, real_name, id, email_address; uses parseKV internally.</p>
</dd>
<dt><a href="#parseObj">parseObj(obj, keyArr)</a> ⇒ <code>Array</code></dt>
<dd><p>A beautify transformer method to parse object, picking out keys from keyArr; uses parseKV internally.</p>
</dd>
<dt><a href="#leftJoin">leftJoin(propArr, match, [boolOp])</a> ⇒ <code>string</code></dt>
<dd><p>Helper to generate wOp for matching multiple properties to the same value.</p>
</dd>
</dl>

<a name="cons"></a>
## cons : <code>Object</code>
The constrain object for KB. has many convenience methods.
Call via KB.cons.<method>

**Kind**: global variable  

* [cons](#cons) : <code>Object</code>
    * [.now()](#cons.now) ⇒ <code>string</code>
    * [.legalize(prop, [msg], [hash_by])](#cons.legalize) ⇒ <code>JSON</code>
    * [.isLegalSentence(str)](#cons.isLegalSentence) ⇒ <code>Boolean</code>

<a name="cons.now"></a>
### cons.now() ⇒ <code>string</code>
Generates the current timestamp in ISO 8601 format, e.g. 2016-01-22T14:42:27.579Z

**Kind**: static method of <code>[cons](#cons)</code>  
**Returns**: <code>string</code> - ISO 8601 timestamp string, e.g. '2016-01-22T14:42:27.579Z'  
<a name="cons.legalize"></a>
### cons.legalize(prop, [msg], [hash_by]) ⇒ <code>JSON</code>
Legalize a prop obj by inserting the missing mandatory fields with default values. Automatically flattens the JSON with key delimiter '__' since neo4J doesn't take a deep JSON. Also updates the hash as demanded by 'hash_by', and you can supply the 'hash_by' key as an argument. Mutates the object. Used mainly for testing. Use with care.

**Kind**: static method of <code>[cons](#cons)</code>  
**Returns**: <code>JSON</code> - mutated prop that is now legal wrt the constraints.  

| Param | Type | Description |
| --- | --- | --- |
| prop | <code>JSON</code> | The properties object for KB node. |
| [msg] | <code>JSON</code> | For the robot to extract user id. |
| [hash_by] | <code>string</code> | Specify and set the hash_by key and update it internally. |

**Example**  
```js
var prop = {name: 'A', hash_by: 'name'}
cons.legalize(prop)
// => { name: 'A',
// hash_by: 'name',
// hash: 'A',
// updated_by: 'bot',
// updated_when: 1452802513112 }

// supplying the 'hash_by' key
var prop0 = {name: 'A'}
cons.legalize(prop0, 'name')
// => { name: 'A',
// hash_by: 'name',
// hash: 'A',
// updated_by: 'bot',
// updated_when: 1452802513112 }

var prop1 = {name: 'A', hash_by: 'name', meh: { a:1 }}
cons.legalize(prop1)
// => { name: 'A',
// meh__a: 1,
// hash_by: 'name',
// hash: 'A',
// updated_by: 'bot',
// updated_when: 1452802513112 }
```
<a name="cons.isLegalSentence"></a>
### cons.isLegalSentence(str) ⇒ <code>Boolean</code>
Check if the string is a RETURN operation string and is legal, to prevent SQL injection.
Algo (str):
1. replace "(" and ")" globally
2. split by <op> globally, trim spaces, into variables
3. check if each variable is legally atomic (shan't be split further): either contains no space "\s+" and no quotes "\", \'" at all, or is a proper quoted string with quotes on the boundaries but not the inside.

A sentence is a clause starting with the following query operation specifier: `WHERE,SET,REMOVE,RETURN,DELETE,DETACH DELETE,SHORTESTPATH,ALLSHORTESTPATHS`
The sentence also consists of variables and operators <op>. The permissible operators by this algorithm are `AND,OR,XOR,NOT,=,<>,<,>,<=,>=,IS NULL,IS NOT NULL,+,+=,=~,EXISTS,nodes,labels,keys,",",=,ORDER BY,LIMIT,COUNT,sum,avg,percentileDisc,percentileCont,stdev,stdevp,max,min,collect,DISTINCT,nodes,labels,keys`

Proof: 
Some terminologies: A sentence is a string that can properly evaluate to its output. It consists of operators and variables. Operators (single argument on either side here) operate on a single variable on either side (left and right) to yield another variable.
We can take the CFG parse tree of the whole string, split by the ops. We do not care about operator precedence in checking the legality of the string. Also note that parentheses "(", ")" exists only to assert operator precedence to give an unambiguous parse tree, thus removing them entirely is simply making the tree flat, i.e. all operations run from left to right.
Furthermore, note that from the terminologies we can see that in a sentence, there can only be adjacent occurence of operators, but not of variables. This can also be seen from the parse tree, where the sentence is split by operators, and variables are the leaves. Leaves are always atomic. This justifies our algorithm.

**Kind**: static method of <code>[cons](#cons)</code>  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | A sentence of Ops and Variables. |

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
KB.cons.legalize(propA)
KB.cons.legalize(propB)
addNode(propA, 'alpha').then(KB.log)
// {"results":[{"columns":["u"],"data":[{"row":[{"created_when":1452801392345,"updated_by":"tester","name":"A","hash_by":"name","created_by":"tester","hash":"A","updated_when":1452802417919}]}]}],"errors":[]}
// The node is added/updated to KB.

// batch node query by array of pairs
addNode([propA, 'alpha'], [propB, 'alpha']).then(KB.log)

// equivalently
addNode([[propA, 'alpha'], [propB, 'alpha']]).then(KB.log)
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
getNode(prop2).then(KB.log)
// {"results":[{"columns":["u"],"data":[{"row":[{"created_when":1452807183847,"updated_by":"bot","name":"A","hash_by":"name","created_by":"tester","hash":"A","updated_when":1453244315302}]}]}],"errors":[]}

get nodes from just the label
getNode('alpha').then(KB.log)
// {"results":[{"columns":["u"],"data":[{"row":[{"created_when":1452807183847,"updated_by":"bot","name":"A","hash_by":"name","created_by":"tester","hash":"A","updated_when":1453244315302}]},{"row":[{"created_when":1452807183848,"updated_by":"bot","name":"B","hash_by":"name","created_by":"tester","hash":"B","updated_when":1453244315304}]},{"row":[{"created_when":1453143013572,"updated_by":"bot","name":"C","hash_by":"name","created_by":"bot","hash":"C","updated_when":1453143013572}]}]}],"errors":[]}

// get nodes from a propLabel pair
getNode(prop2, 'alpha').then(KB.log)
// {"results":[{"columns":["u"],"data":[{"row":[{"created_when":1452801392345,"updated_by":"tester","name":"A","hash_by":"name","created_by":"tester","hash":"A","updated_when":1452803465461}]}]}],"errors":[]}

// get nodes from many propLabel pairs
getNode([prop2, 'alpha'], [prop3, 'alpha']).then(KB.log)
// equivalently
getNode([[prop2, 'alpha'], [prop3, 'alpha']]).then(KB.log)
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
KB.cons.legalize(propE)
var labelE = 'next'
var labelE2 = 'after'
var labelEArr = ['next', 'after']

var propA = {name: 'A', hash_by: 'name'}
var propB = {name: 'B', hash_by: 'name'}
var labelA = 'alpha'
var labelB = 'alpha'

// add edge E from node A to node B
addEdge([propA, labelA], [propE, labelE], [propB, labelB]).then(KB.log)
// {"results":[{"columns":["e"],"data":[{"row":[{"created_when":1452825908415,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"tester","hash":"lexicography","updated_when":1452884323471}]}]},{"columns":["e"],"data":[{"row":[{"created_when":1452884323471,"name":"lexicography","updated_by":"bot","hash_by":"name","created_by":"bot","hash":"lexicography","updated_when":1452884323471}]}]}],"errors":[]}
// The edge labeled 'next' is added/updated to KB.

Constraints only for propE, required Label for edge E. No constraints or requirements for nodes A and B.
// addEdge([propE, labelE], [labelA], [propB, labelB]).then(KB.log)
// {"results":[{"columns":["e"],"data":[{"row":[{"created_when":1452825908415,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"tester","hash":"lexicography","updated_when":1453259876938}]},{"row":[{"created_when":1453259876938,"name":"lexicography","updated_by":"bot","hash_by":"name","created_by":"bot","hash":"lexicography","updated_when":1453259876938}]},{"row":[{"created_when":1453259876938,"name":"lexicography","updated_by":"bot","hash_by":"name","created_by":"bot","hash":"lexicography","updated_when":1453259876938}]}]}],"errors":[]}

// batch edge query by array of pairs
addEdge(
[ [propA, labelA], [propE, labelE], [propB, labelB] ], 
[ [propA, labelA], [propE, labelE2], [propB, labelB] ]
).then(KB.log)

// equivalently
addEdge([
[ [propA, labelA], [propE, labelE], [propB, labelB] ], 
[ [propA, labelA], [propE, labelE2], [propB, labelB] ]
]).then(KB.log)
// {"results":[{"columns":["e"],"data":[{"row":[{"created_when":1452825908415,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"tester","hash":"lexicography","updated_when":1452884568091}]}]},{"columns":["e"],"data":[{"row":[{"created_when":1452884323471,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"bot","hash":"lexicography","updated_when":1452884568091}]}]}],"errors":[]}
// edge 'next' is updated, edge 'after' is added

shorthand for edge with multiple labels but same prop
addEdge([propA, labelA], [propE, labelEArr], [propB, labelB]).then(KB.log)
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
 ).then(KB.log)

getEdge(
 [propE, labelE],
 [propA, labelA]
 ).then(KB.log)

// label is required for E; The rest are optional.
getEdge(
 [labelE],
 [propA]
 ).then(KB.log)
// {"results":[{"columns":["e"],"data":[{"row":[{"created_when":1453143189686,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"bot","hash":"lexicography","updated_when":1453143189686}]},{"row":[{"created_when":1452825908415,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"tester","hash":"lexicography","updated_when":1453259876938}]}]}],"errors":[]}

getEdge(
 [propE, labelE],
 [propA, labelA],
 [propB, labelB]
 ).then(KB.log)
// {"results":[{"columns":["e"],"data":[{"row":[{"created_when":1452825908415,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"tester","hash":"lexicography","updated_when":1452885949550}]}]}],"errors":[]}


// the following are equivalent: batch edge query
getEdge(
 [[propE, labelE] ],
 [[propE, labelE2] ]
 ).then(KB.log)
getEdge([
 [[propE, labelE] ],
 [[propE, labelE2] ]
]).then(KB.log)
// {"results":[{"columns":["e"],"data":[{"row":[{"created_when":1452825908415,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"tester","hash":"lexicography","updated_when":1452885949550}]}]},{"columns":["e"],"data":[{"row":[{"created_when":1452884323471,"updated_by":"bot","name":"lexicography","hash_by":"name","created_by":"bot","hash":"lexicography","updated_when":1452885949550}]}]}],"errors":[]}

// shorthand: pull multiple edges using multiple labels, and same prop.
getEdge(
 [propE, labelEArr]
 ).then(KB.log)
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
}, 'alpha'], 'RETURN a').then(KB.log)

// a rank 1 arguments. 
// Delete node(s)
get([{
  name: 'C'
}, 'alpha'], 'DETACH DELETE a').then(KB.log)

// a rank 1 arguments. 
// Get nodes and edges. Note that labelE is optional now
get([{
  name: 'A'
}, 'alpha'], ['*0..1'], 'RETURN b,e').then(KB.log)

// a rank 2 arguments
// Get nodes and edges
get([
  [{
    name: 'A'
  }, 'alpha'],
  ['*0..1', 'next'], 'RETURN b,e'
]).then(KB.log)

// a rank 2 arguments
// Get nodes and edges. Edges can have multiple labels in query; piped
get([
  [{
    name: 'A'
  }, 'alpha'],
  ['*0..1', ['next', 'xiage']], 'RETURN b,e'
]).then(KB.log)
```
<a name="add"></a>
## add ⇒ <code>Promise</code>
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
// nodes
var propA = {
  name: "A",
  hash_by: "name"
}
var propB = {
  name: "B",
  hash_by: "name"
}
KB.cons.legalize(propA)
KB.cons.legalize(propB)
// edge
var propE = {
  name: "E"
}
KB.cons.legalize(propE)

// add a node
add([propA, 'test']).then(KB.log)
// [{"columns":["a"],"data":[{"row":[{"created_when":"2016-01-23T16:21:51.674Z","name":"A","updated_by":"bot","hash_by":"name","created_by":"bot","hash":"A","updated_when":"2016-01-23T16:21:51.674Z"}]}]}]

// add nodes
add([[propA, 'test'], ], [[propB, 'test'], ]).then(KB.log)
// equivalently
add([[[propA, 'test'], ], [[propB, 'test'], ]]).then(KB.log)
// [{"columns":["a"],"data":[{"row":[{"created_when":"2016-01-23T16:21:51.674Z","name":"A","updated_by":"bot","hash_by":"name","created_by":"bot","hash":"A","updated_when":"2016-01-23T16:24:14.242Z"}]}]},{"columns":["a"],"data":[{"row":[{"created_when":"2016-01-23T16:23:53.406Z","name":"B","updated_by":"bot","hash_by":"name","created_by":"bot","hash":"B","updated_when":"2016-01-23T16:24:14.244Z"}]}]}]

// must supply target node if adding edge
add([propA, 'test'], [propE, 'test_next']).then(KB.log)
// Error: You must provide propLabel for either A or A,E,B.

//add edge. Note: don't use the legalized props to search for nodes A, B, otherwise it will want to match every field including the timestamp
add([{name: 'A'}, 'test'], [propE, 'test_next'], [{name: 'B'}, 'test']).then(KB.log)
// [{"columns":["e"],"data":[{"row":[{"created_when":"2016-01-23T16:25:12.706Z","name":"E","updated_by":"bot","hash_by":"hash","created_by":"bot","hash":"test","updated_when":"2016-01-23T16:25:12.706Z"}]}]}]

// add edges
// add([[{name: 'A'}, 'test'], [propE, 'test_next'], [{name: 'B'}, 'test']],
// [[{name: 'A'}, 'test'], [propE, 'test_next_2'], [{name: 'B'}, 'test']]).then(KB.log)
// equivalently
add([{
  name: 'A'
}, 'test'], [propE, ['test_next', 'test_next_2']], [{
  name: 'B'
}, 'test']).then(KB.log)
// [{"columns":["e"],"data":[{"row":[{"created_when":"2016-01-23T16:25:12.706Z","name":"E","updated_by":"bot","hash_by":"hash","created_by":"bot","hash":"test","updated_when":"2016-01-23T16:41:22.955Z"}]}]},{"columns":["e"],"data":[{"row":[{"created_when":"2016-01-23T16:37:55.865Z","name":"E","updated_by":"bot","hash_by":"hash","created_by":"bot","hash":"t
```
<a name="query"></a>
## query ⇒ <code>Promise</code>
Queries Neo4j with arrays of pairs of query and optional params. Is the right-composition of genStatArr and postQuery.
This is is query() method with full power, i.e. no query-string cleaning. Use responsibly.
The high level add/get methods call this internall with query-string cleaning to prevent SQL injection.
The query cleaning algorithm is (proven( based on the CFG parse tree and logic. Refer to isLegalSentence().
A sentence is a clause starting with the following query operation specifier: `WHERE,SET,REMOVE,RETURN,DELETE,DETACH DELETE,SHORTESTPATH,ALLSHORTESTPATHS`
The sentence also consists of variables and operators <op>. The permissible operators by this algorithm are `AND,OR,XOR,NOT,=,<>,<,>,<=,>=,IS NULL,IS NOT NULL,+,+=,=~,EXISTS,nodes,labels,keys,",",=,ORDER BY,LIMIT,COUNT,sum,avg,percentileDisc,percentileCont,stdev,stdevp,max,min,collect,DISTINCT,nodes,labels,keys`

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
.then(KB.log)
// => {"results":[{"columns":[],"data":[]}],"errors":[]}
// Deleted all Alphabet nodes and relations

// query with params, creates multiple nodes at once
query(
['CREATE (n:Alphabet {prop}) RETURN n', 
{
 prop: [{ name: 'a', num: 1}, { name: 'b', num: 2 }]
}]
).then(KB.log)
// => {"results":[{"columns":["n"],"data":[{"row":[{"num":1,"name":"a"}]},{"row":[{"num":2,"name":"b"}]}]}],"errors":[]}
// Added nodes 'a', 'b' to the graph

// multiple queries at once
query(
['CREATE (n:Alphabet {prop}) RETURN n', { prop: [{ name: 'c', num: 3}, { name: 'd', num: 4 }] }],
["MATCH (c),(d) WHERE c.name='c' AND d.name='d' CREATE UNIQUE (c)-[r:Next]->(d) RETURN r"]
).then(KB.log)

// equivalently can nest under one array
query(
[
['CREATE (n:Alphabet {prop}) RETURN n', { prop: [{ name: 'c', num: 3}, { name: 'd', num: 4 }] }],
["MATCH (c),(d) WHERE c.name='c' AND d.name='d' CREATE UNIQUE (c)-[r:Next]->(d) RETURN r"]
]
).then(KB.log)
// => {"results":[{"columns":["n"],"data":[{"row":[{"num":3,"name":"c"}]},{"row":[{"num":4,"name":"d"}]}]},{"columns":["r"],"data":[{"row":[{}]}]}],"errors":[]}
Created nodes 'c', 'd', then added an edge (c)->(d)
```
<a name="log"></a>
## log(arg) ⇒ <code>string</code>
A conveience method. JSON-stringify the argument, logs it, and return the string.

**Kind**: global function  
**Returns**: <code>string</code> - the stringified JSON.  

| Param | Type | Description |
| --- | --- | --- |
| arg | <code>JSON</code> | The JSON to be stringified. |

<a name="beautify"></a>
## beautify(neoRes, fn) ⇒ <code>string</code>
Beautify the entire neoRes by internally calling transform(neoRes) -> array of tables -> beautifyMat on each table -> join('\n\n\n')

**Kind**: global function  
**Returns**: <code>string</code> - The beautified neo4j result  

| Param | Type | Description |
| --- | --- | --- |
| neoRes | <code>Array</code> | Result from Neo4j |
| fn | <code>function</code> | A transformer function |

**Example**  
var neoRes = [{"columns":["a"],"data":[{"row":[{"slack__profile__fields ...
beautify(neoRes)
// => '```
"a"

---

{
 "slack__profile__fields__Xf0DAVBL83__alt": "",
...
```'

// if supply a transformer
function parseUser(userObj) {
  return _.pick(userObj, ['name', 'real_name', 'id', 'email_address'])
}

beautify(neoRes, parseUser)
// => '```
"a"

---

{ name: 'alice',
  real_name: 'Alice Bloom',
  id: 'ID0000001',
  email_address: 'alice@email.com' },
 ... 
```'
<a name="beautifyMat"></a>
## beautifyMat(mat) ⇒ <code>string</code>
Beautify a matrix by JSON.stringify -> join('\n\n') -> join('\n\n---\n\n') to separate rows, and wrap with '```'

**Kind**: global function  
**Returns**: <code>string</code> - The beautified matrix string  

| Param | Type | Description |
| --- | --- | --- |
| mat | <code>Array</code> | Matrix of data to beautify |

**Example**  
var mat = [[{a:1, b:{c:2}}, 0], [{a:3, b:{c:4}}, 1]]
beautifyMat(mat)
// =>
'```
{
  "a": 1,
  "b": {
    "c": 2
  }
}

0

---

{
  "a": 3,
  "b": {
    "c": 4
  }
}

1
```'
<a name="transform"></a>
## transform(neoRes, fn) ⇒ <code>Array</code>
Format the entire neoRes into an array of qRes tables.

**Kind**: global function  
**Returns**: <code>Array</code> - neoRes as an array of qRes tables.  

| Param | Type | Description |
| --- | --- | --- |
| neoRes | <code>Array</code> | Neo4j raw results, neoRes = [q0res, q1res, ...] |
| fn | <code>function</code> | A transformer to apply to row elements. |

**Example**  
```js
var neoRes = [{"columns":["a"],"data":[{"row":[{"slack__profile__fields ...
transform(neoRes)
// => [
[ [ 'a' ],
[ { slack__profile__fields__Xf0DAVBL83__alt: '', 
...]
]

// if supply a transformer
function parseUser(userObj) {
  return _.pick(userObj, ['name', 'real_name', 'id', 'email_address'])
}

transform(neoRes, parseUser)
// => [
[ [ 'a' ],
[ { name: 'alice',
 real_name: 'Alice Bloom',
 id: 'ID0000001',
 email_address: 'alice@email.com' },
 ... ]
]
```
<a name="parseKV"></a>
## parseKV(obj) ⇒ <code>Array</code>
Parse a JSON object into array to ['k: v', 'k: v'], where v is attemptedly stringified.

**Kind**: global function  
**Returns**: <code>Array</code> - of strings like ['k: v', 'k: v']

var obj = {
  a: 1,
  b: {c:2}
}
parseKV(obj)
// => [ 'a: 1', 'b: {\n  "c": 2\n}' ]  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>JSON</code> | Object to parse |

<a name="cleanUser"></a>
## cleanUser(userObj) ⇒ <code>JSON</code>
Cleanup the user object by picking out name, real_name, id, email_address.

**Kind**: global function  
**Returns**: <code>JSON</code> - The cleaned prop object  

| Param | Type | Description |
| --- | --- | --- |
| userObj | <code>JSON</code> | The user node property object |

**Example**  
```js
var user = {
  "id": "ID0000001",
  "name": "alice",
  "email_address": "alice@email.com",
  "slack": {
    "id": "ID0000001",
    "team_id": "TD0000001",
    "name": "alice",
    "deleted": false,
    "presence": "away"
  }
}

cleanUser(user)
// => {
//   "id": "ID0000001",
//   "name": "alice",
//   "email_address": "alice@email.com",
// }
```
<a name="parseUser"></a>
## parseUser(userObj) ⇒ <code>string</code>
A beautify transformer method to parse user, picking out name, real_name, id, email_address; uses parseKV internally.

**Kind**: global function  
**Returns**: <code>string</code> - The parsed string of user.  

| Param | Type | Description |
| --- | --- | --- |
| userObj | <code>JSON</code> | The user node property object |

**Example**  
```js
var user = {
  "id": "ID0000001",
  "name": "alice",
  "email_address": "alice@email.com",
  "slack": {
    "id": "ID0000001",
    "team_id": "TD0000001",
    "name": "alice",
    "deleted": false,
    "presence": "away"
  }
}
parseUser(user)
// => 'name: alice
// id: ID0000001
// email_address: alice@email.com'
```
<a name="parseObj"></a>
## parseObj(obj, keyArr) ⇒ <code>Array</code>
A beautify transformer method to parse object, picking out keys from keyArr; uses parseKV internally.

**Kind**: global function  
**Returns**: <code>Array</code> - The parsed string of object.  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>JSON</code> | The object |
| keyArr | <code>Array</code> | Of key to pick |

<a name="leftJoin"></a>
## leftJoin(propArr, match, [boolOp]) ⇒ <code>string</code>
Helper to generate wOp for matching multiple properties to the same value.

**Kind**: global function  
**Returns**: <code>string</code> - wOp string.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| propArr | <code>Array</code> |  | Array of strings of prop, may be prepended with the subjects 'a, e, b' or not (defaulted to a.) |
| match | <code>string</code> |  | The match operator string. |
| [boolOp] | <code>string</code> | <code>&quot;&#x27;OR&#x27;&quot;</code> | The boolean to concat these matches together. |

**Example**  
```js
var ws = 'WHERE ' + leftJoin(['name', 'real_name', 'a.id', 'a.email_address'], '=~ "(?i).*alice.*"')
// => WHERE a.name=~ "(?i).*alice.*" OR a.real_name=~ "(?i).*alice.*" OR a.id=~ "(?i).*alice.*" OR a.email_address=~ "(?i).*alice.*"
// note that 'name' and 'real_name' and defaulted to 'a.name' and 'a.real_name'

// changing the default operator to AND
var ws = 'WHERE' + leftJoin(['name', 'real_name', 'a.id', 'a.email_address'], '=~ "(?i).*alice.*"', 'AND')
// => WHERE a.name=~ "(?i).*alice.*" AND a.real_name=~ "(?i).*alice.*" AND a.id=~ "(?i).*alice.*" AND a.email_address=~ "(?i).*alice.*"
```

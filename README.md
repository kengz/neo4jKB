# neo4jKB
[![npm version](https://badge.fury.io/js/neo4jkb.svg)](https://badge.fury.io/js/neo4jkb) [![Build Status](https://travis-ci.org/kengz/neo4jKB.svg?branch=master)](https://travis-ci.org/kengz/neo4jKB) [![Coverage Status](https://coveralls.io/repos/github/kengz/neo4jKB/badge.svg?branch=master)](https://coveralls.io/github/kengz/neo4jKB?branch=master) [![Dependency Status](https://gemnasium.com/kengz/neo4jKB.svg)](https://gemnasium.com/kengz/neo4jKB)


A graph knowledge base implemented in neo4j.

## Documentation

Read the docs [here](./API.md). Refer to [test/](./test/) for usage. 

Improvement is still underway, so it will be continuously updated.


## Installation


```shell
npm i --save neo4jkb
```

Ensure that you have `neo4j` installed, and start the server.

## Backup
Use the `neo4j-shell`, files will be saved to `${NEO4J_HOME}`:

Export:

```shell
export-graphml -o backup.graphml -t -r
```

Import:

```shell
import-graphml -i backup.graphml -t
```


## Usage

```js
// import and initialize
var KB = require('neo4jkb')({ NEO4J_AUTH: 'neo4j:neo4j' })

// node label
var labelNode = 'test',
// nodes A, B
propA = KB.cons.legalize({ name: 'A', hash_by: 'name' }),
propB = KB.cons.legalize({ name: 'B', hash_by: 'name' }),

// edge label
labelEdge = 'test_next',
// edge E from (a)-[e]->(b)
propE = cons.legalize({ name: 'E', hash_by: 'name' }),


// build the nodes
function buildNodes() {
  return new Promise(function(resolve, reject) {
    KB.addNode(
      [[A.propA, A.labelNode]],
      [[A.propB, A.labelNode]]
      )
      // .then(A.log)
      .then(resolve)
      .catch(reject)
  })
}

// build the edges
function buildEdges() {
  return new Promise(function(resolve, reject) {
    KB.addEdge(
      // A -> B
      [[A.propA], [A.propE, A.labelEdge], [A.propB]]
      )
      // .then(A.log)
      .then(resolve)
      .catch(reject)
  })
}

// build the graph: first clear the test, then buildNodes, buildEdges
function buildGraph() {
  return new Promise(function(resolve, reject) {
    buildNodes()
    .then(buildEdges)
    .then(resolve)
    .catch(reject)
  })
}


buildGraph()
// A simple graph is built. Go to localhost:7474 to query and see it.

```


#### Tests
To run the test, clone this repo, make sure you set the environment variable `NEO4J_AUTH=<username>:<password>` (or just save an `.env` if you like), then run `npm test`.


## DB migration

[Install](https://github.com/jexp/neo4j-shell-tools/issues/72#issuecomment-182383650) the `neo4j-shell-tools` for db migration; use `export-graphml -o backup.graphml -t -r` and `import-graphml -i backup.graphml -t` from within `neo4j-shell`. Files will be saved to `${NEO4J_HOME}`.


## KB standard (basic)
We use a graph knowledge base (KB) to encode generic knowledge and relationships. The implementation is through a graph database - we choose Neo4j for the purpose. A graph consists of individual nodes connected with edges.


##### A `node`:

- is a unit of knowledge
- encodes type of information by `Labels` - an array of strings.
- encodes information by `prop` - a flat JSON.


##### An `edge`:

- encodes relations between two nodes by a single string `Label`.
- encodes information about the relation by `prop` - a flat JSON.


##### KB constraints:

all nodes and edges must have the following fields in their `prop`: 

- `hash_by`: the field used to hash this node. e.g. name.
- `hash`: the actual hash string, e.g. "document1".
- `updated_by`: The hash-string of the `prop`'s creator.
- `updated_when`: The timestamp of when the author updated the `prop`. Same format as `Date.now()`.
- `created_by`: The hash-string of the `prop`'s updator. Doesn't show in `constrain.js` but is built in to `KB_builder.js`.
- `created_when`: The timestamp of when the author created the `prop`. Doesn't show in `constrain.js` but is built in to `KB_builder.js`.
- external of `prop`, each `node` must have at least zero Labels, and each edge exactly one Label.
- note that although `hash_by` and `hash` are required for edges, it's optional to obey it, i.e. you can utilize the `hash` in your custom `query()`, but `addEdge` will allow for duplicate edge `hash`. In fact, `addEdge` hashes by using `LabelE` and the hash of the source and target nodes, i.e. there can be only one edge of a unique label between two distinct nodes.


##### Permissible graph operations:

- **create/update** `{nodes, edges}`
- **search** `{nodes, edges}` (this is rich, requires data-ordering)
- **delete** `{nodes, edges}`. If delete node => delete edges too. If delete edge, nodes not affected.
- **set/remove** `{nodes, edges}`
- **micro properties**: degree, component, connectivity
- **macro properties**: neighborhood, shortest distance, span, SCC, partition, etc.


##### Authorship

All knowledge must be created by users, thus the `created_by` and `updated_by` are mandatory fields. We keep to using user ID as the hash string since it's the only constant hash, and is universal to all adapters. Whereas the use of username as hash, despite its convenience, is costly whenever it is changed (update is `O(2n)`).

As a tradeoff, we will provide an easy lookup function to yield the user node on inputing an ID, or any node with an authorship. For the timestamp, we will provide a chrono method too. (soon)



## KB standard (extended)
- If global conflict may exist for a hash, localize it per owner-user by `<userHash>#<hashStr>`.
- KB graph path should represent action pattern of action, e.g. `(user1)-[:assigns]->(task)-[:to]->(user2)`, so `(n)-[:to]->(user)` implies `n` is given, or belongs, to `user`. i.e. path/relationship transition
- proper english in cypher, e.g. `(a)-[:assigns]->(t)`, then transition by tenses: `(a)->[:assigned]->(t)`. Deprecation by past-tense. Ohh you can also do continuing tense, like `(c)-[:doing]->(t)`. Preference: `(a)-[:prefers]->(sushi:lunch); (a)-[:prefers]->(cold:weather)`
- advantage: if cypher is so much like english, in fact one can parse a subsbet of english sentences into cypher
- generic auto context-mapper then graph constructor. e.g. for a sentence never been seen before, NLP parse 'gdoc1 refers gdoc2', in the form `(source)-[action]->(outcome)`, as `(gdoc1)-[ref]-(gdoc2)`, so parses `action` to a standard value, .e.g. maps `{links, link, refers, refs} => ref`, using word2vec and metric closeness. Then parse `source` and `outcome` by `MATCH` and `hash`.
- state transition and causality
- `add <notes>` parses into `(kengz)-[adds]->(<notes>)`.


#### Neo4j Use cases
- real time recommendation: by graph expansion and detection of change
- master data management: who's reporting to what task and people
- fraud detection: ohhh can uncover fraud mitigated a few steps away from the source, final in-degree, loops
- graph based search
- identity and access management

#### Advantages
- intuitiveness
- speed
- agility: natural model(schema-free, expansive), proper query language


#### What can be solved by AI exclusively?
- quick KB
- specific automation/proxy task
- secretarial work
- thus most vitally, context awareness and semantic understanding


## Todo
- search engine
- add other macro micro graph property methods
- chronos method
- permission, belongs_to, context tag, priority level


## Changelog

`Jan 2016`

- added `mocha` using `chai` library for test; coverage by `istanbul`.
- **create/update** KB graph methods
- **search** KB graph methods; do whatever u want with the results: `<filter>` then `RETURN|DELETE|DETACH DELETE`
- **delete** KB graph methods from **search**
- **set/remove** KB graph methods
- **shortest-paths** KB graph methods
- **add/get** as unified methods of all above
- timestamp in `cons.now` uses the ISO 8601 format, e.g. `2016-01-22T15:07:25.550Z`
- list the set of permissible query ops
- support `NODE_ENV=development`: all labels created will be prepended with 'test_'. This allows one to isolate the effects of devs and tests from the KB, as well as easy cleaning post-test.
- support sequential transformations
- `cons.legalize` also acts as a quick legal prop constructor
- add `sorter, picker` as transformer methods
- add `flattenIndex` as generic matrix-to-string formatter
- add opsHead to opsRe in `lib/constrain.js` for chaining

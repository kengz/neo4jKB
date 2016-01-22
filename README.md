# neo4jKB
A graph knowledge base implemented in neo4j.

## Installation

```bash
npm i --save neo4jkb
```

More setup instructions soon. See if can do sudo install Java and brew neo4j from npm thru the install executable.

## Todo
- test all
- just use the single pullgraph method to add all add get
- finish other macro micro graph property methods
- test and travis needs to setup neo4j too
- prevent SQL injection in labels and other methods.
- usage docs
- write about special escape chars from query string too, like ':' in labels.
- chronos method
- user lookup function by ID etc
- search search search
- permission, belongs_to, context tag, priority level
- release the set of permissible ops from constrain.js
- neo4j separate DB dont use root. For future multiple deployments too
- node, edge, graph ops without reverting to `query()`
- db migration and recovery
- open up AWS server
- k what bout unit testing the KB part? Setup neo4j?
- Travis CI
- Use `coveralls` pushing to Slack.
- need unflattenJSON method in lomath


## Changelog

`Jan 2016`

- added `mocha` using `chai` library for test; coverage by `istanbul`.
- **create/update** KB graph methods
- **search** KB graph methods; do whatever u want with the results: `<filter>` then `RETURN|DELETE|DETACH DELETE`
- **delete** KB graph methods from **search**
- **set/remove** KB graph methods
- **shortest-paths** KB graph methods
- timestamp in `cons.now` uses the ISO 8601 format, e.g. `2016-01-22T15:07:25.550Z`


## KB standard
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

As a tradeoff, we will prodive an easy lookup function to yield the user node on inputting an ID, or any node with an authorship.

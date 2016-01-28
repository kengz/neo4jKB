var spawnSync = require('child_process').spawnSync;

before(function() {
  console.log('Starting Neo4j:')
  return co(function*() {
    var ss = yield spawnSync('neo4j', ['start'])
    console.log(ss.stdout.toString())
    console.log('This is in ' + process.env.NODE_ENV + ' mode.')
  })
})


after(function() {
  console.log('Stopping Neo4j:')
  return co(function*() {
    yield KB.query('MATCH (a) WHERE filter(x IN labels(a) WHERE x =~ "^test_.*") DETACH DELETE a').catch(console.log)
    console.log('Deleted all test data (with label =~ "^test_.*")');
    // var ss = yield spawnSync('neo4j', ['stop'])
    // console.log(ss.stdout.toString())
  })
})

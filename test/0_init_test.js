var spawnSync = require('child_process').spawnSync;

before(function() {
  console.log('Starting Neo4j:')
  return co(function*() {
    var ss = yield spawnSync('neo4j', ['start'])
    console.log((ss.output||0).toString())
    console.log('This is in ' + process.env.NODE_ENV + ' mode.')
  })
})


after(function() {
  console.log('Stopping Neo4j:')
  return co(function*() {
    yield A.clearTest()
    console.log('Deleted all test data (with label =~ "^test_.*")');
    // var ss = yield spawnSync('neo4j', ['stop'])
    // console.log((ss.output||0).toString())
  })
})

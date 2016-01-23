// suite('pushNode', function() {
//   test('(propLabel)', function() {
//     _.flow(KB.pushNode, A.extractQP, A.log)(A.propLabelA).should.equal('["MERGE (a:test  {hash: {prop}.hash}) ON CREATE SET a = {prop}, a.created_by={prop}.updated_by, a.created_when={prop}.updated_when ON MATCH SET a += {prop} RETURN a",{"prop":{"name":"A","hash_by":"name","hash":"A","updated_by":"bot"}}]')
//   })

// })


suite('addNode', function() {
  suiteSetup(function(done) {
    A.clearTest().then(done)
  })

  teardown(function(done) {
    A.clearTest().then(done)
  })

  test('(propLabel)', function() {
    return KB.addNode(A.propLabelA).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]}]')
  })

  test('([propLabelA], [propLabelB])', function() {
    return KB.addNode([A.propLabelA], [A.propLabelB]).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]},{"columns":["a"],"data":[["B"]]}]')
  })
  test('([[propLabelA], [propLabelB]])', function() {
    return KB.addNode([
      [A.propLabelA],
      [A.propLabelB]
    ]).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]},{"columns":["a"],"data":[["B"]]}]')
  })

})


// suite('pullNode', function() {
//   test('(propLabel)', function() {
//     _.flow(KB.pullNode, A.extractQP, A.log)(A.propLabelA).should.equal('["MATCH (a:test  {name: {prop}.name, hash_by: {prop}.hash_by, hash: {prop}.hash, updated_by: {prop}.updated_by, updated_when: {prop}.updated_when}) RETURN a",{"prop":{"name":"A","hash_by":"name","hash":"A","updated_by":"bot"}}]')
//   })

// })


suite('getNode', function() {
  suiteSetup(function(done) {
    A.buildGraph().then(done)
  })

  suiteTeardown(function(done) {
    A.clearTest().then(done)
  })

  test('(propLabel)', function() {
    return KB.getNode(A.propLabelA).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]}]')
  })

  test('([propLabelA], [propLabelB])', function() {
    return KB.getNode([A.propLabelA], [A.propLabelB]).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]},{"columns":["a"],"data":[["B"]]}]')
  })
  test('([[propLabelA], [propLabelB]])', function() {
    return KB.getNode([
      [A.propLabelA],
      [A.propLabelB]
    ]).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]},{"columns":["a"],"data":[["B"]]}]')
  })

})

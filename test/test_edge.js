suite('addEdge', function() {
  setup(function(done) {
    A.buildGraph().then(done)
  })

  teardown(function(done) {
    A.clearTest().then(done)
  })

  test('(propLabelA, propLabelE, propLabelB)', function() {
    return KB.addEdge(A.propLabelA, A.propLabelE, A.propLabelB).then(KB.beautify).then(KB.log).should.eventually.equal('[{"columns":["e"],"data":[["E"]]}]')
  })

  test('([propLabelA, propLabelE2, propLabelB], [propLabelB, propLabelE2, propLabelC])', function() {
    return KB.addEdge([A.propLabelA, A.propLabelE, A.propLabelB], [A.propLabelB, A.propLabelE2, A.propLabelC]).then(KB.beautify).then(KB.log).should.eventually.equal('[{"columns":["e"],"data":[["E"]]},{"columns":["e"],"data":[["E2"]]}]')
  })

  test('([[propLabelA, propLabelE2, propLabelB], [propLabelB, propLabelE2, propLabelC]])', function() {
    return KB.addEdge([[A.propLabelA, A.propLabelE, A.propLabelB], [A.propLabelB, A.propLabelE2, A.propLabelC]]).then(KB.beautify).then(KB.log).should.eventually.equal('[{"columns":["e"],"data":[["E"]]},{"columns":["e"],"data":[["E2"]]}]')
  })

})


suite('getEdge', function() {
  suiteSetup(function(done) {
    A.buildGraph().then(done)
  })

  suiteTeardown(function(done) {
    A.clearTest().then(done)
  })

  test('(propLabelA, propLabelE, propLabelB)', function() {
    return KB.getEdge(A.propLabelA, A.propLabelE, A.propLabelB).then(KB.beautify).then(KB.string).should.eventually.equal('[{"columns":["e"],"data":[["E"]]}]')
  })

  test('([propLabelA, propLabelE, propLabelB], [propLabelD, propLabelE2, propLabelZ])', function() {
    return KB.getEdge([A.propLabelA, A.propLabelE, A.propLabelB], [A.propLabelD, A.propLabelE2, A.propLabelZ]).then(KB.beautify).then(KB.string).should.eventually.equal('[{"columns":["e"],"data":[["E"]]},{"columns":["e"],"data":[["E2"]]}]')
  })

  test('([[propLabelA, propLabelE, propLabelB], [propLabelD, propLabelE2, propLabelZ]])', function() {
    return KB.getEdge([[A.propLabelA, A.propLabelE, A.propLabelB], [A.propLabelD, A.propLabelE2, A.propLabelZ]]).then(KB.beautify).then(KB.string).should.eventually.equal('[{"columns":["e"],"data":[["E"]]},{"columns":["e"],"data":[["E2"]]}]')
  })

})

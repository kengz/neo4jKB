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

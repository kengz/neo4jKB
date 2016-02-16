suite('addNode', function() {
  suiteSetup(function(done) {
    return A.clearTest().then(function() {
      done()
      return 1
    }).catch(console.log)
  })

  teardown(function(done) {
    return A.clearTest().then(function() {
      done()
      return 1
    }).catch(console.log)
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
    return A.buildGraph().then(function() {
      done()
      return 1
    }).catch(console.log)
  })

  suiteTeardown(function(done) {
    return A.clearTest().then(function() {
      done()
      return 1
    }).catch(console.log)
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

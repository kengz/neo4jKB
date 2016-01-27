suite('addEdge', function() {
  setup(A.buildGraph)

  teardown(A.clearTest)

  test('(propLabelA, propLabelE, propLabelB)', function() {
    return KB.addEdge(A.propLabelA, A.propLabelE, A.propLabelB).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["e"],"data":[["E"]]}]')
  })

  test('([propLabelA, propLabelE2, propLabelB], [propLabelB, propLabelE2, propLabelC])', function() {
    return KB.addEdge([A.propLabelA, A.propLabelE, A.propLabelB], [A.propLabelB, A.propLabelE2, A.propLabelC]).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["e"],"data":[["E"]]},{"columns":["e"],"data":[["E2"]]}]')
  })

  test('([[propLabelA, propLabelE2, propLabelB], [propLabelB, propLabelE2, propLabelC]])', function() {
    return KB.addEdge([
      [A.propLabelA, A.propLabelE, A.propLabelB],
      [A.propLabelB, A.propLabelE2, A.propLabelC]
    ]).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["e"],"data":[["E"]]},{"columns":["e"],"data":[["E2"]]}]')
  })

})


suite('getEdge', function() {
  suiteSetup(A.buildGraph)

  suiteTeardown(A.clearTest)

  test('(propLabelA, propLabelE, propLabelB)', function() {
    return KB.getEdge(A.propLabelA, A.propLabelE, A.propLabelB).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["e"],"data":[["E"]]}]')
  })

  test('([propLabelA, propLabelE, propLabelB], [propLabelD, propLabelE2, propLabelZ])', function() {
    return KB.getEdge([A.propLabelA, A.propLabelE, A.propLabelB], [A.propLabelD, A.propLabelE2, A.propLabelZ]).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["e"],"data":[["E"]]},{"columns":["e"],"data":[["E2"]]}]')
  })

  test('([[propLabelA, propLabelE, propLabelB], [propLabelD, propLabelE2, propLabelZ]])', function() {
    return KB.getEdge([
      [A.propLabelA, A.propLabelE, A.propLabelB],
      [A.propLabelD, A.propLabelE2, A.propLabelZ]
    ]).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["e"],"data":[["E"]]},{"columns":["e"],"data":[["E2"]]}]')
  })

  test('multiedge: (propLabelD, [], propLabelZ, rOp, pOp)', function() {
    return KB.getEdge(A.propLabelDi, [], A.propLabelZi, 'RETURN e').then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["e"],"data":[["E"],["E2"]]}]')
  })

  test('multiedge: (propLabelD, [[labelEdge,labelEdge2]], propLabelZ, rOp, pOp)', function() {
    return KB.getEdge(A.propLabelDi, [
      [A.labelEdge, A.labelEdge2]
    ], A.propLabelZi, 'RETURN e').then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["e"],"data":[["E"],["E2"]]}]')
  })
})

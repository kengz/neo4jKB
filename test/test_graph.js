suite('add', function() {
  suiteSetup(function(done) {
    A.clearTest().then(done)
  })

  suiteTeardown(function(done) {
    A.clearTest().then(done)
  })

  test('add node: (propLabelA)', function() {
    return KB.add(A.propLabelA).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]}]')
  })

  test('add node illegal cons error: (propLabelA)', function() {
    (function() { KB.add(A.propLabelAi) }).should.throw(Error)
  })

  test('must supply target node if adding edge: (propLabelA, propLabelE)', function() {
    (function() { KB.add(A.propLabelA, A.propLabelE) }).should.throw(Error)
  })

  test('add nodes: ([propLabelA,], [propLabelB,])', function() {
    return KB.add([A.propLabelA, ], [A.propLabelB, ]).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]},{"columns":["a"],"data":[["B"]]}]')
  })

  test('add nodes: ([[propLabelA,], [propLabelB,]])', function() {
    return KB.add([A.propLabelA, ], [A.propLabelB, ]).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]},{"columns":["a"],"data":[["B"]]}]')
  })

  test('add edge: (propLabelA, propLabelE, propLabelB)', function() {
    return KB.add(A.propLabelAi, A.propLabelE, A.propLabelBi).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["e"],"data":[["E"]]}]')
  })

  test('add edges: ([propLabelA, propLabelE, propLabelB], [propLabelA, propLabelE2, propLabelB])', function() {
    return KB.add([A.propLabelAi, A.propLabelE, A.propLabelBi], [A.propLabelAi, A.propLabelE2, A.propLabelBi]).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["e"],"data":[["E"]]},{"columns":["e"],"data":[["E2"]]}]')
  })

  test('add edges: ([[propLabelA, propLabelE, propLabelB], [propLabelA, propLabelE2, propLabelB]])', function() {
    return KB.add([
      [A.propLabelAi, A.propLabelE, A.propLabelBi],
      [A.propLabelAi, A.propLabelE2, A.propLabelBi]
    ]).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["e"],"data":[["E"]]},{"columns":["e"],"data":[["E2"]]}]')
  })

})


suite('get', function() {
  setup(function(done) {
    A.buildGraph().then(done)
  })

  teardown(function(done) {
    A.clearTest().then(done)
  })

  test('default rOp: (propLabelA)', function() {
    return KB.get(A.propLabelAi, 'RETURN a').then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]}]')
  })

  test('just nodes: (propLabelA, rOp)', function() {
    return KB.get(A.propLabelAi, 'RETURN a').then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]}]')
  })

  test('just nodes: (propLabelA, wOp, rOp)', function() {
    return KB.get(A.propLabelAi, 'WHERE a.name="A"', 'RETURN a').then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]}]')
  })

  test('just nodes: (propLabelA, wOp, sOp, rOp)', function() {
    return KB.get(A.propLabelAi, 'WHERE a.name="A"', 'SET a.age=10', 'RETURN a').then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]}]')
  })

  test('nodes and edges: (propLabelA, propLabelE, propLabelB, rOp)', function() {
    return KB.get(A.propLabelAi, A.propLabelE, A.propLabelBi, 'RETURN a,e,b').then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a","e","b"],"data":[["A","E","B"]]}]')
  })

  test('degree: (propLabelA, propLabelE, [], rOp)', function() {
    return KB.get(A.propLabelAi, A.distLabelE, [], 'RETURN DISTINCT(b)').then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["b"],"data":[[1],[2],[3],["B"],["C"]]}]')
  })

  test('dist: (propLabelB, distLabelE, [], rOp)', function() {
    return KB.get(A.propLabelBi, A.distLabelE, [], 'RETURN DISTINCT(b)').then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["b"],"data":[["C"],["D"]]}]')
  })

  test('path: (propLabelB, distLabelE, propLabelD, rOp, pOp)', function() {
    return KB.get(A.propLabelBi, A.distLabelE, A.propLabelDi, 'RETURN p', 'SHORTESTPATH').then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["p"],"data":[["B","E","C","E","D"]]}]')
  })

  test('multiedge: (propLabelD, [], propLabelZ, rOp, pOp)', function() {
    return KB.get(A.propLabelDi, [], A.propLabelZi, 'RETURN e').then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["e"],"data":[["E"],["E2"]]}]')
  })

})

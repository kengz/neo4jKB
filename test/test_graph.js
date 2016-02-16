suite('add', function() {
  suiteSetup(function(done) {
    return A.clearTest().then(function() {
      done()
      return 1
    })
  })

  suiteTeardown(function(done) {
    return A.clearTest().then(function() {
      done()
      return 1
    })
  })

  test('add node: (propLabelA)', function() {
    return KB.add(A.propLabelA).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]}]')
  })

  test('add node using cons.legalize({name:"A"}, "name"): (propLabelAl)', function() {
    A.propAl.should.have.property('hash_by')
    A.propAl.hash_by.should.equal('name')
    A.propAl.hash.should.equal('A')
    return KB.add(A.propLabelAl).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]}]')
  })

  test('add node illegal cons error: (propLabelAi)', function() {
    (function() {
      KB.add(A.propLabelAi)
    }).should.throw(Error)
  })

  test('add node illegal cons error msg: (propLabelAi)', function() {
    (function() {
      KB.add(A.propLabelAi)
    }).should.throw(/Node constraints violated: The empty field, undefined, cannot be used as hash as demanded by 'hash_by'/)
  })

  test('must supply target node if adding edge: (propLabelA, propLabelE)', function() {
    (function() {
      KB.add(A.propLabelA, A.propLabelE)
    }).should.throw(Error)
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
    return A.buildGraph().then(function() {
      done()
      return 1
    })
  })

  teardown(function(done) {
    return A.clearTest().then(function() {
      done()
      return 1
    })
  })

  test('default rOp: (propLabelA)', function() {
    return KB.get(A.propLabelAi, 'RETURN a').then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]}]')
  })

  test('nodes: (propLabelA, rOp)', function() {
    return KB.get(A.propLabelAi, 'RETURN a').then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]}]')
  })

  test('nodes: (propLabelA, wOp, rOp)', function() {
    return KB.get(A.propLabelAi, 'WHERE a.name="A"', 'RETURN a').then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]}]')
  })

  test('nodes: (propLabelA, wOp, sOp, rOp)', function() {
    return KB.get(A.propLabelAi, 'WHERE a.name="A"', 'SET a.age=10', 'RETURN a.age').then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a.age"],"data":[[10]]}]')
  })

  test('nodes and edges: (propLabelA, propLabelE, propLabelB, rOp)', function() {
    return KB.get(A.propLabelAi, A.propLabelE, A.propLabelBi, 'RETURN a,e,b').then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a","e","b"],"data":[["A","E","B"]]}]')
  })

  test('nodes and edges: ([propLabelA, propLabelE, propLabelB, rOp], [propLabelB, propLabelE, propLabelC, rOp])', function() {
    return KB.get([A.propLabelAi, A.propLabelE, A.propLabelBi, 'RETURN a,e,b'], [A.propLabelBi, A.propLabelE, A.propLabelCi, 'RETURN a,e,b']).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a","e","b"],"data":[["A","E","B"]]},{"columns":["a","e","b"],"data":[["B","E","C"]]}]')
  })

  test('nodes and edges: ([[propLabelA, propLabelE, propLabelB, rOp], [propLabelB, propLabelE, propLabelC, rOp]])', function() {
    return KB.get([
      [A.propLabelAi, A.propLabelE, A.propLabelBi, 'RETURN a,e,b'],
      [A.propLabelBi, A.propLabelE, A.propLabelCi, 'RETURN a,e,b']
    ]).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a","e","b"],"data":[["A","E","B"]]},{"columns":["a","e","b"],"data":[["B","E","C"]]}]')
  })

  test('nodes and edges: (propLabelA, propLabelE, rOp)', function() {
    return KB.get(A.propLabelAi, A.propLabelE, 'RETURN DISTINCT(b)').then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["b"],"data":[[1],[2],[3],["B"]]}]')
  })

  test('degree: (propLabelA, propLabelE, [], rOp)', function() {
    return KB.get(A.propLabelAi, A.propLabelE, [], 'RETURN DISTINCT(b)').then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["b"],"data":[[1],[2],[3],["B"]]}]')
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

  test('multiedge: (propLabelD, [[labelEdge,labelEdge2]], propLabelZ, rOp, pOp)', function() {
    return KB.get(A.propLabelDi, [
      [A.labelEdge, A.labelEdge2]
    ], A.propLabelZi, 'RETURN e').then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["e"],"data":[["E"],["E2"]]}]')
  })


})

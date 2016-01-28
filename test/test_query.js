suite('query', function() {

  suiteSetup(A.buildGraph)

  suiteTeardown(A.clearTest)

  test('(query)', function() {
    return KB.query('MATCH (a:test_alpha) RETURN a').then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a"],"data":[[1],[2],[3],["A"],["B"],["C"],["D"],["Z"]]}]')
  })

  test('(query, param)', function() {
    return KB.query('MATCH (a:test_alpha {name: {propA}.name}) RETURN a', {
      propA: A.propA
    }).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]}]')
  })

  test('([query, param])', function() {
    return KB.query(['MATCH (a:test_alpha {name: {propA}.name}) RETURN a', {
      propA: A.propA
    }]).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]}]')
  })

  test('([query, param], [query, param])', function() {
    return KB.query(['MATCH (a:test_alpha {name: {propA}.name}) RETURN a', {
      propA: A.propA
    }], ['MATCH (a:test_alpha {name: {propB}.name}) RETURN a', {
      propB: A.propB
    }]).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]},{"columns":["a"],"data":[["B"]]}]')
  })

  test('([[query, param], [query, param]])', function() {
    return KB.query([
      ['MATCH (a:test_alpha {name: {propA}.name}) RETURN a', {
        propA: A.propA
      }],
      ['MATCH (a:test_alpha {name: {propB}.name}) RETURN a', {
        propB: A.propB
      }]
    ]).then(A.extractRes).then(A.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]},{"columns":["a"],"data":[["B"]]}]')
  })

})

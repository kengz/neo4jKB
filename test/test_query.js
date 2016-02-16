suite('query', function() {

  suiteSetup(function(done) {
    return A.buildGraph().then(function() {
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


  suite('literalize', function() {
    test('for node', function() {
      KB.literalize(A.propLabelAi).should.equal('a:test_alpha  {name: {prop_a}.name}')
    })

    test('for node, with identifier name', function() {
      KB.literalize(A.propLabelBi, 'b').should.equal('b:test_alpha  {name: {prop_b}.name}')
    })

    test('for edge with propLabel, using identifier name', function() {
      KB.literalize(A.propLabelEi, 'e').should.equal('e:test_next  {name: {prop_e}.name}')
    })

    test('for edge with distLabel, using identifier name', function() {
      KB.literalize(A.distLabelE, 'e').should.equal('e:test_next  *..2')
    })
  })

})

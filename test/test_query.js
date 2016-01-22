suite('query', function() {
  before(function(done) {
    A.buildGraph().then(done)
  })

  after(function(done) {
    A.clearTest().then(done)
  })

  test('(query)', function() {
    return KB.query('MATCH (a:test) RETURN a').then(KB.beautify).then(KB.string).should.eventually.equal('[{"columns":["a"],"data":[[1],[2],[3],["A"],["B"],["C"],["D"],["Z"]]}]')
  })

  test('(query, param)', function() {
    return KB.query('MATCH (a:test {name: {propA}.name}) RETURN a', {
      propA: A.propA
    }).then(KB.beautify).then(KB.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]}]')
  })

  test('([query, param])', function() {
    return KB.query(['MATCH (a:test {name: {propA}.name}) RETURN a', {
      propA: A.propA
    }]).then(KB.beautify).then(KB.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]}]')
  })

  test('([query, param], [query, param])', function() {
    return KB.query(['MATCH (a:test {name: {propA}.name}) RETURN a', {
      propA: A.propA
    }], ['MATCH (a:test {name: {propB}.name}) RETURN a', {
      propB: A.propB
    }]).then(KB.beautify).then(KB.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]},{"columns":["a"],"data":[["B"]]}]')
  })

  test('([[query, param], [query, param]])', function() {
    return KB.query([
      ['MATCH (a:test {name: {propA}.name}) RETURN a', {
        propA: A.propA
      }],
      ['MATCH (a:test {name: {propB}.name}) RETURN a', {
        propB: A.propB
      }]
    ]).then(KB.beautify).then(KB.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]},{"columns":["a"],"data":[["B"]]}]')
  })

})

suite('query', function() {
  before(function(done) {
    A.buildGraph().then(done)
  })

  test('(query)', function() {
    return KB.query('MATCH (a:test) RETURN a.name').then(KB.beautify).then(KB.string).should.eventually.equal('[{"columns":["a.name"],"data":[[1],[2],[3],["A"],["B"],["C"],["D"],["Z"]]}]')
  })

  test('(query, param)', function() {
    return KB.query('MATCH (a:test {name: {propA}.name}) RETURN a.name', {
      propA: A.propA
    }).then(KB.beautify).then(KB.string).should.eventually.equal('[{"columns":["a.name"],"data":[["A"]]}]')
  })

  test('([query, param])', function() {
    return KB.query(['MATCH (a:test {name: {propA}.name}) RETURN a.name', {
      propA: A.propA
    }]).then(KB.beautify).then(KB.string).should.eventually.equal('[{"columns":["a.name"],"data":[["A"]]}]')
  })

  test('([query, param], [query, param])', function() {
    return KB.query(['MATCH (a:test {name: {propA}.name}) RETURN a.name', {
      propA: A.propA
    }], ['MATCH (a:test {name: {propB}.name}) RETURN a.name', {
      propB: A.propB
    }]).then(KB.beautify).then(KB.string).should.eventually.equal('[{"columns":["a.name"],"data":[["A"]]},{"columns":["a.name"],"data":[["B"]]}]')
  })

  test('([[query, param], [query, param]])', function() {
    return KB.query([
      ['MATCH (a:test {name: {propA}.name}) RETURN a.name', {
        propA: A.propA
      }],
      ['MATCH (a:test {name: {propB}.name}) RETURN a.name', {
        propB: A.propB
      }]
    ]).then(KB.beautify).then(KB.string).should.eventually.equal('[{"columns":["a.name"],"data":[["A"]]},{"columns":["a.name"],"data":[["B"]]}]')
  })

})

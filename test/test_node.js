suite('pushNode', function() {
  suiteSetup(function(done) {
    A.clearTest().then(done)
  })
  
  teardown(function(done) {
    A.clearTest().then(done)
  })


  test('(propLabel)', function() {
    return KB.addNode(A.propLabelA).then(KB.beautify).then(KB.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]}]')
  })

  test('([propLabelA], [propLabelB])', function() {
    return KB.addNode([A.propLabelA], [A.propLabelB]).then(KB.beautify).then(KB.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]},{"columns":["a"],"data":[["B"]]}]')
  })
  test('([[propLabelA], [propLabelB]])', function() {
    return KB.addNode([
      [A.propLabelA],
      [A.propLabelB]
    ]).then(KB.beautify).then(KB.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]},{"columns":["a"],"data":[["B"]]}]')
  })

})


// suite('addNode', function() {
//   before(function(done) {
//     A.clearTest().then(done)
//   })

//   after(function(done) {
//     A.clearTest().then(done)
//   })

//   test('(query)', function() {
//     return KB.query('MATCH (a:test) RETURN a.name').then(KB.beautify).then(KB.string).should.eventually.equal('[{"columns":["a.name"],"data":[[1],[2],[3],["A"],["B"],["C"],["D"],["Z"]]}]')
//   })

// })

// suite('pullNode', function() {
//   before(function(done) {
//     A.clearTest().then(done)
//   })

//   after(function(done) {
//     A.clearTest().then(done)
//   })

//   test('(query)', function() {
//     return KB.query('MATCH (a:test) RETURN a.name').then(KB.beautify).then(KB.string).should.eventually.equal('[{"columns":["a.name"],"data":[[1],[2],[3],["A"],["B"],["C"],["D"],["Z"]]}]')
//   })

// })

// suite('getNode', function() {
//   before(function(done) {
//     A.clearTest().then(done)
//   })

//   after(function(done) {
//     A.clearTest().then(done)
//   })

//   test('(query)', function() {
//     return KB.query('MATCH (a:test) RETURN a.name').then(KB.beautify).then(KB.string).should.eventually.equal('[{"columns":["a.name"],"data":[[1],[2],[3],["A"],["B"],["C"],["D"],["Z"]]}]')
//   })

// })

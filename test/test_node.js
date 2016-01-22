suite('pushNode', function() {
  // before(function(done) {
  //   A.clearTest().then(done)
  // })

  // after(function(done) {
  //   A.clearTest().then(done)
  // })

  test('(prop, Label)', function() {
    return KB.addNode([A.propA, A.labelNode]).then(KB.beautify).then(KB.string).should.eventually.equal('[{"columns":["a"],"data":[["A"]]}]')
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

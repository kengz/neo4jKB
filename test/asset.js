var cons = require('../lib/constrain')
// Assets used in unit tests
var A = {
  label: 'test',
  propA: cons.legalize({ name: 'A', hash_by: 'name' }),
  propB: cons.legalize({ name: 'B', hash_by: 'name' }),
  propC: cons.legalize({ name: 'C', hash_by: 'name' }),
  propD: cons.legalize({ name: 'D', hash_by: 'name' }),
	propZ: cons.legalize({ name: 'Z', hash_by: 'name' }),
}

module.exports = A;
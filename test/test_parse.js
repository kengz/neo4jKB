suite('parse', function() {

  suite('beautify', function() {
    test('(neoRes_single, KB.parseUser)', function() {
      KB.beautify(A.neoRes, KB.parseUser).should.equal('```\nname: alice\nid: ID0000001\nemail_address: alice@email.com\n\n---\n\nname: bob\nid: ID0000002\nemail_address: bob@email.com\n\n---\n\nname: slackbot\nreal_name: slackbot\nid: USLACKBOT\nemail_address: null\n```')
    })

    test('(neoRes_single, KB.parseUser, keepHead)', function() {
      KB.beautify(A.neoRes, KB.parseUser, true).should.equal('```\na\nname: alice\nid: ID0000001\nemail_address: alice@email.com\n\n---\n\nname: bob\nid: ID0000002\nemail_address: bob@email.com\n\n---\n\nname: slackbot\nreal_name: slackbot\nid: USLACKBOT\nemail_address: null\n```')
    })

    test('(neoRes_multiple, KB.parseUser)', function() {
      KB.beautify(_.flatten([A.neoRes, A.neoRes]), KB.parseUser).should.equal('```\nname: alice\nid: ID0000001\nemail_address: alice@email.com\n\n---\n\nname: bob\nid: ID0000002\nemail_address: bob@email.com\n\n---\n\nname: slackbot\nreal_name: slackbot\nid: USLACKBOT\nemail_address: null\n```\n\n\n```\nname: alice\nid: ID0000001\nemail_address: alice@email.com\n\n---\n\nname: bob\nid: ID0000002\nemail_address: bob@email.com\n\n---\n\nname: slackbot\nreal_name: slackbot\nid: USLACKBOT\nemail_address: null\n```')
    })
  })

  suite('transBeautify', function() {
    test('(string)', function() {
      KB.transBeautify('name: alice\nid: ID0000001\nemail_address: alice@email.com\n\n---\n\nname: bob\nid: ID0000002\nemail_address: bob@email.com\n\n---\n\nname: slackbot\nreal_name: slackbot\nid: USLACKBOT\nemail_address: null').should.equal('```\nname: alice\nid: ID0000001\nemail_address: alice@email.com\n\n---\n\nname: bob\nid: ID0000002\nemail_address: bob@email.com\n\n---\n\nname: slackbot\nreal_name: slackbot\nid: USLACKBOT\nemail_address: null\n```')
    })
    test('(transNeoRes_single)', function() {
      KB.transBeautify(KB.transform(A.neoRes, KB.parseUser)).should.equal('```\nname: alice\nid: ID0000001\nemail_address: alice@email.com\n\n---\n\nname: bob\nid: ID0000002\nemail_address: bob@email.com\n\n---\n\nname: slackbot\nreal_name: slackbot\nid: USLACKBOT\nemail_address: null\n```')
    })

    test('(transNeoRes_multiple)', function() {
      KB.transBeautify(KB.transform(_.flatten([A.neoRes, A.neoRes]), KB.parseUser)).should.equal('```\nname: alice\nid: ID0000001\nemail_address: alice@email.com\n\n---\n\nname: bob\nid: ID0000002\nemail_address: bob@email.com\n\n---\n\nname: slackbot\nreal_name: slackbot\nid: USLACKBOT\nemail_address: null\n```\n\n\n```\nname: alice\nid: ID0000001\nemail_address: alice@email.com\n\n---\n\nname: bob\nid: ID0000002\nemail_address: bob@email.com\n\n---\n\nname: slackbot\nreal_name: slackbot\nid: USLACKBOT\nemail_address: null\n```')
    })
  })

  suite('transform', function() {
    test('(neoRes_single, KB.parseUser)', function() {
      KB.transform(A.neoRes, KB.parseUser).should.eql([
        ['name: alice\nid: ID0000001\nemail_address: alice@email.com',
          'name: bob\nid: ID0000002\nemail_address: bob@email.com',
          'name: slackbot\nreal_name: slackbot\nid: USLACKBOT\nemail_address: null'
        ]
      ])
    })

    test('(neoRes_single, KB.parseUser, keepHead)', function() {
      KB.transform(A.neoRes, KB.parseUser, true).should.eql([
        ['a'],
        ['name: alice\nid: ID0000001\nemail_address: alice@email.com',
          'name: bob\nid: ID0000002\nemail_address: bob@email.com',
          'name: slackbot\nreal_name: slackbot\nid: USLACKBOT\nemail_address: null'
        ]
      ])
    })

    test('(neoRes_multiple, KB.parseUser)', function() {
      KB.transform(_.flatten([A.neoRes, A.neoRes]), KB.parseUser).should.eql([
        [
          ['name: alice\nid: ID0000001\nemail_address: alice@email.com',
            'name: bob\nid: ID0000002\nemail_address: bob@email.com',
            'name: slackbot\nreal_name: slackbot\nid: USLACKBOT\nemail_address: null'
          ]
        ],
        [
          ['name: alice\nid: ID0000001\nemail_address: alice@email.com',
            'name: bob\nid: ID0000002\nemail_address: bob@email.com',
            'name: slackbot\nreal_name: slackbot\nid: USLACKBOT\nemail_address: null'
          ]
        ]
      ])
    })

  })

  suite('transform**', function() {
    test('(transform(neoRes), KB.parseUser)', function() {
      KB.transform(A.neoRes, KB.parseUser).should.eql([
        ['name: alice\nid: ID0000001\nemail_address: alice@email.com',
          'name: bob\nid: ID0000002\nemail_address: bob@email.com',
          'name: slackbot\nreal_name: slackbot\nid: USLACKBOT\nemail_address: null'
        ]
      ])
    })
  })

  suite('transform[**]', function() {
    test('(transform(neoRes, [KB.cleanUser, KB.parseUser])', function() {
      KB.transform(A.neoRes, [KB.cleanUser, KB.parseUser]).should.eql([
        ['name: alice\nid: ID0000001\nemail_address: alice@email.com',
          'name: bob\nid: ID0000002\nemail_address: bob@email.com',
          'name: slackbot\nreal_name: slackbot\nid: USLACKBOT\nemail_address: null'
        ]
      ])
    })
  })

  suite('parseKV', function() {
    test('(obj)', function() {
      KB.parseKV(A.obj).should.equal('a: 0\nb: {\n  "c": 1\n}\nd: [\n  2,\n  3,\n  4\n]')
    })
  })

  suite('cleanUser', function() {
    test('(user)', function() {
      KB.cleanUser(A.user).should.eql({
        "id": "ID0000001",
        "name": "alice",
        "email_address": "alice@email.com",
      })
    })
  })

  suite('parseUser', function() {
    test('(user)', function() {
      KB.parseUser(A.user).should.equal('name: alice\nid: ID0000001\nemail_address: alice@email.com')
    })
  })

  suite('parseObj', function() {
    test('(obj)', function() {
      KB.parseObj(A.user, ['name', 'real_name', 'id', 'email_address']).should.equal('name: alice\nid: ID0000001\nemail_address: alice@email.com')
    })
  })

})


suite('query helpers', function() {

  suite('leftJoin', function() {
    test('(propArr, match)', function() {
      KB.leftJoin(['name', 'real_name', 'a.id', 'a.email_address'], '=~ "(?i).*alice.*"').should.equal(' a.name=~ "(?i).*alice.*" OR a.real_name=~ "(?i).*alice.*" OR a.id=~ "(?i).*alice.*" OR a.email_address=~ "(?i).*alice.*"')
    })

    test('(propArr, match, boolOp)', function() {
      KB.leftJoin(['name', 'real_name', 'a.id', 'a.email_address'], '=~ "(?i).*alice.*"', 'AND').should.equal(' a.name=~ "(?i).*alice.*" AND a.real_name=~ "(?i).*alice.*" AND a.id=~ "(?i).*alice.*" AND a.email_address=~ "(?i).*alice.*"')
    })

  })


  suite('sorter', function() {
    test('default iteratees = ["name"], (neoRes)', function() {
      KB.sorter()(KB.transform(A.neoRes, KB.cleanUser)).should.eql([
        [{
          name: 'alice',
          id: 'ID0000001',
          email_address: 'alice@email.com'
        }],
        [{
          name: 'bob',
          id: 'ID0000002',
          email_address: 'bob@email.com'
        }],
        [{
          name: 'slackbot',
          real_name: 'slackbot',
          id: 'USLACKBOT',
          email_address: null
        }]
      ])
    })

    test('default iteratees = ["name"], (_.flatten(neoRes))', function() {
      KB.sorter()(_.flatten(KB.transform(A.neoRes, KB.cleanUser))).should.eql([
        [{
          name: 'alice',
          id: 'ID0000001',
          email_address: 'alice@email.com'
        }, {
          name: 'bob',
          id: 'ID0000002',
          email_address: 'bob@email.com'
        }, {
          name: 'slackbot',
          real_name: 'slackbot',
          id: 'USLACKBOT',
          email_address: null
        }]
      ])
    })

    test('iteratees = ["id"], (neoRes)', function() {
      KB.sorter(['id'])(KB.transform(A.neoRes, KB.cleanUser)).should.eql([
        [{
          name: 'alice',
          id: 'ID0000001',
          email_address: 'alice@email.com'
        }],
        [{
          name: 'bob',
          id: 'ID0000002',
          email_address: 'bob@email.com'
        }],
        [{
          name: 'slackbot',
          real_name: 'slackbot',
          id: 'USLACKBOT',
          email_address: null
        }]
      ])
    })

  })


  suite('picker', function() {
    test('default iteratees = ["name"]', function() {
      KB.transform(A.neoRes, KB.picker()).should.eql([
        [{
          name: 'alice'
        }, {
          name: 'bob'
        }, {
          name: 'slackbot'
        }]
      ])
    })

    test('default iteratees = ["name"]', function() {
      KB.transform(A.neoRes, KB.picker()).should.eql([
        [{
          name: 'alice'
        }, {
          name: 'bob'
        }, {
          name: 'slackbot'
        }]
      ])
    })

    test('iteratees = ["id"]', function() {
      KB.transform(A.neoRes, KB.picker(['id'])).should.eql([
        [{
          id: 'ID0000001'
        }, {
          id: 'ID0000002'
        }, {
          id: 'USLACKBOT'
        }]
      ])
    })

  })


  suite('pickerBy', function() {
    test('iteratees = _.isBoolean', function() {
      KB.transform(A.neoRes, KB.pickerBy(_.isBoolean)).should.eql([
        [{
          "slack__deleted": false
        }, {
          "slack__deleted": false
        }, {
          "slack__deleted": false,
          "slack__is_admin": false,
          "slack__is_bot": false,
          "slack__is_owner": false,
          "slack__is_primary_owner": false,
          "slack__is_restricted": false,
          "slack__is_ultra_restricted": false
        }]
      ])
    })

  })


  suite('flattenIndex', function() {
    test('matrix of JSON', function() {
      var mat = KB.sorter(['id'])(KB.transform(A.neoRes, KB.cleanUser))
      KB.flattenIndex(mat).should.eql('0. alice\nid: ID0000001\nemail_address: alice@email.com\n1. bob\nid: ID0000002\nemail_address: bob@email.com\n2. slackbot\nreal_name: slackbot\nid: USLACKBOT\nemail_address: null')
    })

    test('matrix of string', function() {
      var mat = KB.transform(A.neoRes, [KB.cleanUser, _.values, _.first])
      KB.flattenIndex(mat).should.eql('0. alice\n1. bob\n2. slackbot')
    })

  })


})

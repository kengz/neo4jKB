suite('parse', function() {

  suite('beautify', function() {
    test('(neoRes, KB.parseUser)', function() {
      KB.beautify(A.neoRes, KB.parseUser).should.equal('```\na\n\nname: alice\nid: ID0000001\nemail_address: alice@email.com\n\n---\n\nname: bob\nid: ID0000002\nemail_address: bob@email.com\n\n---\n\nname: slackbot\nreal_name: slackbot\nid: USLACKBOT\nemail_address: null\n```')
    })
  })

  suite('transform', function() {
    test('(neoRes, KB.parseUser)', function() {
      console.log(KB.transform(A.neoRes, KB.parseUser))
      KB.transform(A.neoRes, KB.parseUser).should.eql([
        [
          ['a'],
          ['name: alice\nid: ID0000001\nemail_address: alice@email.com',
            'name: bob\nid: ID0000002\nemail_address: bob@email.com',
            'name: slackbot\nreal_name: slackbot\nid: USLACKBOT\nemail_address: null'
          ]
        ]
      ])
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

  suite('parseKV', function() {
    test('(obj)', function() {
      KB.parseKV(A.obj).join('\n').should.equal('a: 0\nb: {\n  "c": 1\n}\nd: [\n  2,\n  3,\n  4\n]')
    })
  })

  suite('parseUser', function() {
    test('(user)', function() {
      KB.parseUser(A.user).should.equal('name: alice\nid: ID0000001\nemail_address: alice@email.com')
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
})

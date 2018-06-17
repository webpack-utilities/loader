const { resource } = require('../../src/index.js')

describe('resource.parseString()', () => {
  [
    [
      'string',
      'string'
    ],
    [
      JSON.stringify("!\'§$%&/()=?'*#+,.-;öäü:_test"), "!\'§$%&/()=?'*#+,.-;öäü:_test"
    ],
    [
      "escaped with single \''",
      "escaped with single \'"
    ],
    [
      "invalid \'' string",
      "invalid \'' string"
    ],
    [
      '\'inconsistent start and end\'',
      '\'inconsistent start and end\''
    ]
  ].forEach((t) => {
    test(`should parse ${t[0]}`, () => {
      const parsed = resource.parseString(t[0])

      expect(parsed).toEqual(parsed, t[1])
    })
  })
})

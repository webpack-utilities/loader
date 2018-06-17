const { resource } = require('../../src/index.js')

describe('resource.getHash()', () => {
  [
    [
      'test string',
      'md5',
      'hex',
      undefined,
      '6f8db599'
    ],
    [
      'test string',
      'md5',
      'hex',
      4,
      '6f8d'
    ],
    [
      'test string',
      'md5',
      'base64',
      undefined,
      'b421md6Y'
    ],
    [
      'test string',
      'sha512',
      'base64',
      undefined,
      'EObWR69E'
    ],
    [
      'test string',
      'md5',
      'hex',
      undefined,
      '6f8db599'
    ]
  ].forEach((t) => {
    test(`should getHash ${t[0]} ${t[1]} ${t[2]} ${t[3]}`, () => {
      const hash = resource.getHash(t[0], t[1], t[2], t[3])

      expect(hash).toEqual(t[4])
    })
  })
})

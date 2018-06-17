const { resource } = require('../../src/index.js')

describe('resource.parseQuery', () => {
  describe('Success', () => {
    [
      {
        it: 'should return an empty object by default',
        query: '?',
        expected: {}
      },
      {
        it: 'should parse query params',
        query: '?name=cheesecake&slices=8&delicious&warm=false',
        expected: {
          delicious: true,
          name: 'cheesecake',
          slices: '8',  // numbers are still strings with query params
          warm: false
        }
      },
      {
        it: 'should parse query params with arrays',
        query: '?ingredients[]=flour&ingredients[]=sugar',
        expected: {
          ingredients: ['flour', 'sugar']
        }
      },
      {
        it: 'should parse query params in JSON format',
        query: '?' + JSON.stringify({
          delicious: true,
          name: 'cheesecake',
          slices: 8,
          warm: false
        }),
        expected: {
          delicious: true,
          name: 'cheesecake',
          slices: 8,
          warm: false
        }
      },
      {
        it: 'should use decodeURIComponent',
        query: '?%3d',
        expected: { '=': true }
      },
      {
        it: 'should recognize params starting with + as boolean params with the value true',
        query: '?+%3d',
        expected: { '=': true }
      },
      {
        it: 'should recognize params starting with - as boolean params with the value false',
        query: '?-%3d',
        expected: { '=': false }
      },
      {
        it: 'should not confuse regular equal signs and encoded equal signs',
        query: '?%3d=%3D',
        expected: { '=': '=' }
      }
    ].forEach((t) => {
      test(t.it, () => {
        const query = resource.parseQuery(t.query)

        expect(query).toEqual(t.expected)
      })
    })
  })

  describe('Error', () => {
    test('Message', () => {
      const err = () => resource.parseQuery('a')

      expect(err).toThrow("A valid query string passed to parseQuery should begin with '?'")
    })
  })
})

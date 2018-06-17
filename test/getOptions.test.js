const { getOptions } = require('../src/index.js')

describe('getOptions()', () => {
  test('when loader.query is a `{String}` with length > 0', () => {
    expect(
      getOptions({
        query: '?something=getOptions_cannot_parse'
      })
    ).toEqual({ something: 'getOptions_cannot_parse' })
  })

  test('when loader.query is an empty `{String}`', () => {
    expect(
      getOptions({
        query: ''
      })
    ).toEqual(null)
  })


  test('when loader.query is an {Object}', () => {
    const query = {}

    expect(
      getOptions({
        query
      })
    ).toEqual(query)
  })

  test('when loader.query is an {Array}', () => {
    const query = []

    expect(
      getOptions({
        query
      })
    ).toEqual(query)
  })

  test('when loader.query is anything else', () => {
    expect(
      getOptions({
        query: undefined
      })
    ).toEqual(null)

    expect(
      getOptions({
        query: null
      })
    ).toEqual(null)
    

    expect(
      getOptions({
        query: 1
      })
    ).toEqual(null)

    expect(
      getOptions({
        query: 0
      })
    ).toEqual(null)
  })
})

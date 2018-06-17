const JSON5 = require('json5')

const BOOLEANS = {
  'null': null,
  'true': true,
  'false': false
}

function parseQuery (query) {
  if (query.substr(0, 1) !== '?') {
    throw new Error(
      `A valid query string passed to parseQuery should begin with '?'`
    )
  }

  query = query.substr(1)

  if (!query) {
    return {}
  }

  if (query.substr(0, 1) === '{' && query.substr(-1) === '}') {
    return JSON5.parse(query)
  }

  const args = query.split(/[,&]/g)
  const result = {}

  args.forEach((arg) => {
    const idx = arg.indexOf('=')

    if (idx >= 0) {
      let name = arg.substr(0, idx)
      let value = decodeURIComponent(arg.substr(idx + 1))

      if (BOOLEANS.hasOwnProperty(value)) {
        value = BOOLEANS[value]
      }

      if (name.substr(-2) === '[]') {
        name = decodeURIComponent(name.substr(0, name.length - 2))

        if(!Array.isArray(result[name])) {
          result[name] = []
        }

        result[name].push(value)
      } else {
        name = decodeURIComponent(name)

        result[name] = value
      }
    } else {
      if (arg.substr(0, 1) === '-') {
        name = decodeURIComponent(arg.substr(1))

        result[name] = false
      } else if (arg.substr(0, 1) === '+') {
        name = decodeURIComponent(arg.substr(1))

        result[name] = true
      } else {
        name = decodeURIComponent(arg)

        result[name] = true
      }
    }
  })

  return result
}

module.exports = parseQuery

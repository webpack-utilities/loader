const parseQuery = require('./resource/parseQuery.js')

function getOptions (loader) {
  const { query } = loader

  if (typeof query === 'string' && query !== '') {
    return parseQuery(loader.query)
  }

  if (!query || typeof query !== 'object') {
    return null
  }

  return query
}

module.exports = getOptions

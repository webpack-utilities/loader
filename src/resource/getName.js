const path = require('path')

const getHash = require('./getHash.js')

const HASH_RE = /\[(?:([^:]+):)?hash(?::([a-z]+\d*))?(?::(\d+))?\]/ig

function getName (loader, name, options) {
  let filename

  if (typeof name === 'function') {
    filename = name(loader.resourcePath)
  } else {
    filename = name || '[hash].[ext]'
  }

  const regExp = options.regExp
  const context = options.context
  const content = options.content

  let folder = ''
  let dirname = ''
  let extname = 'bin'
  let basename = 'file'

  if (loader.resourcePath) {
    const parsed = path.parse(loader.resourcePath)

    let resourcePath = loader.resourcePath

    if (parsed.ext) {
      extname = parsed.ext.substr(1)
    }

    if (parsed.dir) {
      basename = parsed.name
      resourcePath = parsed.dir + path.sep
    }

    if (typeof context !== 'undefined') {
      dirname = path
        .relative(context, resourcePath + '_')
        .replace(/\\/g, '/')
        .replace(/\.\.(\/)?/g, '_$1')

      dirname = dirname.substr(0, dirname.length - 1)
    } else {
      dirname = resourcePath
        .replace(/\\/g, '/')
        .replace(/\.\.(\/)?/g, '_$1')
    }
    if (dirname.length === 1) {
      dirname = ''
    } else if (dirname.length > 1) {
      folder = path.basename(dirname)
    }
  }

  let url = filename

  if (content) {
    url = url.replace(HASH_RE, ($, type, digest, length) => {
      if (length) {
        length = parseInt(length, 10)
      }

      return getHash(content, type, digest, length)
    })
  }

  url = url
    .replace(/\[ext\]/ig, () => extname)
    .replace(/\[name\]/ig, () => basename)
    .replace(/\[path\]/ig, () => dirname)

  if (regExp && loader.resourcePath) {
    const match = loader.resourcePath.match(new RegExp(regExp))

    match && match.forEach((matched, i) => {
      url = url.replace(new RegExp(`\\[${i}\\]`, 'ig'), matched)
    })
  }

  return url
}

module.exports = getName

const crypto = require('crypto')

function getHash (buffer, type = 'md4', digest = 'hex', length = 8) {
  return crypto
    .createHash(type)
    .update(buffer)
    .digest(digest)
    .substr(0, length)
}

module.exports = getHash

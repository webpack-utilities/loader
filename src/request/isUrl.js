const URL_RE = /^data:|^chrome-extension:|^moz-extension:|^ms-browser-extension:|^(https?:)?\/\/|^[\{\}\[\]#*;,'§\$%&\(=?`´\^°<>]/

function isUrl(url, root) {
  // An URL is not an request if
  // 1. it's a Data Url
  // 2. it's an absolute url or and protocol-relative
  // 3. it's some kind of url for a template
  if (URL_RE.test(url)) {
    return false
  }
  // 4. It's also not an request if root isn't set and it's a root-relative url
  if (!root && /^\//.test(url)) {
    return false
  }

  return true
}

module.exports = isUrl

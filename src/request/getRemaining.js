function getRemaining (loader) {
  if (loader.remainingRequest) {
    return loader.remainingRequest
  }

  const request = loader.loaders
    .slice(loader.loaderIndex + 1)
    .map((l) => l.request)
    .concat([ loader.resource ])

  return request.join("!")
}

module.exports = getRemaining

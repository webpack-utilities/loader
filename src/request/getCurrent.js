function getCurrentRequest (ctx) {
  if(ctx.currentRequest) {
    return ctx.currentRequest
  }

  const request = ctx.loaders
    .slice(ctx.loaderIndex)
    .map((loader) => loader.request)
    .concat([ ctx.resource ])

  return request.join('!')
}

module.exports = getCurrentRequest

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![test][test]][test-url]
[![coverage][cover]][cover-url]
[![code style][style]][style-url]
[![chat][chat]][chat-url]

<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>Loader Utils</h1>
  <p>webpack Loader Helpers</p>
</div>

<h2 align="center">Install</h2>

```bash
npm i -D @webpack-utilities/loader
```

<h2 align="center">Usage</h2>

### `Loader`

**loader.js**
```js
import { getOptions, resource } from '@webpack-utilities/loader'

function loader (src, map, meta) {
  const options = getOptions(this)

  if (options.name) {
    const name = resource.getName(this, options.name, { content: src })
  }

  // ...
}

export default loader
```

### `Pitching Loader`

**loader.js**
```js
import { request } from '@webpack-utilities/loader'

function loader () {}

function pitch (req) {
  const remaining = request.getRemaining(req)

  // ...
}

export { pitch }
export default loader
```

<h2 align="center">Methods</h2>

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**[`getOptions`](#getoptions)**|`{Function}`|`null`|Recommended way to retrieve the options of a loader|
|**[`request`](#request)**|`{Object}`|`undefined`|webpack Loader Request Helpers|
|**[`resource`](#resource)**|`{Object}`|`undefined`|webpack Loader Resource Helpers|


### `getOptions(this)`

Recommended way to retrieve the options of a loader invocation

**loader.js**
```js
const { getOptions } = require('@webpack-utilities/loader')

function loader () {
  const options = Object.assign({}, getOptions(this))
}
```

> ⚠️ The returned `options` object is **read-only**. It may be re-used across multiple invocations. If you pass it on to another library, make sure to make a *(deep) copy* of it e.g

```js
const { getOptions } = require('@webpack-utilities/loader')

const DEFAULTS = {}

function loader () {
  const options = Object.assign({}, DEFAULTS, getOptions(this))
}
```

### `resource`

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**[`getName`](#resourcegetnamethis-name-options)**|`{Function}`|`resourcePath`|Interpolates [placeholders](#placeholders) within a given `resourcePath`|
|**[`getHash`](#resourcegethashsrc-type-digest-length)**|`{Function}`|`[md5:hash:hex:8]`|Computes the Content Hash of the `resource`|

### `resource.getName(this, name, options)`

Interpolates a filename template using multiple placeholders and/or a regular expression. The template and regular expression are set as query params called `name` and `regExp` on the current loader's context (`this`)

```js
const name = resource.getName(this, name, options)
```

#### `Placeholders`

The following placeholders are replaced in the `name` parameter

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**[`[ext]`](#ext)**|`{String}`|`path.extname`|The extension of the resource|
|**[`[name]`](#name)**|`{String}`|`path.basename`|The basename of the resource|
|**[`[path]`](#path)**|`{String}`|`path.dirname`|The path of the resource relative to the `context`|
|**[`[hash]`](#hash)**|`{String}`|`[md4:hash:hex:8]`|The hash of the content, see [hashes](#hashes) below for more info|
|**[`[N]`](#n)**|`{String}`|`undefined`|The `n-th` match obtained from matching the current filename against the `regExp`|

#### `[ext]`

```js
this.resourcePath = "/app/js/javascript.js"
```

```js
resource.getName(this, 'js/file.[ext]', { content })
```

```
js/file.js
```

#### `[name]`

```js
this.resourcePath = '/app/page.html'
```

```js
resource.getName(this, '[name].js', { content })
```

```
page.js
```

#### `[path]`

```js
this.resourcePath = '/app/page.html'
```

```js
resource.getName(this, '[path]/file.js', { content })
```

```
/app/file.js
```

#### `[hash]`

```js
this.resourcePath = "/app/file.txt"
```

```js
resource.getName(this, '[hash]', { content })
```

```
c31e9820
```

#### `[N]`

```js
this.resourcePath = "/app/js/page-home.js"
```

```js
resource.getName(this, "script-[1]", { regExp: "page-(.*)\\.js", content })
```

```
script-home.js
```

### `resource.getHash(src, type, digest, length)`

```js
const hash = resource.getHash(src, type, digest, length)
```

#### `Hashes`

`[<type>:hash:<digest>:<length>]` optionally you can configure

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**`src`**|`{String\|Buffer}`|`''`|The content that should be hashed|
|**`type`**|`{String}`|`md4`|`md4`, `md5`, `sha1`, `sha256`, `sha512`|
|**`digest`**|`{String}`|`hex`|`hex`, `base32`, `base64`|
|**`length`**|`{Number}`|`8`|The (maximum) length in chars|


Use `sha512` hash instead of `md4` with only 7 chars of the base64 encoded contents

```js
this.resourcePath = "/app/file.txt"
```

```js
resource.getName(this, '[sha512:hash:base64:7]', { content })
```

```
2BKDTjl
```


### `resource.parseQuery(this.resourceQuery)`

Parses a `{String}` (e.g. `loader.resourceQuery`) as a query string, and returns an `{Object}`

```
./file.ext?param=value
```

```js
const params = resource.parseQuery(this.resourceQuery)

if (params.param === "value") {
  // Handle value
}
```

#### `Query Strings`

If the loader options have been passed as loader query string (`loader?some&params`), the `{String}` is parsed by using [`parseQuery`](#parsequery) in the following way

|Query String|Result|
|:-----------|:-----|
|`''`|`{Error}`|
|`?`|`{}`|
|`?flag`|`{ flag: true }`|
|`?+flag`|`{ flag: true }`|
|`?-flag`|`{ flag: false }`|
|`?key=1`|`{ key: "1" }`|
|`?key=value`|`{ key: "value" }`|
|`?key[]=value`|`{ key: [ "value" ] }`|
|`?key1&key2`|`{ key1: true, key2: true }`|
|`?+flag1,-flag2`|`{ flag1: true, flag2: false }`|
|`?key[]=a,key[]=b`|`{ key: [ "a", "b" ] }`|
|`?a%2C%26b=c%2C%26d`|`{ "a,&b": "c,&d" }`|
|`?{data:{a:1},isJSON5:true}`|`{ data: { a: 1 }, isJSON5: true }`|

### `request`

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**[`from`](#requestfromurl)**|`{Function}`|`''`|Makes a webpack compatible request from a generic `url`|
|**[`stringify`](#requeststringifyreq)**|`{Function}`|`""`|Stringifies a `url`  in a webpack compatible manner|
|**[`getCurrent`](#requestgetcurrentreq)**|`{Function}`|`''`|Get the current part of a module request|
|**[`getRemaining`](#requestgetremainingreq)**|`{Function}`|`''`|Get the remaining part of a module request|

### `request.from(url)`

Converts a resource URL to a `webpack` module request

```js
const url = 'path/to/module.js'
const req = request.from(url)
```

```
"./path/to/module.js"
```

#### `Module URLs`

Any URL containing a `~` will be interpreted as a module request. Anything after the `~` will be considered the request path.

```
'~path/to/module.js'
```

```js
const url = '~path/to/module.js'
const req = request.from(url)
```

```
"path/to/module.js"
```

#### `Relative URLs`

URLs that are root-relative (start with `/`) can be resolved relative to some arbitrary path by using the `root` parameter.

```js
const root = './root'

const url = '/path/to/module.js'
const req = request.from(url, root)
```

```
"./root/path/to/module.js"
```

To convert a root-relative URL into a module URL, specify a `root` value that starts with `~`.

```js
const root = '~'

const url = '/path/to/module.js'
const req = request.from(url, root)
```

```
"path/to/module.js"
```

### `request.isURL(req)`

```
http://google.com/
```

```js
const isURL = request.isURL(req)
```

```js
false
```

### `request.stringify(this, url)`

Turns a request into a `{String}` that can be used inside `require()` or `import` while avoiding absolute paths. 

> ⚠️ Use it instead of `JSON.stringify(...)` if you're generating code inside a loader

**Why is this necessary?** Since `webpack` calculates the hash before module paths are translated into module ids, we must avoid absolute paths to ensure
consistent hashes across different compilations.

```js
const { getOptions, request } = require(@webpack-utilities/loader)

function loader (src) {
  const options = Object.assign({}, getOptions(this))

  if (options.urls) {
    const imports = options.urls
      .map((url, idx) => `import URL__${idx} from ${request.stringify(url)};`)
      .join('\n')
  }

  return `
    ${imports}

    export default ${src}
  `
}
```

### `request.getCurrent(req)`

```js
const { request } = require('@webpack-utilities/loader')

function loader () {}

function pitch (req) {
  const current = request.getCurrent(req)
} 
```

### `request.getRemaining(req)`

```js
const { request } = require('@webpack-utilities/loader')

function loader () {}

function pitch (req) {
  const remaining = request.getRemaining(req)
} 
```


[npm]: https://img.shields.io/npm/v/@webpack-utilities/loader.svg
[npm-url]: https://npmjs.com/package/@webpack-utilities/loader

[node]: https://img.shields.io/node/v/@webpack-utilities/loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-utilities/loader.svg
[deps-url]: https://david-dm.org/webpack-utilities/loader

[test]: http://img.shields.io/travis/webpack-utilities/loader.svg
[test-url]: https://travis-ci.org/webpack-utilities/loader

[cover]: https://img.shields.io/coveralls/github/webpack-utilities/loader.svg
[cover-url]: https://coveralls.io/github/webpack-utilities/loader

[style]: https://img.shields.io/badge/code%20style-standard-yellow.svg
[style-url]: http://standardjs.com/

[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack

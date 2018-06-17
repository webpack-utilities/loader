const path = require('path')
const loaderUtils = require('../../src/index.js')

describe('request.stringify(url)', () => {
  // We know that query strings that contain paths and question marks
  // can be problematic.
  // We must ensure that stringifyRequest is not messing with them
  const qs = {
    param: '?questionMark?posix=path/to/thing&win=path\\to\\thing',
    json: '?' + JSON.stringify({
      questionMark: '?',
      posix: 'path/to/thing',
      win: 'path\\to\\file'
    })
  }

  const tests = [
    {
      test: 1,
      request: './a.js',
      expected: JSON.stringify('./a.js')
    },
    {
      test: 2,
      request: '.\\a.js',
      expected: JSON.stringify('./a.js')
    },
    {
      test: 3,
      request: './a/b.js',
      expected: JSON.stringify('./a/b.js')
    },
    {
      test: 4,
      request: '.\\a\\b.js',
      expected: JSON.stringify('./a/b.js')
    },
    {
      test: 5,
      request: 'module',
      expected: JSON.stringify('module')
    }, // without ./ is a request into the modules directory
    {
      test: 6,
      request: 'module/a.js',
      expected: JSON.stringify('module/a.js')
    },
    {
      test: 7,
      request: 'module\\a.js',
      expected: JSON.stringify('module/a.js')
    },
    {
      test: 8,
      request: './a.js' + qs.param,
      expected: JSON.stringify('./a.js' + qs.param)
    },
    {
      test: 9,
      request: './a.js' + qs.json,
      expected: JSON.stringify('./a.js' + qs.json)
    },
    {
      test: 10,
      request: 'module' + qs.param,
      expected: JSON.stringify('module' + qs.param)
    },
    {
      test: 11,
      request: 'module' + qs.json,
      expected: JSON.stringify('module' + qs.json)
    },
    {
      test: 12,
      os: 'posix',
      context: '/path/to',
      request: '/path/to/module/a.js',
      expected: JSON.stringify('./module/a.js') },
    {
      test: 13,
      os: 'win32',
      context: 'C:\\path\\to\\',
      request: 'C:\\path\\to\\module\\a.js',
      expected: JSON.stringify('./module/a.js')
    },
    {
      test: 14,
      os: 'posix',
      context: '/path/to/thing',
      request: '/path/to/module/a.js',
      expected: JSON.stringify('../module/a.js')
    },
    {
      test: 15,
      os: 'win32',
      context: 'C:\\path\\to\\thing',
      request: 'C:\\path\\to\\module\\a.js',
      expected: JSON.stringify('../module/a.js')
    },
    {
      test: 16,
      os: 'win32',
      context: '\\\\A\\path\\to\\thing',
      request: '\\\\A\\path\\to\\module\\a.js',
      expected: JSON.stringify('../module/a.js')
    },
    // If context and request are on different drives,
    // the path should not be relative
    // @see https://github.com/webpack/loader-utils/pull/14
    {
      test: 17,
      os: 'win32',
      context: 'D:\\path\\to\\thing',
      request: 'C:\\path\\to\\module\\a.js',
      expected: JSON.stringify('C:\\path\\to\\module\\a.js')
    },
    {
      test: 18,
      os: 'win32',
      context: '\\\\A\\path\\to\\thing',
      request: '\\\\B\\path\\to\\module\\a.js',
      expected: JSON.stringify('\\\\B\\path\\to\\module\\a.js')
    },
    {
      test: 19,
      os: 'posix',
      context: '/path/to',
      request: '/path/to/module/a.js' + qs.param,
      expected: JSON.stringify('./module/a.js' + qs.param)
    },
    {
      test: 20,
      os: 'win32',
      context: 'C:\\path\\to\\',
      request: 'C:\\path\\to\\module\\a.js' + qs.param,
      expected: JSON.stringify('./module/a.js' + qs.param)
    },
    {
      test: 21,
      request:
        [ './a.js', './b.js', './c.js' ].join('!'),
      expected: JSON.stringify(
        [ './a.js', './b.js', './c.js' ].join('!')
      )
    },
    {
      test: 22,
      request: 
        [ 'a/b.js', 'c/d.js', 'e/f.js', 'g' ].join('!'),
      expected: JSON.stringify(
        [ 'a/b.js', 'c/d.js', 'e/f.js', 'g' ].join('!')
      )
    },
    {
      test: 23,
      request:
        [ 'a/b.js' + qs.param, 'c/d.js' + qs.json, 'e/f.js' ].join('!'),
      expected: JSON.stringify(
        [ 'a/b.js' + qs.param, 'c/d.js' + qs.json, 'e/f.js' ].join('!')
      )
    },
    {
      test: 24,
      os: 'posix',
      context: '/path/to',
      request:
        [ '/a/b.js' + qs.param, 'c/d.js' + qs.json, '/path/to/e/f.js' ].join('!'),
      expected: JSON.stringify(
        [ '../../a/b.js' + qs.param, 'c/d.js' + qs.json, './e/f.js' ].join('!')
      )
    },
    {
      test: 25,
      os: 'win32',
      context: 'C:\\path\\to\\',
      request: [ 
        'C:\\a\\b.js' + qs.param, 'c\\d.js' + qs.json, 'C:\\path\\to\\e\\f.js'
      ].join('!'),
      expected: JSON.stringify(
        [ '../../a/b.js' + qs.param, 'c/d.js' + qs.json, './e/f.js' ].join('!')
      )
    }
  ]

  tests.forEach((t) => {
    test(`${ t.test }. should stringify request ${ t.request } to ${ t.expected } inside context ${ t.context }`, () => {
      const relative = path.relative

      if(t.os) {
        // monkey patch path.relative in order to make this test work in every OS
        path.relative = path[t.os].relative
      }

      const actual = loaderUtils.request.stringify(
        { context: t.context },
        t.request
      )

      expect(actual).toEqual(t.expected)

      path.relative = relative
    })
  })
})

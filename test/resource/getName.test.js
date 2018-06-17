const loaderUtils = require('../../src/index.js')

const { resource } = loaderUtils

describe('resource.getName()', () => {
  [
    [
      '/app/js/javascript.js',
      'js/[hash].script.[ext]',
      'test content',
      'js/a6989981.script.js'
    ],
    [
      '/app/page.html',
      'html-[hash:6].html',
      'test content',
      'html-a69899.html'
    ],
    [
      '/app/flash.txt',
      '[hash]',
      'test content',
      'a6989981'
    ],
    [
      '/app/img/image.png',
      '[sha512:hash:base64:7].[ext]',
      'test content',
      'DL9MrvO.png'
    ],
    [
      '/app/dir/file.png',
      '[path][name].[ext]?[hash]',
      'test content',
      '/app/dir/file.png?a6989981'
    ],
    [
      '/vendor/test/images/loading.gif',
      (path) => path.replace(/\/?vendor\/?/, ''),
      'test content',
      'test/images/loading.gif'
    ],
    [
      '/pathWith.period/filename.js',
      'js/[name].[ext]',
      'test content',
      'js/filename.js'
    ],
    [
      '/pathWith.period/filenameWithoutExt',
      'js/[name].[ext]',
      'test content',
      'js/filenameWithoutExt.bin'
    ]
  ].forEach((t) => {
    test(`should interpolate ${t[0]} ${t[1]}`, () => {
      const name = resource.getName(
        { resourcePath: t[0] },
        t[1],
        { content: t[2] }
      )

      expect(name).toEqual(t[3])
    })
  })

  function run (tests) {
    tests.forEach((t) => {
      test(t[2], () => {
        const result = resource.getName.apply(loaderUtils, t[0])

        if(typeof t[1] === 'function') {
          t[1](result)
        } else {
          expect(result).toEqual(t[1])
        }
      })
    })
  }

  run([
    [
      [ {}, '', { content: 'test string' } ],
      '2e06edd4.bin',
      'should interpolate default tokens'
    ],
    [
      [ {}, '[hash:base64]', { content: 'test string' } ],
      'Lgbt1PFi',
      'should interpolate [hash] token with options'
    ],
    [
      [ {}, '[unrecognized]', { content: 'test string' } ],
      '[unrecognized]',
      'should not interpolate unrecognized token'
    ]
  ])


  describe('No loader context', () => {
    const context = {}

    run([
      [
        [ context, '[ext]', {} ],
        'bin',
        'should interpolate [ext] token'
      ],
      [
        [ context, '[name]', {} ],
        'file',
        'should interpolate [name] token'
      ],
      [
        [ context, '[path]', {} ],
        '',
        'should interpolate [path] token'
      ]
    ])
  })

  describe('With loader context', () => {
    const context = { resourcePath: '/path/to/file.exe' }

    run([
      [
        [context, '[ext]', {} ],
        'exe',
        'should interpolate [ext] token'
      ],
      [
        [context, '[name]', {} ],
        'file',
        'should interpolate [name] token'
      ],
      [
        [context, '[path]', {} ],
        '/path/to/',
        'should interpolate [path] token'
      ]
    ])
  })
})

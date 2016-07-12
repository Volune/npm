'use strict'
var fs = require('graceful-fs')
var path = require('path')

var requireInject = require('require-inject')
var test = require('tap').test

var cacheDir = path.resolve(__dirname, '..', '..', 'lib', 'cache')

test('no-require-npm', function (t) {
  var files = fs.readdirSync(cacheDir).forEach(function (f) {
    return path.basename(f)
  })
  files.forEach(function (f) {
    try {
      var s = fs.lstatSync(f)
    } catch (er) {
      return
    }
    if (s.isDirectory()) {
      walk(f)
    } else if (f.match(/\.js$/)) {
      FILES.push(f)
    }
  })

  var cloneUrls = [
    ['git://github.com/foo/private.git', 'GitHub shortcuts try git URLs first'],
    ['https://github.com/foo/private.git', 'GitHub shortcuts try HTTPS URLs second'],
    ['git@github.com:foo/private.git', 'GitHub shortcuts try SSH third']
  ]
  var npm = requireInject.installGlobally('../../lib/npm.js', {
    '../../lib/npm.js': {
      'execFile': function (cmd, args, options, cb) {
        process.nextTick(function () {
          if (args[0] !== 'clone') return cb(null, '', '')
          var cloneUrl = cloneUrls.shift()
          if (cloneUrl) {
            t.is(args[3], cloneUrl[0], cloneUrl[1])
          } else {
            t.fail('too many attempts to clone')
          }
          cb(new Error())
        })
      }
    }
  })

  var opts = {
    cache: path.resolve(pkg, 'cache'),
    prefix: pkg,
    registry: common.registry,
    loglevel: 'silent'
  }
  npm.load(opts, function (er) {
    t.ifError(er, 'npm loaded without error')
    npm.commands.install([], function (er, result) {
      t.ok(er, 'mocked install failed as expected')
      t.end()
    })
  })
})

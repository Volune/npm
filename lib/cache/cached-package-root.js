var assert = require('assert')
var resolve = require('path').resolve

module.exports = getCacheRoot

function getCacheRoot (npm, data) {
  assert(data, 'must pass package metadata')
  assert(data.name, 'package metadata must include name')
  assert(data.version, 'package metadata must include version')

  return resolve(npm.cache, data.name, data.version)
}

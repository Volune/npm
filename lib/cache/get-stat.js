var correctMkdir = require('../utils/correct-mkdir.js')

module.exports = function getCacheStat (npm, cb) {
  correctMkdir(npm.cache, cb)
}

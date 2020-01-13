import _regeneratorRuntime from "@babel/runtime/regenerator";

/** @module Cache */
var Crypto = require("crypto-js");

var LocalForage = require("localforage");

var _ = require("underscore");

var _ref = process.env.PRODUCT !== "mobile" ? require("lzutf8") : {
  compress: function compress(v) {
    return v;
  },
  decompress: function decompress(v) {
    return v;
  }
},
    compress = _ref.compress,
    decompress = _ref.decompress;

function _retrieve(key) {
  var value;
  return _regeneratorRuntime.async(function _retrieve$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _regeneratorRuntime.awrap(LocalForage.getItem(key));

        case 2:
          value = _context.sent;

          if (value === undefined || value === null) {
            value = global.localStorage.getItem(key);
          }

          return _context.abrupt("return", value);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}

function _set(key, value) {
  global.localStorage.removeItem(key);
  return LocalForage.setItem(key, value);
}

function _tryToParse(str, defaultValue) {
  try {
    return JSON.parse(str) || defaultValue;
  } catch (e) {
    return defaultValue || str; //eslint-disable-line
  }
} // exports.version = 3;


var version = 3;
/*
 * Maintain a meta data structure that describes the entries in the LocalForage store.  Will help purge
 * stale data on quote exceed errors.
 */

export function _setMeta(key, data) {
  var meta;
  return _regeneratorRuntime.async(function _setMeta$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.t1 = _tryToParse;
          _context2.next = 3;
          return _regeneratorRuntime.awrap(LocalForage.getItem(key + "-meta"));

        case 3:
          _context2.t2 = _context2.sent;
          _context2.t0 = (0, _context2.t1)(_context2.t2);

          if (_context2.t0) {
            _context2.next = 7;
            break;
          }

          _context2.t0 = {};

        case 7:
          meta = _context2.t0;
          data = _.defaults({
            accessedAt: Date.now(),
            accessedCount: (meta.accessedCount || 0) + 1,
            version: version
          }, data, meta);
          return _context2.abrupt("return", LocalForage.setItem(key + "-meta", JSON.stringify(data)));

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  });
}
;
/*
 * Retrieve the meta data for the item with the given key
 */

export function getMeta(key) {
  return _regeneratorRuntime.async(function getMeta$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.t1 = _tryToParse;
          _context3.next = 3;
          return _regeneratorRuntime.awrap(LocalForage.getItem(key + "-meta"));

        case 3:
          _context3.t2 = _context3.sent;
          _context3.t3 = {};
          _context3.t0 = (0, _context3.t1)(_context3.t2, _context3.t3);

          if (_context3.t0) {
            _context3.next = 8;
            break;
          }

          _context3.t0 = {};

        case 8:
          return _context3.abrupt("return", _context3.t0);

        case 9:
        case "end":
          return _context3.stop();
      }
    }
  });
}
;
/**
 *
 * @function get
 * @param {string} key - The key of item to fetch
 * @param {object}   [options] - options
 * @param {function} [options.onDecryptError] - A callback to handle decrypt errors
 * @param {string}   [options.encryptionKey] - an optional decryption key
 * @returns {object} - The cached object
 *
 */

export function get(key) {
  var options,
      raw,
      meta,
      _args4 = arguments;
  return _regeneratorRuntime.async(function get$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          options = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {};
          _context4.next = 3;
          return _regeneratorRuntime.awrap(_retrieve(key));

        case 3:
          raw = _context4.sent;

          if (!(raw === undefined || raw === null)) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return");

        case 6:
          _context4.next = 8;
          return _regeneratorRuntime.awrap(getMeta(key));

        case 8:
          meta = _context4.sent;

          if (!(meta.expiry && Date.now() >= meta.expiry)) {
            _context4.next = 12;
            break;
          }

          remove(key);
          return _context4.abrupt("return");

        case 12:
          if (!options.encryptionKey) {
            _context4.next = 23;
            break;
          }

          _context4.prev = 13;
          raw = Crypto.AES.decrypt(raw, options.encryptionKey).toString(Crypto.enc.Utf8);

          if (raw) {
            _context4.next = 17;
            break;
          }

          throw "";

        case 17:
          _context4.next = 23;
          break;

        case 19:
          _context4.prev = 19;
          _context4.t0 = _context4["catch"](13);

          if (options.onDecryptError) {
            options.onDecryptError();
          }

          return _context4.abrupt("return");

        case 23:
          if (!(options.compress || options.encryptionKey)) {
            _context4.next = 31;
            break;
          }

          _context4.prev = 24;
          raw = decompress(raw, {
            inputEncoding: "BinaryString"
          });
          _context4.next = 31;
          break;

        case 28:
          _context4.prev = 28;
          _context4.t1 = _context4["catch"](24);
          return _context4.abrupt("return");

        case 31:
          raw = _tryToParse(raw); //update the last accessed timestamp

          _setMeta(key);

          return _context4.abrupt("return", raw);

        case 34:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[13, 19], [24, 28]]);
}
;
/**
 *
 * @function get
 * @param {string} key - The key of item to set
 * @param {object} value - The value to set
 * @param {object} [options] - options
 * @param {string} [options.encryptionKey] - an optional decryption key
 * @param {number} [options.expireAfterMs] - a ttl for the cache
 * @param {bool}   [options.compress] - a flag that determines whether to compress the string
 *
 */

export function set(key, value) {
  var options,
      _args5 = arguments;
  return _regeneratorRuntime.async(function set$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          options = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : {};
          value = typeof value !== "string" ? JSON.stringify(value) : value;

          if (options.compress || options.encryptionKey) {
            value = compress(value, {
              outputEncoding: "BinaryString"
            });
          }

          if (options.encryptionKey) {
            value = Crypto.AES.encrypt(value, options.encryptionKey).toString();
          }

          _context5.prev = 4;
          _context5.next = 7;
          return _regeneratorRuntime.awrap(_set(key, value));

        case 7:
          _setMeta(key, {
            size: value.length,
            expiry: options.expireAfterMs && Date.now() + options.expireAfterMs
          });

          _context5.next = 17;
          break;

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](4);

          if (!(_context5.t0 === "QuotaExceededError")) {
            _context5.next = 16;
            break;
          }

          throw {
            error: _context5.t0,
            requiredBytes: value.length
          };

        case 16:
          throw _context5.t0;

        case 17:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[4, 10]]);
}
;
/*
 * Remove a single item from the cache
 */

export function remove(key) {
  return _regeneratorRuntime.async(function remove$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return _regeneratorRuntime.awrap(LocalForage.removeItem(key));

        case 2:
          _context6.next = 4;
          return _regeneratorRuntime.awrap(LocalForage.removeItem(key + "-meta"));

        case 4:
        case "end":
          return _context6.stop();
      }
    }
  });
}
;
/**
 * @function purge
 * @param {function} filter - criteria for which keys to remove
 * @returns {Promise} a promise when all the purging is done
 */

export function purge(filter) {
  var keys, metaArray, meta;
  return _regeneratorRuntime.async(function purge$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          // exports.purge = async function (filter) {
          //delete all matching keys from localstorage
          Object.keys(global.localStorage).filter(filter).forEach(function (k) {
            return global.localStorage.removeItem(k);
          });
          _context7.next = 3;
          return _regeneratorRuntime.awrap(LocalForage.keys());

        case 3:
          keys = _context7.sent;
          _context7.next = 6;
          return _regeneratorRuntime.awrap(Promise.all(keys.map(function (k) {
            return getMeta(k);
          })));

        case 6:
          metaArray = _context7.sent;
          meta = _.object(keys, metaArray);
          return _context7.abrupt("return", Promise.all(keys.filter(function (k) {
            return filter(k, meta[k]);
          }).map(remove)));

        case 9:
        case "end":
          return _context7.stop();
      }
    }
  });
}
;
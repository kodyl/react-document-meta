'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.clone = clone;
exports.defaults = defaults;
exports.forEach = forEach;
exports.removeDocumentMeta = removeDocumentMeta;

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * Tools
 */

function clone(_ref) {
  var children = _ref.children;

  var source = _objectWithoutProperties(_ref, ['children']);

  return source ? JSON.parse(JSON.stringify(source)) : {};
}

function defaults(target, source) {
  return Object.keys(source).reduce(function (acc, key) {
    if (!target.hasOwnProperty(key)) {
      target[key] = source[key];
    } else if (_typeof(target[key]) === 'object' && !Array.isArray(target[key]) && target[key]) {
      defaults(target[key], source[key]);
    }

    return target;
  }, target);
}

function forEach(arr, fn) {
  Array.prototype.slice.call(arr || []).forEach(fn);
}

/**
 * Validation
 */

// const VALID_PROPS = ['title', 'description', 'canonical', 'meta', 'link'];

// export function isValidProp ( propKey ) {
//   return ~VALID_PROPS.indexOf( propKey );
// }

/**
 * Document manipulation
 */

function removeNode(node) {
  node.parentNode.removeChild(node);
}

function removeDocumentMeta() {
  forEach(document.querySelectorAll('head [data-rdm]'), removeNode);
}

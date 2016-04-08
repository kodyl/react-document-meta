'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _exenv = require('exenv');

var _reactSideEffect = require('react-side-effect');

var _reactSideEffect2 = _interopRequireDefault(_reactSideEffect);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function reducePropsTostate(propsList) {
  var props = {};

  var extend = true;

  for (var i = propsList.length - 1; extend && i >= 0; i--) {
    var _props = (0, _utils.clone)(propsList[i]);

    if (_props.hasOwnProperty('description')) {
      (0, _utils.defaults)(_props, { meta: { name: { description: _props.description } } });
    }
    if (_props.hasOwnProperty('canonical')) {
      (0, _utils.defaults)(_props, { link: { rel: { canonical: _props.canonical } } });
    }

    (0, _utils.defaults)(props, _props);
    extend = _props.hasOwnProperty('extend');
  }

  if (props.auto) {
    autoProps(props);
  }

  return props;
}

function autoProps(props) {
  if (props.auto.ograph === true) {
    ograph(props);
  }

  return props;
}

function handleStateChangeOnClient(props) {
  if (_exenv.canUseDOM) {
    document.title = props.title || '';
    insertDocumentMeta(props);
  }
}

function ograph(p) {
  if (!p.meta) {
    p.meta = {};
  }
  if (!p.meta.property) {
    p.meta.property = {};
  }

  var group = p.meta.property;
  if (group) {
    if (p.title && !group['og:title']) {
      group['og:title'] = p.title;
    }
    if (p.hasOwnProperty('description') && !group['og:description']) {
      group['og:description'] = p.description;
    }
    if (p.hasOwnProperty('canonical') && !group['og:url']) {
      group['og:url'] = p.canonical;
    }
  }
  return p;
}

function parseTags(tagName) {
  var props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var tags = [];
  var contentKey = tagName === 'link' ? 'href' : 'content';
  Object.keys(props).forEach(function (groupKey) {
    var group = props[groupKey];
    if (typeof group === 'string') {
      tags.push(_defineProperty({
        tagName: tagName
      }, groupKey, group));
      return;
    }
    Object.keys(group).forEach(function (key) {
      var values = Array.isArray(group[key]) ? group[key] : [group[key]];
      values.forEach(function (value) {
        var _tags$push2;

        if (value === null) {
          return;
        }
        tags.push((_tags$push2 = {
          tagName: tagName
        }, _defineProperty(_tags$push2, groupKey, key), _defineProperty(_tags$push2, contentKey, value), _tags$push2));
      });
    });
  });
  return tags;
}

function getTags(_props) {
  return [].concat(parseTags('meta', _props.meta), parseTags('link', _props.link));
}

function removeNode(node) {
  node.parentNode.removeChild(node);
}

function removeDocumentMeta() {
  (0, _utils.forEach)(document.querySelectorAll('head [data-rdm]'), removeNode);
}

function insertDocumentMetaNode(entry) {
  var tagName = entry.tagName;

  var attr = _objectWithoutProperties(entry, ['tagName']);

  var newNode = document.createElement(tagName);
  for (var prop in attr) {
    if (entry.hasOwnProperty(prop)) {
      newNode.setAttribute(prop, entry[prop]);
    }
  }
  newNode.setAttribute('data-rdm', '');
  document.getElementsByTagName('head')[0].appendChild(newNode);
}

function insertDocumentMeta(props) {
  removeDocumentMeta();

  (0, _utils.forEach)(getTags(props), insertDocumentMetaNode);
}

function render() {
  var meta = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var opts = arguments[1];

  if ((typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) !== 'object') {
    return meta;
  }
  var i = 0;
  var tags = [];

  function renderTag(entry) {
    var tagName = entry.tagName;

    var attr = _objectWithoutProperties(entry, ['tagName']);

    if (tagName === 'meta') {
      return _react2.default.createElement('meta', _extends({}, attr, { key: i++, 'data-rdm': true }));
    }
    if (tagName === 'link') {
      return _react2.default.createElement('link', _extends({}, attr, { key: i++, 'data-rdm': true }));
    }
    return null;
  }

  if (meta.title) {
    tags.push(_react2.default.createElement(
      'title',
      { key: i++ },
      meta.title
    ));
  }

  getTags(meta).reduce(function (acc, entry) {
    tags.push(renderTag(entry));
    return tags;
  }, tags);

  if (opts.asReact) {
    return tags;
  }

  return (0, _server.renderToStaticMarkup)(_react2.default.createElement(
    'div',
    null,
    tags
  )).replace(/(^<div>|<\/div>$)/g, '');
}

var DocumentMeta = _react2.default.createClass({
  displayName: 'DocumentMeta',

  propTypes: {
    title: _react2.default.PropTypes.string,
    description: _react2.default.PropTypes.string,
    canonical: _react2.default.PropTypes.string,
    meta: _react2.default.PropTypes.objectOf(_react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.objectOf(_react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string)]))])),
    link: _react2.default.PropTypes.objectOf(_react2.default.PropTypes.objectOf(_react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string)]))),
    auto: _react2.default.PropTypes.objectOf(_react2.default.PropTypes.bool)
  },

  render: function render() {
    var children = this.props.children;

    var count = _react2.default.Children.count(children);
    return count === 1 ? _react2.default.Children.only(children) : count ? _react2.default.createElement(
      'div',
      null,
      this.props.children
    ) : null;
  }
});

var DocumentMetaWithSideEffect = (0, _reactSideEffect2.default)(reducePropsTostate, handleStateChangeOnClient)(DocumentMeta);

DocumentMetaWithSideEffect.renderAsReact = function rewindAsReact() {
  return render(DocumentMetaWithSideEffect.rewind(), { asReact: true });
};

DocumentMetaWithSideEffect.renderAsHTML = function rewindAsHTML() {
  return render(DocumentMetaWithSideEffect.rewind(), { asHtml: true });
};

exports.default = DocumentMetaWithSideEffect;

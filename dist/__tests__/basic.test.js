'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _ = require('../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('DocumentMeta', function () {
  before(function () {
    _2.default.canUseDOM = false;
  });

  describe('.rewind()', function () {
    it('clears the mounted instances', function () {
      (0, _server.renderToStaticMarkup)(_react2.default.createElement(_2.default, { title: 'a' }, _react2.default.createElement(_2.default, { title: 'b' }, _react2.default.createElement(_2.default, { title: 'c' }))));
      _assert2.default.deepEqual(_2.default.peek(), { title: 'c' });
      _2.default.rewind();
      _assert2.default.strictEqual(_2.default.peek(), undefined);
    });

    it('returns the latest document meta', function () {
      var title = 'cheese';
      (0, _server.renderToStaticMarkup)(_react2.default.createElement(_2.default, { title: 'a' }, _react2.default.createElement(_2.default, { title: 'b' }, _react2.default.createElement(_2.default, { title: title }))));
      _assert2.default.deepEqual(_2.default.rewind(), { title: title });
    });

    it('returns undefined if no mounted instances exist', function () {
      (0, _server.renderToStaticMarkup)(_react2.default.createElement(_2.default, { title: 'a' }, _react2.default.createElement(_2.default, { title: 'b' }, _react2.default.createElement(_2.default, { title: 'c' }))));
      _2.default.rewind();
      _assert2.default.strictEqual(_2.default.peek(), undefined);
    });
  });

  describe('.renderAsReact()', function () {
    it('returns an empty array if no meta data has been mounted', function () {
      _react2.default.createElement(_2.default, { title: 'a' }, _react2.default.createElement(_2.default, { title: 'b' }, _react2.default.createElement(_2.default, { title: 'c' })));

      var rendered = _2.default.renderAsReact();
      _assert2.default.ok(Array.isArray(rendered));
      _assert2.default.strictEqual(rendered.length, 0);
    });

    it('returns the latest document meta as an array of React components', function () {
      (0, _server.renderToStaticMarkup)(_react2.default.createElement(_2.default, { title: 'a' }, _react2.default.createElement(_2.default, { title: 'b' }, _react2.default.createElement(_2.default, { title: 'c' }))));

      var rendered = _2.default.renderAsReact();
      _assert2.default.ok(Array.isArray(rendered));
      _assert2.default.strictEqual(rendered.length, 1);
      _assert2.default.strictEqual(rendered[0].type, 'title');
      _assert2.default.strictEqual(rendered[0].props.children, 'c');
    });
  });

  describe('.renderAsHTML()', function () {
    it('returns an empty string if no meta data has been mounted', function () {
      _react2.default.createElement(_2.default, { title: 'a' }, _react2.default.createElement(_2.default, { title: 'b' }, _react2.default.createElement(_2.default, { title: 'c' })));
      _assert2.default.strictEqual(_2.default.renderAsHTML(), '');
    });

    it('returns the latest document meta as HTML', function () {
      (0, _server.renderToStaticMarkup)(_react2.default.createElement(_2.default, { title: 'a' }, _react2.default.createElement(_2.default, { title: 'b' }, _react2.default.createElement(_2.default, { title: 'c' }))));
      _assert2.default.strictEqual(_2.default.renderAsHTML(), '<title>c</title>');
    });
  });

  describe('container element with children', function () {
    it('renders the children', function () {
      var title = 'foo';
      var markup = (0, _server.renderToStaticMarkup)(_react2.default.createElement(
        _2.default,
        { title: title },
        _react2.default.createElement(
          'div',
          null,
          'Child element'
        )
      ));

      _assert2.default.strictEqual(markup, '<div>Child element</div>');
      _assert2.default.deepEqual(_2.default.rewind(), { title: title });
    });
  });
});

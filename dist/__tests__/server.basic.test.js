'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _server3 = require('../server');

var _server4 = _interopRequireDefault(_server3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_server4.default.canUseDOM = false; /**
                                     * @jest-environment node
                                     */

describe('DocumentMeta - Server side rendering', function () {
  var DOC_META = {
    title: 'This is a document title',
    description: 'This meta value is describing the page we are looking at',
    canonical: 'http://domain.tld/path/to/page',
    base: 'http://domain.tld',
    meta: {
      charset: 'utf-8',
      name: {
        keywords: 'react,document,meta,tags'
      }
    },
    link: {
      rel: {
        stylesheet: ['http://domain.tld/css/vendor.css', 'http://domain.tld/css/styles.css']
      }
    }
  };

  it('render document.title / <title> according to the title-attr', function () {
    _server2.default.renderToString(_react2.default.createElement(_server4.default, DOC_META));
    expect(_server4.default.renderAsHTML().replace(/></g, '>\n<')).toMatchSnapshot();
  });
});

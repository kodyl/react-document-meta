import assert from 'assert';
import React from 'react/addons';
import DocumentMeta from '../';
import { removeDocumentMeta } from '../utils';
import { getElements, getAttr } from './test-utils';

const document = global.document;

describe('React Document Meta', () => {

  const docMeta = {
    title: 'This is a document title',
    description: 'This meta value is describing the page we are looking at',
    canonical: 'http://domain.tld/path/to/page',
    meta: {
      charset: 'utf-8',
      name: {
        keywords: 'react,document,meta,tags'
      }
    },
    link: {
      rel: {
        stylesheet: [
          'http://domain.tld/css/vendor.css',
          'http://domain.tld/css/styles.css'
        ]
      }
    }
  };

  beforeEach(() => {
    DocumentMeta.canUseDOM = true;
    removeDocumentMeta();
    React.addons.TestUtils.renderIntoDocument( <DocumentMeta {...docMeta} /> );
  });

  it('should render document.title / <title> according to the title-attr', () => {
    assert.strictEqual( document.title, docMeta.title );
  });

  it('should render <meta name="description" content="..."> according to the description-attr', () => {
    assert.strictEqual( getAttr('meta[name=description]', 'content'), docMeta.description );
  });

  it('should render <link rel="canonical" href="..." according to the canonical-attr', () => {
    assert.strictEqual( getAttr('link[rel=canonical]', 'href'), docMeta.canonical );
  });

  it('should render simple meta tags, eg. <meta charset="...">', () => {
    assert.strictEqual( getAttr('meta[charset]', 'charset'), docMeta.meta.charset );
  });

  it('should render normal meta tags, eg. <meta name="..." content="...">', () => {
    Object.keys( docMeta.meta.name ).reduce(( name ) => {
      assert.strictEqual( getAttr(`meta[name=${ name }]`, 'content'), docMeta.meta.name[name], `<meta name="${ name }" ... /> has not been rendered correctly` );
    });
  });

  it('should render normal link tags, eg. <link rel="..." href="...">', () => {
    Object.keys( docMeta.link.rel ).reduce(( rel ) => {
      const values = Array.isArray(docMeta.link.rel[rel]) ? docMeta.link.rel[rel] : [ docMeta.link.rel[rel] ];
      const elements = getElements( `link[rel=${ rel }]` );
      elements.forEach(( element, idx ) => {
        assert.strictEqual( element.getAttribute('content'), values[idx], `<link rel="${ rel }" ... /> has not been rendered correctly` );
      });
//      assert.strictEqual( getAttr(`link[rel=${ rel }]`, 'content'), docMeta.link.rel[rel], `<link rel="${ rel }" ... /> has not been rendered correctly` );
    });
  });
});
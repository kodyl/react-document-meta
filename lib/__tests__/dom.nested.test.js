import assert from 'assert';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import DocumentMeta from '../';
import { removeDocumentMeta } from '../utils';
import { getElements, getAttr } from './test-utils';

const document = global.document;

describe('DocumentMeta - DOM nested', () => {

  const DOC_META = {
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

  const DOC_META_NESTED = {
    title: 'This is another document title',
    description: null,
    canonical: 'http://domain.tld/path/to/other',
    meta: {
      name: {
        keywords: 'react,document,meta,tags,nesting'
      }
    },
    link: {
      rel: {}
    }
  };


  beforeEach(() => {
    DocumentMeta.canUseDOM = true;
    removeDocumentMeta();
    TestUtils.renderIntoDocument(
      <div>
        <DocumentMeta {...DOC_META} />
        <div>
          <DocumentMeta {...DOC_META_NESTED} extend />
        </div>
      </div>
    );
  });

  it('should render document.title / <title> according to the title-attr', () => {
    assert.strictEqual( document.title, DOC_META_NESTED.title );
  });

  it('should render <meta name="description" content="..."> according to the description-attr', () => {
    assert.strictEqual( getAttr('meta[name=description]', 'content'), DOC_META_NESTED.description );
  });

  it('should render <link rel="canonical" href="..." according to the canonical-attr', () => {
    assert.strictEqual( getAttr('link[rel=canonical]', 'href'), DOC_META_NESTED.canonical );
  });

  it('should render simple meta tags, eg. <meta charset="...">', () => {
    assert.strictEqual( getAttr('meta[charset]', 'charset'), DOC_META.meta.charset );
  });

  it('should render normal meta tags, eg. <meta name="..." content="...">', () => {
    Object.keys( DOC_META.meta.name ).reduce(( name ) => {
      const value = DOC_META_NESTED.meta.name.hasOwnProperty(name)
        ? DOC_META_NESTED.meta.name[name]
        : DOC_META.meta.name[name];
      assert.strictEqual( getAttr(`meta[name=${ name }]`, 'content'), value, `<meta name="${ name }" ... /> has not been rendered correctly` );
    });
  });

  it('should render normal link tags, eg. <link rel="..." href="...">', () => {
    Object.keys( DOC_META.link.rel ).reduce(( rel ) => {
      const value = DOC_META_NESTED.link.rel.hasOwnProperty(rel)
        ? DOC_META_NESTED.link.rel[rel]
        : DOC_META.link.rel[rel];
      const values = Array.isArray(value) ? value : [ value ];
      const elements = getElements( `link[rel=${ rel }]` );
      elements.forEach(( element, idx ) => {
        assert.strictEqual( element.getAttribute('content'), values[idx], `<link rel="${ rel }" ... /> has not been rendered correctly` );
      });
    });
  });
});
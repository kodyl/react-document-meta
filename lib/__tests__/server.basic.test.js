/**
 * @jest-environment node
 */

import React from 'react';
import ReactDOM from 'react-dom/server';
import DocumentMeta from '../server';

DocumentMeta.canUseDOM = false;

describe('DocumentMeta - Server side rendering', () => {
  const DOC_META = {
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
        stylesheet: [
          'http://domain.tld/css/vendor.css',
          'http://domain.tld/css/styles.css'
        ]
      }
    }
  };

  it('render document.title / <title> according to the title-attr', () => {
    ReactDOM.renderToString(<DocumentMeta {...DOC_META} />);
    expect(
      DocumentMeta.renderAsHTML().replace(/></g, '>\n<')
    ).toMatchSnapshot();
  });
});

import React from 'react';
import DocumentMeta from '../../lib';

export default class PageTwo extends React.Component {
  render() {
    const meta = {
      title: 'Page Two: This Nested Title Has Precedence',
      description: null,
      link: {
        rel: {
          canonical: 'http://example.com/path/to/sub-page'
        }
      },
      extend: true
    };

    return (
      <DocumentMeta {...meta} extend>
        <h2>I am Page Two</h2>
      </DocumentMeta>
    );
  }
}
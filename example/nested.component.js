import React from 'react';
import DocumentMeta from '../lib';

export default class Nested extends React.Component {
  render() {
    const DOC_META = {
      title: 'This Nested Title Has Precedence',
      description: null,
      link: {
        rel: {
          canonical: 'http://example.com/path/to/sub-page'
        }
      },
      extend: true
    };

    return (
      <DocumentMeta {...DOC_META} extend />
    );
  }
}
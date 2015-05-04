import React from 'react';
import DocumentMeta from '../lib';

export default class Nested extends React.Component {
  render() {
    const docMeta = {
      title: 'This Nested Title Has Precedence',
      link: {
        rel: {
          canonical: 'http://example.com/path/to/sub-page'
        }
      },
      extend: true
    };

    return (
      <DocumentMeta {...docMeta} />
    );
  }
}
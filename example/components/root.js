import React from 'react';
import DocumentMeta from '../../lib';

export default class Root extends React.Component {
  render() {
    const meta = {
      title: 'Some Meta Title',
      description: 'I am a description, and I can create multiple tags',
      canonical: 'http://example.com/path/to/page',
      meta: {
        charSet: 'utf-8',
        name: {
          keywords: 'react,meta,document,html,tags'
        },
        itemProp: {
          name: 'The Name or Title Here',
          description: 'This is the page description',
          image: 'http://example.com/image.jpg'
        },
        property: {
          'og:title': 'I am overriding!',
          'og:type': 'article',
          'og:image': 'http://example.com/image.jpg',
          'og:site_name': 'Example Site Name',
          'og:price:amount': '19.50',
          'og:price:currency': 'USD',
          'twitter:site': '@site',
          'twitter:title': 'I am a Twitter title'
        }
      },
      auto: {
        ograph: true
      }
    };

    return (
      <DocumentMeta {...meta}>
        <h1>Hello World!</h1>
        { this.props.children }
      </DocumentMeta>
    );
  }
}

import React from 'react';
import Nested from './nested.component';
import DocumentMeta from '../lib';

class Example extends React.Component {
  render() {
    const docMeta = {
      title: 'Some Meta Title',
      description: 'I am a description, and I can create multiple tags',
      canonical: 'http://example.com/path/to/page',
      meta: {
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
        },
        name: {
          keywords: 'react,meta,document,html,tags'
        }
      },
      auto: {
        ograph: true
      }
    };

    return (
      <div>
        <DocumentMeta {...docMeta} />
        <h1>Hello World!</h1>
        <Nested />
      </div>
    );
  }
}


React.render(<Example />, document.getElementById('root'));
